import path from "path";
import { createChat } from "../db/chatDb.js";
import {
  createUserFriends,
  findAllUsers,
  findOtherFriendRequesting,
  findUserFriendById,
  findUserFriends,
  makeUserFriends,
  updateUser,
} from "../db/userDb.js";
import { getFilePathFromPublicUrl, jwtUserIdMatches } from "../utils.js";
import { supabase } from "../lib/supabase.js";
import { findUserById } from "../db/authorizationDb.js";

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

async function putUser(req, res, next) {
  // for now we just update the profile picture
  const { userId } = req.params;
  const profile = req.file;
  let profileUrl = null;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    // get user
    const user = await findUserById(userId);
    if (!user) throw new Error("User does not exist.");

    // update the image (doesn't check if the same for now)
    if (profile) {
      const filePath = `${userId}/${crypto.randomUUID()}${path.extname(profile.originalname)}`;
      const { data: profileData, error: profileError } = await supabase.storage
        .from("User Profiles")
        .upload(filePath, profile.buffer, {
          contentType: profile.mimetype,
        });

      if (profileError) throw new Error(profileError.message);

      // delete previous image if applicable
      const previousFilePath = getFilePathFromPublicUrl(user.profile);
      if (previousFilePath && user.profile) {
        const { data: removeData, error: removeError } = await supabase.storage
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
    } else {
      // delete previous image if applicable
      const previousFilePath = getFilePathFromPublicUrl(user.profile);
      if (previousFilePath && user.profile) {
        const { data: removeData, error: removeError } = await supabase.storage
          .from("User Profiles")
          .remove([previousFilePath]);

        if (removeError) throw new Error(removeError.message);
        if (!removeData || removeData.length === 0)
          throw new Error(
            "File was not deleted (RLS policy or previousFilePath most likely).",
          );
      }

      // set to default profile picture
      profileUrl =
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original";
    }

    const updatedUser = await updateUser(userId, profileUrl);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: updatedUser,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

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
  putUser,
  getUserFriends,
  getUserFriend,
  createFriendRequest,
};
