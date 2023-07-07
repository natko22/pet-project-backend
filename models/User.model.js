const mongoose = require("mongoose");
const { Schema } = require("mongoose");

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
  postalCode: {
    type: Number,
  },
  description: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  pets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pet",
    },
  ],
  availability: [
    {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
  ],

  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  img: {
    type: String,
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
