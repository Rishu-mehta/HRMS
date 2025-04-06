const mongoose = require("mongoose");

const attendenceSchema = new mongoose.Schema(
  {
    task: {
      type: String,
    },
    status: {
      type: String,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Candidate", 
      required: true,
    },
  },
  { timestamps: true }
);

const Attendence = mongoose.model("Attendence", attendenceSchema);
module.exports = Attendence;