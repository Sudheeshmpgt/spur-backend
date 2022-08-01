const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "interview",
    required: true,
  },
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
  cancelled:{
    type:Boolean,
    default:false
  },
  confirmed:{
    type:Boolean,
    default:false
  }
});

module.exports = ScheduleModel = mongoose.model("schedule", scheduleSchema);
