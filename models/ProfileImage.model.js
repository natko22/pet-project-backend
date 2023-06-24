const mongoose = require("mongoose");

const profileImageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model("Profile", profileImageSchema);

module.exports = Profile;
