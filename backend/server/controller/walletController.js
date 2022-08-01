const WalletModel = require("../model/walletSchema");
const InterviewModel = require("../model/interviewSchema");

const getWalletBalance = async (req, res) => {
  if (req.authVerified.role === "interviewer") {
    try {
      const wallet = await WalletModel.findOne({
        interviewerId: req.params.id,
      });
      if (wallet) {
        const walletBalance = wallet.walletBalance;
        res
          .status(200)
          .send({ message: "Ok", wallet: wallet, balance: walletBalance });
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

const setWalletBalance = async (req, res) => {
  if (req.authVerified.role === "admin") {
    try {
      const interviewId = req.params.id;
      const interview = await InterviewModel.findById(req.params.id);
      const id = interview.interviewerId;
      const interviewerFee = interview.interviewerFee;
      const data = await WalletModel.findOne({ interviewerId: id });

      if (data !== null) {
        const walletBalance = await WalletModel.findOne({
          interviewerId: id,
          interviewId: { $elemMatch: { $eq: req.params.id } },
        });

        if (walletBalance === null) {
          const balance = data.walletBalance + interviewerFee;
          const updatedBalance = await WalletModel.updateOne(
            { interviewerId: id },
            {
              $set: { walletBalance: balance },
              $push: { interviewId: interviewId },
            }
          );
          const updateInterview = await InterviewModel.findByIdAndUpdate(
            interviewId,
            { creditStatus: true }
          );
        }
      } else {
        const updatedBalance = new WalletModel({
          interviewerId: id,
          walletBalance: interviewerFee,
        });
        const newBalance = await updatedBalance.save();
        const addId = await WalletModel.findOneAndUpdate(
          { interviewerId: id },
          { $push: { interviewId: interviewId } }
        );
        const updateInterview = await InterviewModel.findByIdAndUpdate(
          interviewId,
          { creditStatus: true }
        );
      }
      const allInterviews = await InterviewModel.find({});
      const interviews = await PostModel.populate(allInterviews, {
        path: "userId interviewerId",
        select: ["name", "about", "_id", "interviewer"],
      });
      interviews.sort((dateA, dateB) => {
        return dateB.createdAt - dateA.createdAt;
      });
      const walletdetails = await WalletModel.find({});
      res.send({
        message: "Ok",
        interviews: interviews,
        wallet: walletdetails,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

module.exports = { getWalletBalance, setWalletBalance };
