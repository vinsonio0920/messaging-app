import {
  createUserFriends,
  findAllUsers,
  findOtherFriendRequesting,
  findUserFriendById,
  findUserFriends,
  makeUserFriends,
} from "../db/userDb.js";

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

export { getAllUsers, getUserFriends, getUserFriend, createFriendRequest };
