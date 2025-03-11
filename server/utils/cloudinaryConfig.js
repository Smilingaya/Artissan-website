const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
//clodinarty configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//configurarion multer+clodinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "uplodes",
      resource_type: file.mimetype.startsWith("video/") ? "video" : "image", //mimetype kaml les type t3 file mp4/jpeg
    };
  },
});
const upload = multer({ storage: storage });
module.exports = { upload };
