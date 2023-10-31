import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  likesBlog,
  uploadBlogImages,
} from "../controllers/blogController.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";
import uploadImage from "../utils/uploadimges.js";

const router = express.Router();

router.post("/create", createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/update/:id", updateBlog);
router.put(
  "/uploadblogimage/:id",
  verifyAdmin,
  uploadImage.array("images", 12),
  uploadBlogImages
);
router.post("/bloglike/:id", verifyToken, likesBlog);

export default router;
