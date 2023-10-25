import Product from "../models/Product.js";
import { createError } from "../utils/error.js";

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
    const queryObj = { ...req.qurey };
    console.log(queryObj);

    JSON.stringify(queryObj);

    const produts = await Product.find(req.query);
    res.status(200).json(produts);
  } catch (err) {
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
