import e from "express";
import User from "../models/User.js";
import { createError } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  let token;
  try {
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        console.log("token: " + token);
        const decoded = jwt.verify(token, process.env.JWT);
        console.log("decoded", decoded);
        const user = await User.findById(decoded.id);
        req.user = user;
        return next();
      } else {
        next(createError(400, "token is wrongly attached"));
      }
    } else {
      next(createError(400, "No token attached"));
    }
  } catch (e) {
    console.log("error", e);
    next(createError(500, "token is wrongly attached"));
  }
};

// export const verifyUser = async (req, res, next) => {

// };

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log("success", req.user);
    if (req?.user?.role === "admin") {
      return next();
    } else {
      next(createError(500, "You are not an admin"));
    }
  });
};
