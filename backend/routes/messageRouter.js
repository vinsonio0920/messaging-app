import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getAllChats,
  getAllMessages,
  updateMessage,
} from "../controllers/messageController.js";
import { verifyToken } from "../utils.js";

const messageRouter = Router();

messageRouter.get("/:userId", getAllChats);
messageRouter.post("/:userId/chats/:chatId", verifyToken, getAllMessages);
/*
above is for getting and verifying the messages
and "/:userId/chats/:chatId" is for getting the chat, maybe...

messageRouter.post("/:userId/chats/:chatId", createMessage);
messageRouter.put("/:userId/chats/:chatId", updateMessage);
messageRouter.delete("/:userId/chats/:chatId", deleteMessage);
*/

export { messageRouter };
