import User from "../models/User.js";
import { createError } from "../utils/error.js";

export const getAllUsers = async (req, res, next) => {
  const allUsers = await User.find({});
  res.status(200).json(allUsers);
};

export const blockUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updateBlockUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      {
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "User is blocked successfully", user: updateBlockUser });
  } catch (err) {
    next(createError(500, "Problemw while blocking user"));
  }
};

export const unBlockUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updateUnBlockUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "User is unblocked successfully",
      user: updateUnBlockUser,
    });
  } catch (err) {
    next(createError(500, "Problemw while unblocking user"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    next(createError(500, "Problemw while fetching user"));
  }
};
