import express from "express";
import { authorizationRouter } from "./routes/authorizationRouter.js";

const app = express();

app.use("/", authorizationRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log("Running! Still got it!");
});
