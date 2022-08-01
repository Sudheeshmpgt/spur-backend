const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    request: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    userConfirmation:{
      type: Boolean,
      default: false,
    },
    userCancellation:{
      type: Boolean,
      default: false,
    },
    amount:{
      type: Number,
      default: 500
    },
    paid:{
      type: Boolean,
      default: false,
    },
    status:{
      type: String,
    },
    feedback:{
      type: String,
    },
    splitPercent:{
      type: Number,
      default:10,
    },
    interviewerFee:{
      type: Number,
      default:0
    },
    adminProfit:{
      type:Number,
      default:0
    },
    creditStatus:{
      type:Boolean,
      default:false,
    }
  },{ timestamps: true }
);

module.exports = InterviewModel = mongoose.model("interview", interviewSchema);
