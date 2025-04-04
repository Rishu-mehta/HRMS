const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
    select: false 
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to generate JWT Access Token
UserSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Method to generate JWT Refresh Token
UserSchema.methods.getJwtRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
