import { Router } from "express";
import {
  createFriendRequest,
  getAllUsers,
  getUser,
  getUserFriend,
  getUserFriends,
  getUserInfo,
  putUser,
} from "../controllers/userController.js";
import { verifyToken } from "../utils.js";
import { upload } from "../lib/multer.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:userId", verifyToken, getUser);
userRouter.get("/:userId/info", verifyToken, getUserInfo);
userRouter.put("/:userId", verifyToken, upload.single("profile"), putUser);
userRouter.get("/:userId/friends", getUserFriends);
userRouter.get("/:userId/friends/:friendId", verifyToken, getUserFriend);
userRouter.post("/:userId/friends/:friendId", verifyToken, createFriendRequest);

export { userRouter };
