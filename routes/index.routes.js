const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const Review = require("../models/Review.model");
const Pet = require("../models/Pet.model");


router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// get one user by id
router.get("/users/:_id", async (req, res) => {
  const user = await User.findById(req.params._id).populate(["reviews","pets"]);
  res.json(user);
});

module.exports = router;
