import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult, matchedData } from "express-validator";
import { createUser, findUserByEmail } from "../db/authorizationDb.js";
import { requiredErr, lengthErr } from "../utils.js";
import passport from "passport";

const emailErr = "must be a valid email address";
const inUseErr = "is already registered";
const spaceError = "must not include any spaces";
const passwordError =
  "must have at least 8 characters, one number, and one special character";

const validateSignUp = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email ${requiredErr}`)
    .bail()
    .isLength({ min: 3, max: 254 })
    .withMessage(`Email ${lengthErr(3, 254)}`)
    .bail()
    .isEmail()
    .withMessage(`Email ${emailErr}`)
    .bail()
    .custom(async (value) => {
      const user = await findUserByEmail(value);

      if (user) throw new Error("Email already in database");
      return true;
    })
    .withMessage(`Email ${inUseErr}`),
  body("password")
    // omit trim here to let users know NO SPACES (even at the start or end)
    .notEmpty()
    .withMessage(`Password ${requiredErr}`)
    .bail()
    .custom((value) => {
      const spaceRegex = /\s/;

      if (spaceRegex.test(value)) throw new Error("Password contains spaces");
      return true;
    })
    .withMessage(`Password ${spaceError}`)
    .bail()
    .custom((value) => {
      // at least 8 characters, one number, and one non-alphanumeric (NO SPACES!)
      const regex = /^(?=.*\d)(?=.*[^\w\s])[^\s]{8,}$/;

      if (!regex.test(value))
        throw new Error("Password does not pass the constraints");
      return true;
    })
    .withMessage(`Password ${passwordError}`),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Username ${requiredErr}`)
    .bail()
    .isLength({ min: 3, max: 64 })
    .withMessage(`Username ${lengthErr(3, 64)}`),
];

const postSignUp = [
  validateSignUp,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        apiVersion: "1.0",
        status: "error",
        data: {
          ...req.body,
        },
        errors: errors.array(),
      });
    }

    const { email, password, username } = matchedData(req);
    // during this step, add picture to supabase and copy the link
    // we'll use a placeholder link for now
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await createUser(
        email,
        hashedPassword,
        username,
        "placeholder.link",
      );
      return res.json({
        apiVersion: "1.0",
        status: "success",
        data: {
          ...user,
        },
        errors: null,
      });
    } catch (err) {
      next(err);
    }
  },
];

async function postSignIn(req, res, next) {
  // seems like... I DID IT IN HEADERS INSTEAD OF BODY!!!
  passport.authenticate("local", (err, user, info) => {
    if (err)
      return res.status(500).json({
        apiVersion: "1.0",
        status: "error",
        data: null,
        errors: [
          {
            type: null,
            value: null,
            message: "Error with running local strategy",
            path: null,
            location: null,
          },
        ],
      });
    if (!user)
      return res.status(400).json({
        apiVersion: "1.0",
        status: "error",
        data: null,
        errors: [
          {
            type: null,
            value: null,
            message: "Email or password is incorrect",
            path: null,
            location: null,
          },
        ],
      });

    // we are going to do a hybrid passport/jwt authentication
    // log in to create sessionId
    req.logIn(user, (err) => {
      if (err) return next(err);

      // sign jwt
      jwt.sign({ user }, process.env.SECRET, (err, token) => {
        if (err) return next(err);

        // returns successful response if everything goes well
        res.json({
          apiVersion: "1.0",
          status: "success",
          data: {
            token,
          },
          errors: null,
        });
      });
    });
  })(req, res, next);
}

async function postSignOut(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);

    // maybe also remove jwt here as well

    res.json({
      apiVersion: "1.0",
      status: "success",
      data: null,
      errors: null,
    });
  });
}

export { postSignUp, postSignIn, postSignOut };
