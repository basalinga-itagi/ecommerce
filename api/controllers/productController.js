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
