import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },

    numviews: {
      type: Number,
      default: 0,
    },
    isliked: {
      type: Boolean,
      default: false,
    },
    isdisliked: {
      type: Boolean,
      default: false,
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
    dislikes: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
    images: {
      type: String,
      default:
        "https://www.shutterstock.com/image-photo/bloggingblog-concepts-ideas-white-worktable-260nw-1029506242.jpg",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
export default mongoose.model("Blog", blogSchema);
