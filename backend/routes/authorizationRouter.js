import { Router } from "express";
import {
  getSignInPage,
  getSignUpPage,
  postSignInPage,
  postSignUpPage,
} from "../controllers/authorizationController.js";

const authorizationRouter = Router();

authorizationRouter.get("/sign-up", getSignUpPage);
authorizationRouter.post("/sign-up", postSignUpPage);
authorizationRouter.get("/sign-in", getSignInPage);
authorizationRouter.post("/sign-in", postSignInPage);

export { authorizationRouter };
