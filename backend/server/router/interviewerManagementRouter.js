const route = require("express").Router();
const {
  interviewerDetails,
  updateBlockStatus,
  deleteInterviewer,
  updateInterviewerData,
} = require("../controller/interviewerManagementController");
const verifyAuth = require('../middleware/authenticate')

route.get("/", verifyAuth, interviewerDetails);
route.put("/status/:id",verifyAuth, updateBlockStatus);
route.put("/update/:id", verifyAuth, updateInterviewerData);
route.delete("/delete/:id", verifyAuth, deleteInterviewer);

module.exports = route;
