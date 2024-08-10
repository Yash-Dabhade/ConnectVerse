import { Router } from "express";
import { registerUser, loginUser } from "../controllers/users.controller.js";

// create router instance
const router = Router();

// create routes for signup and login as per the requirements with post method
router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);

export default router;
