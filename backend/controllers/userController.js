import { findAllUsers } from "../db/userDb.js";

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

export { getAllUsers };
