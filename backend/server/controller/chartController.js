const InterviewModel = require("../model/interviewSchema");
const UserModel = require("../model/userSchema");
const PostModel = require("../model/postSchema");

const interviewerRevenue = async (req, res) => {
  if (req.authVerified.role === "interviewer") {
    try {
      const interviewData = await InterviewModel.find({
        interviewerId: req.params.id,
      });
      if (interviewData.length !== 0) {
        const order = interviewData.map((data) => data.status);
        const uniqueOrder = [...new Set(order)];
        const data = [];
        for (const unique of uniqueOrder) {
          let count = 0;
          for (const ord of order) {
            if (unique === ord) {
              count++;
            }
          }
          data.push(count);
        }

        const walletStatus = interviewData
          .filter((data) => data.userConfirmation)
          .map((data) => data.creditStatus);
        const uniqueWalletStatus = [...new Set(walletStatus)];
        const walletData = [];
        for (const unique of uniqueWalletStatus) {
          let count = 0;
          for (const wallet of walletStatus) {
            if (unique === wallet) {
              count++;
            }
          }
          walletData.push(count);
        }

        const requests = interviewData.length;
        const completedInterviews = interviewData.filter(
          (data) => data.status === "Completed"
        );
        const interviews = completedInterviews.length;
        const revenew = completedInterviews
          .map((data) => data.interviewerFee)
          .reduce((acc, cur) => {
            return acc + cur;
          }, 0);

        res.send({
          message: "Ok",
          orderStatus: uniqueOrder,
          orderStatusValue: data,
          walletStatus: uniqueWalletStatus,
          walletStatusValue: walletData,
          requests: requests,
          interviews: interviews,
          revenew: revenew,
        });
      } else {
        res.status(400).send({ message: "Data not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(401).send("Unauthorized Access");
  }
};

const adminRevenue = async (req, res) => {
  if (req.authVerified.role === "admin") {
    try {
      const interviews = await InterviewModel.find({});
      if (interviews.length !== 0) {
        const completedInterviews = interviews.filter(
          (data) => data.status === "Completed"
        );
        const cancelledInterviews = interviews.filter(
          (data) => data.status === "Cancelled"
        );
        const totalUsers = await UserModel.find({});
        const posts = await PostModel.find({});
        const postDetails = await PostModel.populate(posts, {
          path: "createdBy",
          select: ["name", "_id", "interviewer"],
        });

        const revenew = completedInterviews
          .map((data) => data.amount)
          .reduce((acc, cur) => {
            return acc + cur;
          }, 0);
        const adminProfit = completedInterviews
          .map((data) => data.adminProfit)
          .reduce((acc, cur) => {
            return acc + cur;
          }, 0);
        const totalUserCount = totalUsers.length;
        const interviewees = totalUsers.filter(
          (data) => data.interviewer === false
        ).length;

        const userCount = [];
        let Icount = 0;
        let Ucount = 0;
        for (const user of totalUsers) {
          if (user.interviewer) {
            Icount++;
          } else {
            Ucount++;
          }
        }
        userCount.push(Icount);
        userCount.push(Ucount);

        const postCount = [];
        let Ipcount = 0;
        let Upcount = 0;
        for (const post of postDetails) {
          if (post.createdBy.interviewer) {
            Ipcount++;
          } else {
            Upcount++;
          }
        }
        postCount.push(Ipcount);
        postCount.push(Upcount);

        const IntervieweePosts = postDetails.filter(
          (data) => data.createdBy.interviewer === false
        ).length;

        const InterviewerPosts = postDetails.filter(
          (data) => data.createdBy.interviewer === true
        ).length;

        res.send({
          revenew: revenew,
          adminProfit: adminProfit,
          totalUserCount: totalUserCount,
          IntervieweePosts: IntervieweePosts,
          InterviewerPosts: InterviewerPosts,
          userAndInter: userCount,
          posts: postCount,
        });
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

module.exports = { interviewerRevenue, adminRevenue };
