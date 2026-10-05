import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getAllChats,
  getAllMessages,
  updateMessage,
} from "../controllers/messageController.js";

const messageRouter = Router();

messageRouter.get("/:userId", getAllChats);
messageRouter.get("/:userId/chats/:friendId", getAllMessages);
messageRouter.post("/:userId/chats/:friendId", createMessage);
messageRouter.put("/:userId/chats/:friendId", updateMessage);
messageRouter.delete("/:userId/chats/:friendId", deleteMessage);

export { messageRouter };
