const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const petSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
  },

  name: {
    type: String,
    required: true,
  },
  race: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  type: {
    type: String,
  },

  castrated: {
    type: Boolean,
    default: false,
    required: true,
  },

  medicalCondition: {
    type: String,
  },
  diet: {
    type: String,
  },
  instruction: {
    type: String,
  },
  img: {
    type: String,
  },
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
