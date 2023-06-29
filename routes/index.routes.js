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
  const user = await User.findById(req.params._id).populate([
    "reviews",
    "pets",
  ]);
  res.json(user);
});

// get one pet by id
router.get("/pets/:_id", async (req, res) => {
  const pet = await Pet.findById(req.params._id);
  res.json(pet);
});

// add new pet

// POST /api/pets
router.post("/add-pet", async (req, res) => {
  try {
    const newPet = new Pet(req.body);
    console.log(newPet);
    const savedPet = await newPet.save();
    res.status(201).json(savedPet);
  } catch (error) {
    res.status(500).json({ error: "Error adding pet" });
  }
});

module.exports = router;
