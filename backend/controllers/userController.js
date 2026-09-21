import { findAllUsers, findUserFriends } from "../db/userDb.js";

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
  console.log(userId);

  try {
    const userFriends = await findUserFriends(userId);

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

export { getAllUsers, getUserFriends };
