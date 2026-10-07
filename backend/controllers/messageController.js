import { findAllChats, findAllMessages } from "../db/messageDb.js";
import { jwtUserIdMatches } from "../utils.js";

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
    const userIdMatches = jwtUserIdMatches(userId);
    if (!userIdMatches)
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
    const userIdMatches = jwtUserIdMatches(userId);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");
  } catch (err) {
    next(err);
  }

  // we need to add image to supabase lateri!
}

async function updateMessage(req, res, next) {
  const { userId, chatId } = req.params;

  try {
    const userIdMatches = jwtUserIdMatches(userId);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");
  } catch (err) {
    next(err);
  }
}

async function deleteMessage(req, res, next) {
  const { userId, chatId } = req.params;

  try {
    const userIdMatches = jwtUserIdMatches(userId);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");
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
