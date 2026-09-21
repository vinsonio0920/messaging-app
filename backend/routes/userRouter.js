import { Router } from "express";
import { getAllUsers, getUserFriends } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:userId/friends", getUserFriends);

export { userRouter };
