import { Router } from "express";
import {
  createMessage,
  getAllChats,
} from "../controllers/messageController.js";

const messageRouter = Router();

messageRouter.get("/:userId", getAllChats);
messageRouter.post("/create", createMessage);

export { messageRouter };
