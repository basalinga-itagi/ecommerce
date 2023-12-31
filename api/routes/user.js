import express from "express";
import {
  getAllUsers,
  getUser,
  blockUser,
  unBlockUser,
  getUserProductWishlist,
} from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllUsers);
router.get("/block/:id", verifyAdmin, blockUser);
router.get("/unblock/:id", verifyAdmin, unBlockUser);
router.get("/getwishlist", verifyToken, getUserProductWishlist);
router.get("/:id", getUser);

export default router;
