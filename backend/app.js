import express from "express";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma.js";
import passport from "passport";
import { authorizationRouter } from "./routes/authorizationRouter.js";

const app = express();

app.use(
  expressSession({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use("/", authorizationRouter);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    apiVersion: "1.0",
    status: "error",
    data: null,
    errors: [
      {
        type: null,
        value: null,
        message: err.message,
        path: null,
        location: null,
      },
    ],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Running! Still got it! PORT: ${PORT}`);
});
