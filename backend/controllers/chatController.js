import { findAllChats, findChatById } from "../db/chatDb.js";
import {
  createMessage,
  deleteMessage,
  findAllMessages,
  findMessageById,
  updateMessage,
} from "../db/messageDb.js";
import { jwtUserIdMatches } from "../utils.js";

async function getAllChats(req, res, next) {
  const { userId } = req.body;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

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

async function getAllChatMessages(req, res, next) {
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
  const { chatId } = req.params;
  // update later to also allow photos (optional)
  // also will have to update the... well, update function as well
  const { userId, message } = req.body;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    // Make sure that the user is a member of the chat
    const chat = await findChatById(chatId);
    const userIsMember = chat.members.find(
      (member) => member.id === Number(userId),
    );
    if (!userIsMember)
      throw new Error("User does not have access to this chat.");

    // must have either a message or an image

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

async function putChatMessage(req, res, next) {
  const { messageId } = req.params;
  const { userId, message } = req.body;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    // make sure that the message belongs to the user
    const findMessage = await findMessageById(messageId);
    const userIsSender = findMessage.senderId === Number(userId);
    if (!userIsSender)
      throw new Error("You are not the sender of this message.");

    const updatedMessage = await updateMessage(messageId, message);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: updatedMessage,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteChatMessage(req, res, next) {
  const { messageId } = req.params;
  const { userId } = req.body;

  try {
    const jwtToken = req.headers["authorization"].split(" ")[1];
    const userIdMatches = jwtUserIdMatches(userId, jwtToken);
    if (!userIdMatches)
      throw new Error("Signed in user's id doesn't match params user id.");

    const findMessage = await findMessageById(messageId);
    const userIsSender = findMessage.senderId === Number(userId);
    if (!userIsSender)
      throw new Error("You are not the sender of this message.");

    const deletedMessage = await deleteMessage(messageId);

    return res.json({
      apiVersion: "1.0",
      status: "success",
      data: deletedMessage,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

export {
  getAllChats,
  getAllChatMessages,
  postChatMessage,
  putChatMessage,
  deleteChatMessage,
};
