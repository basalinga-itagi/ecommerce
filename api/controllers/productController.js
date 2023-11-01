import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import cloudinaryImageUpload from "../utils/cloudinary.js";
import { createError } from "../utils/error.js";
import fs from "fs";

export const createProduct = async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res
      .status(200)
      .json({ message: "New Product has been created", newProduct });
  } catch (err) {
    console.log(err);
    next(createError(500, "Error while creating new Product"));
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };

    //
    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((field) => delete queryObj[field]);

    //filtering
    let qryStr = JSON.stringify(queryObj);
    qryStr = qryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log("qryStr", qryStr);
    let query = Product.find(JSON.parse(qryStr));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //pagination

    if (req.query.page && req.query.limit) {
      const page = req.query.page || 1;
      const limit = req.query.limit;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const productCount = await Product.countDocuments();
      if (startIndex >= productCount) {
        throw new Error("This page doesn't exist");
      }
      query = query.skip(startIndex).limit(limit);
    }

    const produts = await query;
    res.status(200).json(produts);
  } catch (err) {
    console.log(err);
    next(createError(500, "Error while fetching  all products"));
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    next(createError(500, "Error while fetching  all products"));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    next(createError(500, "Error while fetching  all products"));
  }
};

export const addToWishList = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(createError(404, "product not found"));
    } else {
      const user = await User.findById(userId);
      let isProductAlredyWishlist = user.wishlist.find(
        (wishlistproduct) =>
          wishlistproduct.toString() === req.params.id.toString()
      );
      if (!isProductAlredyWishlist) {
        const updateduser = await User.findByIdAndUpdate(
          userId,
          {
            $push: { wishlist: req.params.id },
          },
          {
            new: true,
          }
        );
        console.log(updateduser);
        res.status(200).json(updateduser);
      } else {
        const updateduser = await User.findByIdAndUpdate(
          userId,
          {
            $pull: { wishlist: req.params.id },
          },
          {
            new: true,
          }
        );
        console.log(updateduser);
        res.status(200).json(updateduser);
      }
    }
  } catch (err) {
    console.log("Error while adding to wish list", err);
    return next(createError(500, "Error while adding to wish list"));
  }
};

export const ratingProduct = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { star, comment, productId } = req.body;
    const product = await Product.findById(productId);
    // console.log(" product", product);
    const alreadyStarproduct = product.rating.find(
      (productRating) => productRating.postedBy.toString() === userId.toString()
    );
    // console.log("star product", alreadyStarproduct);
    if (alreadyStarproduct) {
      const updatedStarProduct = await Product.updateOne(
        {
          rating: { $elemMatch: alreadyStarproduct },
        },
        {
          $set: { "rating.$.star": star, "rating.$.comment": comment },
        },
        {
          new: true,
        }
      );
      // res.status(200).json(updatedStarProduct);
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            rating: {
              star: star,
              comment: comment,
              postedBy: userId,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const totalRatings = product.rating.length;
    let ratingSum = product.rating.reduce(
      (acc, cur, index) => acc + cur.star,
      0
    );
    console.log("ratingSum", ratingSum);
    let actualRatings = Math.round(ratingSum / totalRatings);
    let updatedTotalRatings = await Product.findByIdAndUpdate(
      productId,
      {
        totalRatings: actualRatings,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedTotalRatings);
  } catch (err) {
    console.log("Error while adding to stars", err);
    return next(createError(500, "Error while adding to stars to product"));
  }
};

export const uploadImages = async (req, res, next) => {
  const { id } = req.params;
  const files = req.files;
  // console.log(files);
  const urls = [];
  const uploader = (path) => cloudinaryImageUpload(path, "images");
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath);
    fs.unlinkSync(path);
  }

  const findProduct = await Product.findByIdAndUpdate(
    id,
    {
      images: urls.map((file) => {
        return file;
      }),
    },
    {
      new: true,
    }
  );
  res.status(200).json(findProduct);
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(createError(404, "product not found"));
    } else {
      const user = await User.findById(userId);
      let isProductAlredyAddedToCart = user.cart.find(
        (addedproduct) => addedproduct.toString() === req.params.id.toString()
      );

      if (!isProductAlredyAddedToCart) {
        const updateduser = await User.findByIdAndUpdate(
          userId,
          {
            $push: { cart: req.params.id },
          },
          {
            new: true,
          }
        );
        if (updateduser) {
          Cart;
        }

        console.log(updateduser);
        res.status(200).json(updateduser);
      } else {
        const updateduser = await User.findByIdAndUpdate(
          userId,
          {
            $pull: { cart: req.params.id },
          },
          {
            new: true,
          }
        );
        res.status(200).json(updateduser);
      }
    }
  } catch (err) {
    return next(createError(500, "Error while adding to addToCart"));
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    const cartProduct = req.body;
    console.log(cartProduct);
    const id = req.user._id;
    const products = [];
    products["product"] = cartProduct.product;
    products["quantity"] = cartProduct.quantity;
    products["color"] = cartProduct.color;
    products["price"] = cartProduct.price;
    console.log(products);
    const newCart = new Cart({
      products: [{ ...products }],
      orderby: id,
    });
    console.log(newCart);
    await newCart.save();
    res
      .status(200)
      .json({ message: "Added to cart successfully", cartdetails: newCart });
    // res.status(200).json({ message: "Added to cart successfully" });
  } catch (err) {
    return next(createError(500, "Error while adding produxt to cart"));
  }
};

export const getAllProductsFromCart = async (req, res, next) => {
  try {
    const allProducts = await Cart.find();
    res.status(200).json(allProducts);
  } catch (err) {
    return next(createError(500, "Error while getting product from cart"));
  }
};

export const updateProductsFromCart = async (req, res, next) => {
  try {
    const updateProducts = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateProducts);
  } catch (err) {
    return next(createError(500, "Error while getting product from cart"));
  }
};

export const deleteProductFromCart = async (req, res, next) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).send("Cart Product is deleted");
  } catch (err) {
    return next(createError(500, "Error while getting product from cart"));
  }
};
