const route = require("express").Router();
const {
  manageInterviewerFee,
  getInterviews,
} = require("../controller/interviewManagementController");
const verifyAuth = require("../middleware/authenticate");

route.get("/", verifyAuth, getInterviews);
route.put("/:id", verifyAuth, manageInterviewerFee);

module.exports = route;
