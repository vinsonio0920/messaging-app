import { Router } from "express";
import {
  createFriendRequest,
  getAllUsers,
  getUserFriend,
  getUserFriends,
  putUser,
} from "../controllers/userController.js";
import { verifyToken } from "../utils.js";
import { upload } from "../lib/multer.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.put("/:userId", verifyToken, upload.single("profile"), putUser);
userRouter.get("/:userId/friends", getUserFriends);
userRouter.get("/:userId/friends/:friendId", verifyToken, getUserFriend);
userRouter.post("/:userId/friends/:friendId", verifyToken, createFriendRequest);

export { userRouter };
