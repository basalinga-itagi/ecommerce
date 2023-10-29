import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  addToWishList,
  ratingProduct,
  uploadImages,
} from "../controllers/productController.js";
import { verifyToken, verifyAdmin } from "../utils/verifyToken.js";
import uploadImage from "../utils/uploadimges.js";

const router = express.Router();

router.post("/createproduct", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.put("/addtowishlist/:id", verifyToken, addToWishList);
router.put("/productrate/", verifyToken, ratingProduct);
router.put(
  "/uploadproductimge/:id",
  verifyAdmin,
  uploadImage.array("images", 12),
  uploadImages
);
router.put("/updateproduct/:id", updateProduct);

export default router;
