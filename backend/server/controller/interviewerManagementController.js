const UserModel = require("../model/userSchema");

const interviewerDetails = async (req, res) => {
  if (req.authVerified.role === "admin") {
    try {
      const interviewers = await UserModel.find({ interviewer: true });
      if (interviewers.length !== 0) {
        res.status(200).send({ message: "Ok", interviewers: interviewers });
      } else {
        res.status(404).send({ message: "Not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const updateBlockStatus = async (req, res) => {
  if (req.authVerified.role === "admin") {
  try {
    const interviewer = await UserModel.findById(req.params.id);
    if (interviewer) {
      const status = interviewer.block;
      const updatedUser = await UserModel.updateOne(
        { _id: interviewer._id },
        { block: !status }
      );
      const interviewers = await UserModel.find({ interviewer: true });
      res.status(200).send({ message: "Ok", interviewers: interviewers });
    } else {
      res.status(404).send({ message: "User not found!" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
} else {
  res.status(401).send("Unauthorized Access");
}
};

const updateInterviewerData = async (req, res) => {
  if (req.authVerified.role === "admin") {
    try {
      const interviewer = await UserModel.findById(req.params.id);
      if (interviewer) {
        interviewer.name = req.body.name || interviewer.name;
        interviewer.phone = req.body.phone || interviewer.phone;
        interviewer.email = req.body.email || interviewer.email;
        interviewer.about = req.body.about || interviewer.about;
        interviewer.experience = req.body.experience || interviewer.experience;
        interviewer.profileImg = req.file
          ? req.file.path
          : "" || interviewer.profileImg;

        const updatedInterviewer = await interviewer.save();
        const interviewers = await UserModel.find({ interviewer: true });
        res.status(200).send({
          message: "User Updated Successfully",
          interviewers: interviewers,
        });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const deleteInterviewer = async (req, res) => {
  if (req.authVerified.role === "admin") {
    try {
      const interviewer = await UserModel.findByIdAndDelete(req.params.id);
      if (interviewer) {
        const interviewers = await UserModel.find({ interviewer: true });
        res.status(200).send({ message: "Ok", interviewers: interviewers });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

module.exports = {
  updateBlockStatus,
  interviewerDetails,
  updateInterviewerData,
  deleteInterviewer,
};
