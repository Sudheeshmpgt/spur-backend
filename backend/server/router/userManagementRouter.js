const route = require("express").Router();
const {
  updateBlockStatus,
  userDetails,
  deleteUser,
  updateUserData,
} = require("../controller/userManagementController");
const verifyAuth = require("../middleware/authenticate");

route.get("/", verifyAuth, userDetails);
route.put("/status/:id", verifyAuth, updateBlockStatus);
route.put("/update/:id", verifyAuth, updateUserData);
route.delete("/delete/:id", verifyAuth, deleteUser);

module.exports = route;
