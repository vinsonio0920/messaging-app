import { CustomForbiddenError } from "./errors/CustomForbiddenError.js";

const requiredErr = "is required";
const lengthErr = (minLength, maxLength) =>
  `must be between ${minLength} and ${maxLength} characters`;

// jwt verification middleware
function verifyToken(req, res, next) {
  console.log("running!");
  // get auth header value
  const bearerHeader = req.headers["authorization"];
  console.log(`bearer: ${bearerHeader}`);
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
  } else {
    // forbidden
    console.log("forbidden");
    throw new CustomForbiddenError("You are not signed in yet.");
  }
}

export { requiredErr, lengthErr, verifyToken };
