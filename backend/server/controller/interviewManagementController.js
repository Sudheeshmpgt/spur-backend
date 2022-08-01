const InterviewModel = require("../model/interviewSchema");
const WalletModel = require("../model/walletSchema");

const getInterviews = async (req, res) => {
  if (req.authVerified.role === "admin") {
  try{
    const allInterviews = await InterviewModel.find({})
    if(allInterviews.length !== 0){
      const interviews = await PostModel.populate(allInterviews, {
        path: "userId interviewerId",
        select: ["name", "about", "_id", "interviewer"],
      });
      interviews.sort((dateA, dateB) => {
        return dateB.createdAt - dateA.createdAt;
      });
      res.send({message:"Ok", interviews:interviews})
    }else{
      res.status(404).send({message:"Data not found"})
    }
  }catch(error){
    res.status(500).send(error)
  }
} else {
  res.status(401).send("Unauthorized Access");
}
}

const manageInterviewerFee = async (req, res) => {
  if (req.authVerified.role === "admin") {
  try {
    const { splitPercent } = req.body;
    const interview = await InterviewModel.findById(req.params.id);
    if (interview) {
      const percent = splitPercent ? splitPercent : interview.splitPercent;
      const amount = interview.amount;
      const split = (amount * percent) / 100;
      const interviewerFee = amount - split;
      const adminProfit = amount - interviewerFee;
      const updatedInterview = await InterviewModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          splitPercent: splitPercent,
          interviewerFee: interviewerFee,    
          adminProfit: adminProfit,
        }
      );
      const allInterviews = await InterviewModel.find({})
      const interviews = await PostModel.populate(allInterviews, {
        path: "userId interviewerId",
        select: ["name", "about", "_id", "interviewer"],
      });
      interviews.sort((dateA, dateB) => {
        return dateB.createdAt - dateA.createdAt;
      });
      res.send({message:"Ok", interviews:interviews}) 
    } else {  
      res.status(404).send({ message: "Data not found" }); 
    } 
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
} else {
  res.status(401).send("Unauthorized Access");
}
};
  
module.exports = { manageInterviewerFee, getInterviews };     
              