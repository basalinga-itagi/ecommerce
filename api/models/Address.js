import mongoose from "mongoose";
const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    address: {
      type: String,
    },
    landmark: { type: String },
    doornum: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Address", addressSchema);
