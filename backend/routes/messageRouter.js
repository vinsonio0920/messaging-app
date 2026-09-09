import { Router } from "express";
import { createMessage } from "../controllers/messageController.js";

const messageRouter = Router();

messageRouter.post("/create", createMessage);

export { messageRouter };
