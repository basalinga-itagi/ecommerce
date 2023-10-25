import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/createproduct", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.put("/updateproduct/:id", updateProduct);

export default router;
