import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  addToWishList,
  ratingProduct,
  uploadImages,
  addToCart,
  addProductToCart,
  getAllProductsFromCart,
  updateProductsFromCart,
  deleteProductFromCart,
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
router.put("/addtocart/:id", verifyToken, addToCart);
router.post("/addproducttocart", verifyToken, addProductToCart);
router.put("/updatecart/:id", verifyToken, updateProductsFromCart);
router.get("/cart/getcartproducts", verifyToken, getAllProductsFromCart);
router.put("/updateproduct/:id", updateProduct);
router.delete("/deleteproduct/:id", deleteProductFromCart);

export default router;
