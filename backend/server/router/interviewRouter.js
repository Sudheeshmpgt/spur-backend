const route = require("express").Router();
const {
  interviewRequest,
  getRequest,
  interviewSchedule,
  cancelInterview,
  getNotification,
  userConfirmation,
  userCancellation,
  getRequestData,
  getUpcommingData,
  getInterUpcommingData,
  setInterviewStatus,
  uploadFeedback,
  getCompletedInterviews
} = require("../controller/interviewController"); 
const upload = require('../middleware/cloudinary'); 
const verifyAuth = require('../middleware/authenticate')

route.post("/",verifyAuth, interviewRequest);
route.get("/:id",verifyAuth, getRequest); 
route.put("/schedule",verifyAuth, interviewSchedule);
route.post("/cancel",verifyAuth, cancelInterview);
route.get("/user/:id",verifyAuth, getNotification);
route.put("/user/confirm",verifyAuth, userConfirmation);
route.put("/user/cancel",verifyAuth, userCancellation);        
route.get("/user/completed/:id",verifyAuth, getCompletedInterviews);    
route.get("/user/request/:id",verifyAuth, getRequestData);
route.get("/user/upcomming/:id",verifyAuth, getUpcommingData);
route.get("/interviewer/upcomming/:id", verifyAuth, getInterUpcommingData);
route.put("/interviewer/status/:id", verifyAuth, setInterviewStatus);
route.put("/interviewer/feedback/:id", verifyAuth, upload.single('feedback'), uploadFeedback);       

module.exports = route;
