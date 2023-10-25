import express from "express";
import {
  getAllUsers,
  getUser,
  blockUser,
  unBlockUser,
} from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllUsers);
router.get("/block/:id", verifyAdmin, blockUser);
router.get("/unblock/:id", verifyAdmin, unBlockUser);
router.get("/:id", getUser);

export default router;
