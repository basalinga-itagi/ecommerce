import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import productRouter from "./routes/product.js";
import blogRouter from "./routes/blog.js";

dotenv.config();
const app = express();
app.use(express.json());

const connectToDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://basalingappaitagii:anil@cluster0.c9arqba.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Connected to Mongo");
  } catch (e) {
    console.log(e);
    console.log("error while connectig to mongo db", process.env.MONGOURL);
  }
};

app.use("/api/user/", userRouter);
app.use("/api/auth/", authRouter);
app.use("/api/product/", productRouter);
app.use("/api/blog/", blogRouter);

app.use((err, req, res, next) => {
  const errStatus = err.status || 404;
  const errMessage = err.message || "Something went wrong";
  res.status(errStatus).json({
    success: false,
    message: errMessage,
    stack: err.stack,
  });
});

app.listen(8081, () => {
  console.log("connected to port server");
  connectToDb();
});
