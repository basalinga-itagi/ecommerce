import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password, mobile, address } = req.body;
    console.log(username, email, password, mobile);
    var hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      mobile,
      address,
      password: hashPassword,
    });
    const savedUser = await newUser.save();
    res
      .status(200)
      .json({ message: "user created successfully", user: savedUser });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      // res.status(400).send("user email is not correct");
      next(createError(400, "user email is not correct"));
    }
    const isPasswordCrt = await bcrypt.compare(password, userExist.password);
    if (!isPasswordCrt) {
      // return res.status(400).send("Invalid cedentials");
      next(createError(400, "Invalid cedentials"));
    }
    const token = jwt.sign(
      { id: userExist._id, isAdmin: userExist.isAdmin },
      process.env.JWT
    );
    const { password: userPassword, isAdmin, ...otherDetails } = userExist._doc;
    res.status(200).json({ ...otherDetails, token: token });
  } catch (err) {
    // res.status(500).json(err);
    next(createError(500, "Internal Server error: "));
  }
};
