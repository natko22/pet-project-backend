const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const reviewSchema = new Schema({
  commenter: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  review: {
    type: String,
  },
  stars: {
    type: Number,
  },
});

module.exports = mongoose.model("Review", reviewSchema);