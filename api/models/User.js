import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    role: { type: String, default: "user" },
    cart: { type: Array, default: [] },
    isBlocked: { type: Boolean, default: false },
    address: { type: String },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    totalbloglikes: { type: Array },
  },
  {
    timestamps: true,
  }
);

// userSchema.pre('save',
export default mongoose.model("User", userSchema);
