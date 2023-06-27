const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const profileSchema = new Schema(
  {
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("profile", profileSchema);
