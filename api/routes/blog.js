import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  likesBlog,
} from "../controllers/blogController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/update/:id", updateBlog);
router.post("/bloglike/:id", verifyToken, likesBlog);

export default router;
