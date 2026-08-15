import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import {
  postSignIn,
  postSignUp,
  postSignOut,
} from "../controllers/authorizationController.js";
import { findUserByEmail, findUserById } from "../db/authorizationDb.js";
import { verifyToken } from "../utils.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await findUserByEmail(username);

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
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

authorizationRouter.post("/sign-up", postSignUp);
authorizationRouter.post("/sign-in", postSignIn);
authorizationRouter.post("/sign-out", postSignOut);
authorizationRouter.get("/test", verifyToken, (req, res) =>
  res.send("You did it!"),
);

export { authorizationRouter };
