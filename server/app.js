import express from "express";
import cors from "cors";
import session from "express-session";
import morgan from "morgan";
import UserRouter from "./routes/user.routes.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const app = express();

// setting up cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Setting up all the middlewares
app.use(session({ resave: false, saveUninitialized: true, secret: "secret" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json());

//morgan middleware
app.use(morgan("tiny"));

// setting up routes
app.use("/api/v1", UserRouter);

export default app;
