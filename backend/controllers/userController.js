import path from "path";
import { createChat } from "../db/chatDb.js";
import {
  createTakenUsername,
  createUserFriends,
  findAllUsers,
  findOtherFriendRequesting,
  findTakenUsername,
  findUserFriendById,
  findUserFriends,
  makeUserFriends,
  updateUser,
} from "../db/userDb.js";
import {
  getFilePathFromPublicUrl,
  jwtUserIdMatches,
  lengthErr,
  requiredErr,
} from "../utils.js";
import { supabase } from "../lib/supabase.js";
import { findUserById, findUserInfoById } from "../db/authorizationDb.js";
import { body, matchedData, validationResult } from "express-validator";

const validateSettingsForm = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Username ${requiredErr}`)
    .bail()
    .isLength({ min: 3, max: 64 })
    .withMessage(`Username ${lengthErr(3, 64)}`)
    .bail()
    .custom((value) => !/\s/.test(value))
    .withMessage("Username must not contain any spaces")
    .bail()
    .custom((value) => /^[a-z0-9._-]+$/i.test(value))
    .withMessage(
      "Username must only have letters, numbers, periods, hyphens, or underscores",
    )
    .bail()
    .custom((value) =>
      /^(?!.*\.(?:com|net|org|io|co|us|uk|ca|ie|au)$)[a-z0-9]+(?:[._-][a-z0-9]+)*$/i.test(
        value,
      ),
    )
    .withMessage(
      "Username must start and end with a letter or number, cannot have two symbols in a row (like .., --, ._), and cannot end with a domain extension (.com)",
    )
    .bail()
    .custom(async (value) => {
      const usernameExists = await findTakenUsername(value);

      if (usernameExists) {
        throw new Error("Username already in database");
      }

      return true;
    })
    .withMessage("The username has already been taken"),
];

async function getAllUsers(req, res, next) {
  try {
    const users = await findAllUsers();

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: users,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  // gets user info including email and password, so it must be secure!
  const { userId } = req.params;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    const userInfo = await findUserById(userId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: userInfo,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

async function getUserInfo(req, res, next) {
  // get the user info without the password
  const { userId } = req.params;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    const userInfo = await findUserInfoById(userId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: userInfo,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

// first, valid the form fields (just username for now)!
const putUser = [
  validateSettingsForm,
  async (req, res, next) => {
    // error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        apiVersion: "1.0",
        status: "error",
        data: {
          ...req.body,
        },
        errors: errors.array(),
      });
    }

    const { userId } = req.params;
    const { username } = matchedData(req);
    const { originalProfile, makeDefaultProfile, previousUsername } = req.body;
    const profile = req.file;
    let profileUrl = originalProfile;

    try {
      const jwtToken = req.headers["authorization"].split(" ")[1];
      const userIdMatches = jwtUserIdMatches(userId, jwtToken);
      if (!userIdMatches)
        throw new Error("Signed in user's id doesn't match params user id.");

      // get user
      const user = await findUserById(userId);
      if (!user) throw new Error("User does not exist.");

      // update the profile (doesn't check if the same for now)
      if (profile) {
        const filePath = `${userId}/${crypto.randomUUID()}${path.extname(profile.originalname)}`;
        const { data: profileData, error: profileError } =
          await supabase.storage
            .from("User Profiles")
            .upload(filePath, profile.buffer, {
              contentType: profile.mimetype,
            });

        if (profileError) throw new Error(profileError.message);

        // delete previous image if applicable
        const previousFilePath = getFilePathFromPublicUrl(user.profile);
        if (previousFilePath && user.profile) {
          const { data: removeData, error: removeError } =
            await supabase.storage
              .from("User Profiles")
              .remove([previousFilePath]);

          if (removeError) throw new Error(removeError.message);
          if (!removeData || removeData.length === 0)
            throw new Error(
              "File was not deleted (RLS policy or previousFilePath most likely).",
            );
        }

        // get publicUrl
        const { data: urlData } = supabase.storage
          .from("User Profiles")
          .getPublicUrl(filePath);

        profileUrl = urlData.publicUrl;
      } else if (makeDefaultProfile === "true") {
        // delete previous image if applicable
        const previousFilePath = getFilePathFromPublicUrl(user.profile);
        if (previousFilePath && user.profile) {
          const { data: removeData, error: removeError } =
            await supabase.storage
              .from("User Profiles")
              .remove([previousFilePath]);

          if (removeError) throw new Error(removeError.message);
          if (!removeData || removeData.length === 0)
            throw new Error(
              "File was not deleted (RLS policy or previousFilePath most likely).",
            );
        }

        profileUrl = process.env.DEFAULT_PROFILE_URL;
      }

      // add username to the list of taken usernames
      await createTakenUsername(previousUsername);

      const updatedUser = await updateUser(
        userId,
        profileUrl,
        username,
        previousUsername,
      );

      return res.json({
        apiVersion: "1.0",
        status: "success",
        data: updatedUser,
        errors: null,
      });
    } catch (err) {
      next(err);
    }
  },
];

async function getUserFriends(req, res, next) {
  const { userId } = req.params;

  try {
    const otherFriendRequesting = await findOtherFriendRequesting(userId);
    const userFriends = await findUserFriends(userId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: [...otherFriendRequesting, ...userFriends],
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

async function getUserFriend(req, res, next) {
  const { userId, friendId } = req.params;

  try {
    const userFriend = await findUserFriendById(userId, friendId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: [otherUserFriends, userFriend],
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

async function createFriendRequest(req, res, next) {
  const { userId, friendId } = req.params;

  // check that the user hasn't already requested/been friends
  try {
    const userFriend = await findUserFriendById(userId, friendId);

    if (userFriend) {
      return res.json({
        apiVersion: "1.0",
        status: "error",
        data: {
          message: "A message request had already been made!",
        },
        errors: null,
      });
    }
  } catch (err) {
    next(err);
  }

  try {
    const userFriends = await createUserFriends(userId, friendId);
    const otherUserFriends = await findUserFriendById(friendId, userId);

    // if other person already requested, then make them message (and friends)!
    if (userFriends && otherUserFriends) {
      await makeUserFriends(userFriends.id, otherUserFriends.id);

      // make a chat with the two users as well!
      await createChat(userId, friendId);

      return res.json({
        apiVersion: "1.0",
        status: "success",
        data: {
          ...userFriends,
          accepted: true,
        },
        errors: null,
      });
    }

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: userFriends,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

export {
  getAllUsers,
  getUser,
  getUserInfo,
  putUser,
  getUserFriends,
  getUserFriend,
  createFriendRequest,
};
