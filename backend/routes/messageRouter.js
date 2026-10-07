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

messageRouter.post("/:userId/chats/:chatId/create", verifyToken, createMessage);
/*
messageRouter.put("/:userId/chats/:chatId", verifyToken, updateMessage);
messageRouter.delete("/:userId/chats/:chatId", verifyToken, deleteMessage);
*/

export { messageRouter };
