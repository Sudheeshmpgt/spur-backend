const route = require("express").Router();
require("dotenv").config();
const multer = require("multer");
const {
  login,
  registration,
  otpLogin,
  otpVerify,
  updateUserData,
  getUserData,
  addConnection,
  changePassword,
} = require("../controller/userController");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "/SpurUploads",
  },
});

const upload = multer({ storage: storage });

route.post("/login", login);
route.post("/registration", registration);
route.post("/otplogin", otpLogin);
route.post("/otpsubmit", otpVerify);
route.put("/update/:id", upload.single("profileImg"), updateUserData);
route.get("/details/:id", getUserData);
route.post("/connect", addConnection);
route.put("/change/credentials", changePassword);

module.exports = route;
