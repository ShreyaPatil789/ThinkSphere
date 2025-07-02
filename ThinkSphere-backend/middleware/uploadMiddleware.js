const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// 🔧 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🌐 Blog Image Storage
const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "thinksphere_blogs",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// 👤 Profile Image Storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "thinksphere_profiles",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const uploadBlogImage = multer({ storage: blogStorage });
const uploadProfileImage = multer({ storage: profileStorage });

module.exports = {
  uploadBlogImage,
  uploadProfileImage,
};
