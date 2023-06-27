const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");


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
  type:Number
  },
  description:{
  type:String
  },
  reviews:[{
    type: Schema.Types.ObjectId, ref: 'Review'
  }],
  pets:[{
    type: Schema.Types.ObjectId, ref: 'Pet'
  }],
  availability: [{
    type: Date
  }],
  img:{
    type:String
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
