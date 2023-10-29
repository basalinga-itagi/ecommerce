import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dvmcbgryn",
  api_key: "222555548959679",
  api_secret: "Pt5xXXeWE4VNLJpEwzw4JmPyly0",
});

const fileUpload =
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg";

const cloudinaryImageUpload = async (fileUpload) => {
  console.log("Uploading cloudinary", fileUpload);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileUpload, function (error, result) {
      console.log(result);
      resolve({ url: result.secure_url }, { resource_type: "auto" });
    });
  });
};

export default cloudinaryImageUpload;
