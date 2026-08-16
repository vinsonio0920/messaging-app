import jwt from "jsonwebtoken";
import { CustomForbiddenError } from "./errors/CustomForbiddenError.js";

const requiredErr = "is required";
const lengthErr = (minLength, maxLength) =>
  `must be between ${minLength} and ${maxLength} characters`;

// make sure user can't sign in a second time
function verifyNotSignedin(req, res, next) {
  if (req.isAuthenticated()) {
    throw new CustomForbiddenError("You are already signed in.");
  } else {
    next();
  }
}

// jwt verification middleware
function verifyToken(req, res, next) {
  // get auth header value
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    // get jwt token from bearerHeader
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;

    // verify the jwt token
    jwt.verify(req.token, process.env.SECRET, (err, authData) => {
      if (err) throw new CustomForbiddenError("You are not signed in yet.");

      next();
    });
  } else {
    // forbidden
    throw new CustomForbiddenError("You are not signed in yet.");
  }
}

export { requiredErr, lengthErr, verifyNotSignedin, verifyToken };
