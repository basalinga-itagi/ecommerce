import express from "express";
import { signUp,signIn } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", signIn);
router.post("/signup", signUp);


export default router;
