const InterviewModel = require("../model/interviewSchema");

const interviewRequest = async (req, res) => {
  if (req.authVerified.role === "interviewer") {
    try {
      const { userId, interviewerId, request } = req.body;
      const createRequest = new InterviewModel({
        userId,
        interviewerId,
        request,
        date: new Date(),
        time: new Date(),
        link: "Nill",
      });
      const newRequest = await createRequest.save();
      res.send({ message: "Request send succefully" });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const getRequest = async (req, res) => {
  if (req.authVerified.role === "interviewer") {
    try {
      const requests = await InterviewModel.find({
        interviewerId: req.params.id,
      });
      if (requests.length !== 0) {
        const requestData = await InterviewModel.populate(requests, {
          path: "userId",
          select: [
            "name",
            "about",
            "profileImg",
            "_id",
            "interviewer",
            "email",
            "phone",
          ],
        });
        requestData.sort((dateA, dateB) => {
          return dateB.createdAt - dateA.createdAt;
        });
        res.send({ message: "OK", requests: requestData });
      } else {
        res.send({ message: "No requests found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const interviewSchedule = async (req, res) => {
  if (req.authVerified.role === "interviewer") {
    try {
      const { requestId, date, time, link } = req.body;
      const request = await InterviewModel.findById(requestId);
      if (request) {
        request.userId = request?.userId;
        request.interviewerId = request?.interviewerId;
        request.date = date;
        request.time = time;
        request.link = link;
        request.confirmed = true;
        request.status = "Confirmed";

        const scheduled = await request.save();
      }
      res.status(200).send({ message: "ok" });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const cancelInterview = async (req, res) => {
  if (req.authVerified.role === "interviewer") {
    try {
      const { requestId } = req.body;
      const request = await InterviewModel.findById(requestId);
      if (request) {
        request.userId = request?.userId;
        request.interviewerId = request?.interviewerId;
        request.date = new Date();
        request.time = new Date();
        request.link = "Nill";
        request.cancelled = true;
        request.status = "Cancelled";
        request.amount = 0;

        const newScheduled = await request.save();
      }
      res.status(200).send({ message: "Interview Cancelled" });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const getNotification = async (req, res) => {
  if (req.authVerified.role === "user") {
    try {
      const requests = await InterviewModel.find({ userId: req.params.id });
      if (requests.length !== 0) {
        const requestData = await InterviewModel.populate(requests, {
          path: "interviewerId",
          select: [
            "name",
            "about",
            "profileImg",
            "_id",
            "interviewer",
            "email",
            "phone",
          ],
        });
        requestData.sort((dateA, dateB) => {
          return dateB.createdAt - dateA.createdAt;
        });
        res.send({ message: "OK", requests: requestData });
      } else {
        res.send({ message: "No requests found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const userConfirmation = async (req, res) => {
  if (req.authVerified.role === "user") {
    try {
      const { requestId } = req.body;
      const confirm = await InterviewModel.findById(requestId);
      if (confirm) {
        const amount = confirm?.amount;
        const splitPercent = confirm?.splitPercent;
        const split = (amount * splitPercent) / 100;
        const interviewerFee = amount - split;
        const adminProfit = amount - interviewerFee;
        const updatedInterview = await InterviewModel.findByIdAndUpdate(
          { _id: requestId },
          {
            userConfirmation: true,
            paid: true,
            status: "Confirmed",
            splitPercent: splitPercent,
            interviewerFee: interviewerFee,
            adminProfit: adminProfit,
          }
        );
        res.status(200).send({ message: "Confirmed" });
      } else {
        res.status(401).send({ message: "Unauthorized" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const userCancellation = async (req, res) => {
  if (req.authVerified.role === "user") {
    try {
      const { requestId } = req.body;
      const confirm = await InterviewModel.findByIdAndUpdate(
        { _id: requestId },
        { userCancellation: true, status: "Cancelled", amount: 0 }
      );
      if (confirm) {
        res.status(200).send({ message: "Cancelled" });
      } else {
        res.status(401).send({ message: "Unauthorized" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const getRequestData = async (req, res) => {
  if (req.authVerified.role === "user") {
    try {
      const requests = await InterviewModel.findById(req.params.id);
      if (requests.length !== 0) {
        const requestData = await InterviewModel.populate(requests, {
          path: "interviewerId",
          select: [
            "name",
            "about",
            "profileImg",
            "_id",
            "interviewer",
            "email",
            "phone",
          ],
        });
        res.send({ message: "OK", requests: requestData });
      } else {
        res.send({ message: "No requests found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const getUpcommingData = async (req, res) => {
  if (req.authVerified.role === "user") {
    try {
      const nowTime = new Date();
      const requests = await InterviewModel.find({ userId: req.params.id });
      if (requests.length !== 0) {
        const requestData = await InterviewModel.populate(requests, {
          path: "interviewerId",
          select: [
            "name",
            "about",
            "profileImg",
            "_id",
            "interviewer",
            "email",
            "phone",
          ],
        });
        const upcomming = requestData.filter((data) => {
          return (
            data.userConfirmation === true &&
            data.paid === true &&
            data.date.getTime() >= nowTime.getTime()
          );
        });
        const upcommingCount = upcomming.length;

        const pending = requestData.filter((data) => {
          return data.confirmed === false && data.cancelled === false;
        });
        const pendingCount = pending.length;

        const completed = requestData.filter((data) => {
          return data.status === "Completed";
        });
        const completedCount = completed.length;

        upcomming.sort((dateA, dateB) => {
          return dateB.createdAt - dateA.createdAt;
        });
        res.send({
          message: "OK",
          upcomming: upcomming,
          pending: pending,
          completed: completed,
          upcommingCount: upcommingCount,
          pendingCount: pendingCount,
          completedCount: completedCount,
        });
      } else {
        res.send({ message: "No requests found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const getInterUpcommingData = async (req, res) => {
  if (req.authVerified.role === "interviewer") {
    try {
      const nowTime = new Date();
      const requests = await InterviewModel.find({
        interviewerId: req.params.id,
      });
      if (requests.length !== 0) {
        const requestData = await InterviewModel.populate(requests, {
          path: "userId",
          select: [
            "name",
            "about",
            "profileImg",
            "_id",
            "interviewer",
            "email",
            "phone",
          ],
        });

        const upcomming = requestData.filter((data) => {
          return (
            data.userConfirmation === true &&
            data.paid === true &&
            data.date.getTime() >= nowTime.getTime()
          );
        });
        const upcommingCount = upcomming.length;

        const pending = requestData.filter((data) => {
          return data.confirmed === false && data.cancelled === false;
        });
        const pendingCount = pending.length;

        const completed = requestData.filter((data) => {
          return data.status === "Completed";
        });
        const completedCount = completed.length;

        upcomming.sort((dateA, dateB) => {
          return dateB.createdAt - dateA.createdAt;
        });
        res.send({
          message: "OK",
          upcomming: upcomming,
          pending: pending,
          completed: completed,
          upcommingCount: upcommingCount,
          pendingCount: pendingCount,
          completedCount: completedCount,
        });
      } else {
        res.send({ message: "No requests found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const setInterviewStatus = async (req, res) => {
  if (req.authVerified.role === "interviewer") {
    try {
      const { status, interviewerId } = req.body;
      const request = await InterviewModel.findByIdAndUpdate(
        { _id: req.params.id },
        { status: status }
      );
      if (request) {
        const requests = await InterviewModel.find({
          interviewerId: interviewerId,
        });
        const requestData = await InterviewModel.populate(requests, {
          path: "userId",
          select: [
            "name",
            "about",
            "profileImg",
            "_id",
            "interviewer",
            "email",
            "phone",
          ],
        });
        requestData.sort((dateA, dateB) => {
          return dateB.createdAt - dateA.createdAt;
        });
        res.send({ message: "OK", requests: requestData });
      } else {
        res.send({ message: "No requests found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const uploadFeedback = async (req, res) => {
  if (req.authVerified.role === "interviewer") {
    try {
      const { interviewerId } = req.body;
      const file = req.file && req.file.path;
      const feedback = await InterviewModel.findByIdAndUpdate(
        { _id: req.params.id },
        { feedback: file }
      );
      if (feedback) {
        const requests = await InterviewModel.find({
          interviewerId: interviewerId,
        });
        const requestData = await InterviewModel.populate(requests, {
          path: "userId",
          select: [
            "name",
            "about",
            "profileImg",
            "_id",
            "interviewer",
            "email",
            "phone",
          ],
        });
        requestData.sort((dateA, dateB) => {
          return dateB.createdAt - dateA.createdAt;
        });
        res.send({ message: "OK", requests: requestData });
      } else {
        res.send({ message: "No requests found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const getCompletedInterviews = async (req, res) => {
  if (req.authVerified.role === "user") {
    try {
      const interviews = await InterviewModel.find({ userId: req.params.id });
      if (interviews.length !== 0) {
        const completedInterviews = interviews.filter((data) => {
          if (data.status === "Completed") {
            return data;
          }
        });
        const requestData = await InterviewModel.populate(completedInterviews, {
          path: "interviewerId",
          select: [
            "name",
            "about",
            "profileImg",
            "_id",
            "interviewer",
            "email",
            "phone",
          ],
        });
        requestData.sort((dateA, dateB) => {
          return dateB.createdAt - dateA.createdAt;
        });
        res.send({ message: "Ok", interviews: requestData });
      } else {
        res.status(404).send({ message: "Data not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

module.exports = {
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
  getCompletedInterviews,
};
