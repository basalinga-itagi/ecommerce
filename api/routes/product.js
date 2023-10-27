import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  addToWishList,
} from "../controllers/productController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/createproduct", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.put("/addtowishlist/:id", verifyToken, addToWishList);
router.put("/updateproduct/:id", updateProduct);

export default router;
