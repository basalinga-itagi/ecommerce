import Blog from "../models/Blog.js";
import User from "../models/User.js";
import cloudinaryImageUpload from "../utils/cloudinary.js";
import { createError } from "../utils/error.js";
import fs from "fs";

export const createBlog = async (req, res, next) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(200).json({ message: "Success", blog: newBlog });
  } catch (err) {
    next(createError(500, "Error creating blog"));
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const blogs = await Blog.findById(req.params.id);
    await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { numviews: 1 },
      },
      { new: true }
    );
    res.status(200).json({ message: "Success", blog: blogs });
  } catch (err) {
    console.log(err);
    next(createError(500, "Error fetching blog"));
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).json({ message: "Success", blog: blogs });
  } catch (err) {
    next(createError(500, "Error fetching blog"));
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const updateBlogs = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Success", blog: updateBlogs });
  } catch (err) {
    next(createError(500, "Error fetching blog"));
  }
};

export const likesBlog = async (req, res, next) => {
  try {
    // console.log("like blog", req.user);
    // const id = req.body;
    const loginUserId = req?.user?._id;
    const blogId = await Blog.findById(req.params.id);
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        isliked: !blogId.isliked,
      },
      {
        new: true,
      }
    );
    if (blog.isliked) {
      await User.findByIdAndUpdate(
        loginUserId,
        {
          $push: { totalbloglikes: blogId._id },
        },
        {
          new: true,
        }
      );
    } else {
      await User.findByIdAndUpdate(
        loginUserId,
        {
          $pull: { totalbloglikes: blogId._id },
        },
        {
          new: true,
        }
      );
    }

    res.status(200).json(blog);
  } catch (err) {
    console.log("like blog err", err);
  }
};

export const uploadBlogImages = async (req, res, next) => {
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

  const findProduct = await Blog.findByIdAndUpdate(
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
