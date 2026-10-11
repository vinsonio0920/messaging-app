import { Router } from "express";
import {
  getAllChats,
  getAllMessages,
  postChatMessage,
  putMessage,
} from "../controllers/chatController.js";
import { verifyToken } from "../utils.js";

const chatRouter = Router();

// createChat in userController.js, might refactor in the future.
chatRouter.post("/", verifyToken, getAllChats);
chatRouter.post("/:chatId", verifyToken, getAllMessages);
chatRouter.post("/:chatId/create", verifyToken, postChatMessage);
chatRouter.put("/messages/:messageId/update", verifyToken, putMessage);

/*
Not up to date, going to update after refactored
messageRouter.delete("/:messageId/", verifyToken, deleteMessage);
*/

export { chatRouter };
