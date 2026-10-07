import { findAllChats, findAllMessages } from "../db/messageDb.js";
import { jwtDecode } from "jwt-decode";

async function getAllChats(req, res, next) {
  const { userId } = req.params;

  try {
    const chats = await findAllChats(userId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: chats,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllMessages(req, res, next) {
  const { userId, chatId } = req.params;

  try {
    // make sure that the signed in user's id matches the user in the param (security)
    const decoded = jwtDecode(req.headers["authorization"].split(" ")[1]);
    if (decoded.user.id !== Number(userId))
      throw new Error("Signed in user's id doesn't match params user id.");

    const messages = await findAllMessages(chatId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: messages,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

async function createMessage(req, res, next) {
  const { userId, chatId } = req.params;

  try {
  } catch (err) {
    next(err);
  }

  // we need to add image to supabase lateri!
}

async function updateMessage(req, res, next) {
  const { userId, chatId } = req.params;

  try {
  } catch (err) {
    next(err);
  }
}

async function deleteMessage(req, res, next) {
  const { userId, chatId } = req.params;

  try {
  } catch (err) {
    next(err);
  }
}

export {
  getAllChats,
  getAllMessages,
  createMessage,
  updateMessage,
  deleteMessage,
};
