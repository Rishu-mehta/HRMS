const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  phoneNumber: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  resume: {
    type: String, 
    required: true
  },
  status: {
    type: String,
    enum: ['selected', 'rejected', 'new', 'ongoing', 'scheduled'],
    default: 'new' 
  }
});

module.exports = mongoose.model('Employee', CandidateSchema);
