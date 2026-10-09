import { findAllChats } from "../db/chatDb.js";
import { createMessage, findAllMessages } from "../db/messageDb.js";
import { jwtUserIdMatches } from "../utils.js";

async function getAllChats(req, res, next) {
  const { userId } = req.body;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const chats = await findAllChats(userId, jwtToken);

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
  console.log("getting...");
  const { chatId } = req.params;
  const { userId } = req.body;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
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

async function postChatMessage(req, res, next) {
  const { userId, chatId } = req.params;
  // update later to also allow photos (optional)
  // also will have to update the... well, update function as well
  // I'm thinking after CRUD we'll add multer, and then finally implement frontend
  const { message } = req.body;
  console.log("A!");

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    const newMessage = await createMessage(message, userId, chatId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: newMessage,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

/*
async function updateMessage(req, res, next) {
  const { userId } = req.params;
  // either put in params or body? Which one is better?
  // I'll put it into body for consistency purposes
  const { message, messageId } = req.body;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    const updatedMessage = await updateMessage(message, userId, messageId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: updateMessage,
      errors: null,
    })
  } catch (err) {
    next(err);
  }
}

async function deleteMessage(req, res, next) {
  const { userId } = req.params;
  const { messageId } = req.body;

  try {
    const userIdMatches = jwtUserIdMatches(userId);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    const deletedMessage = await deleteMessage(userId)

    return res.json({

    });
  } catch (err) {
    next(err);
  }
}
*/

export { getAllChats, getAllMessages };
