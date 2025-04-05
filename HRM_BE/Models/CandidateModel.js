const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
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
    enum: ['New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'],
    default: 'New'
  },
  profile:{
    type: String
  },
  department:{
    type: String
  },
  dateofjoining:{
    type: Date
  },
}, { timestamps: true });

// Make sure this is exported as "Candidate", not "Employee"
const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;