import { Router } from "express";
import {
  registerUser,
  loginUser,
  generateAccessTokenFromReferesh,
} from "../controllers/users.controller.js";

// create router instance
const router = Router();

// create routes for signup and login as per the requirements with post method
router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(generateAccessTokenFromReferesh);

export default router;
