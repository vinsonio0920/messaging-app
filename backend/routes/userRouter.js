import { Router } from "express";
import {
  createFriendRequest,
  getAllUsers,
  getUserFriend,
  getUserFriends,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:userId/friends", getUserFriends);
userRouter.get("/:userId/friends/:friendId", getUserFriend);
userRouter.post("/:userId/friends/:friendId", createFriendRequest);

export { userRouter };
