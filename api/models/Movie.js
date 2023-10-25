import mongoose from "mongoose";
const { Schema } = mongoose;

const moviSchema = new Schema({
  title: {
    type: "String",
  },
  description: {
    type: "String",
  },
  releaseDate: {
    type: "String",
  },
  posterUrl: {
    type: "String",
  },
  bookings: [{ type: "String" }],
});
