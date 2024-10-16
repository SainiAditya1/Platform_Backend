const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    require: true,
  },
  vehicleNumber: {
    type: String,
  },
  vehicleType: {
    type: String,
  },
  profileStatus: {
    type: Boolean,
    default: false,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  earnedMoney: {
    type: Number,
    default: 0,
  },
  verifyStatus: {
    type: Boolean,
    default: false,
  },
});

// Create User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
