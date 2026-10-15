import multer from "multer";
import { Router } from "express";
import {
  deleteChatMessage,
  getAllChats,
  getAllChatMessages,
  postChatMessage,
  putChatMessage,
} from "../controllers/chatController.js";
import { verifyToken } from "../utils.js";

const upload = multer();

const chatRouter = Router();

// createChat in userController.js, might refactor in the future.
chatRouter.post("/", verifyToken, getAllChats);
chatRouter.post("/:chatId", verifyToken, getAllChatMessages);
chatRouter.post(
  "/:chatId/create",
  verifyToken,
  upload.single("image"),
  postChatMessage,
);
chatRouter.put("/messages/:messageId/update", verifyToken, putChatMessage);
chatRouter.delete(
  "/messages/:messageId/delete",
  verifyToken,
  deleteChatMessage,
);

export { chatRouter };
