import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getSignInPage,
  getSignUpPage,
  postSignInPage,
  postSignUpPage,
} from "../controllers/authorizationController.js";
import { findUser, findUserById } from "../db/authorizationDb.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await findUser(email, password);

        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const authorizationRouter = Router();

authorizationRouter.get("/sign-up", getSignUpPage);
authorizationRouter.post("/sign-up", postSignUpPage);
authorizationRouter.get("/sign-in", getSignInPage);
authorizationRouter.post("/sign-in", postSignInPage);

export { authorizationRouter };
