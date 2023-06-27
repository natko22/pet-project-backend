const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPetOwner: {
    type: Boolean,
    default: false,
    required: true,
  },
  isSitter: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
