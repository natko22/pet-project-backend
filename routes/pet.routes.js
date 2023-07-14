const express = require("express");
const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");
const Pet = require("../models/Pet.model");
const User = require("../models/User.model");

// get one pet by id
router.get("/pets/:_id", async (req, res) => {
  const pet = await Pet.findById(req.params._id);
  res.json(pet);
});

// add new pet
router.post("/add-pet", fileUploader.single("imageUrl"), async (req, res) => {
  try {
    const ownerId = req.body.owner;
    delete req.body.owner;
    console.log(ownerId, req.body);
    const newPetData = {
      ...req.body,
      img: req.file ? req.file.path : "",
    };
    const newPet = new Pet(newPetData);
    console.log(newPet);
    const savedPet = await newPet.save();
    const updatedUser = await User.findByIdAndUpdate(ownerId, {
      $push: { pets: savedPet._id },
    });
    res.status(201).json(savedPet);
  } catch (error) {
    res.status(500).json({ error: "Error adding pet" });
  }
});

// Get all pet profiles
router.get("/pet-profiles", async (req, res) => {
  try {
    const petProfiles = await Pet.find();
    res.json(petProfiles);
    console.log(petProfiles, "PET PROFILES");
  } catch (error) {
    res.status(500).json({ error: "Error fetching pet profiles" });
  }
});

// get pet
router.get("/edit-pet/:_id", async (req, res) => {
  try {
    const petId = req.params._id;
    const pet = await Pet.findById(petId);
    console.log(petId, "PET-ID");

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json({ pet });
    console.log("PET OBJECT", pet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// update pets's profile
router.put("/edit-pet/:_id", async (req, res) => {
  try {
    const petId = req.params._id;
    const updatedPetProfile = req.body;

    const pet = await Pet.findByIdAndUpdate(petId, updatedPetProfile, {
      new: true,
    });

    if (!pet) {
      res.status(404).json({ message: "Pet not found" });
      return;
    }

    res.json(pet);
    console.log("PET", pet);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/upload/:petId",
  fileUploader.single("imageUrl"),
  async (req, res) => {
    try {
      const petId = req.params.petId;
      console.log(petId, "PETID");

      if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
      }

      const updatePetImage = await Pet.findByIdAndUpdate(
        petId,
        { img: req.file.path },
        { new: true }
      );

      if (!updatePetImage) {
        res.status(404).json({ message: "Pet not found" });
        return;
      }

      res.json({ fileUrl: req.file.path });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Delete pet profile
router.post("/pets/:petId", async (req, res) => {
  try {
    const ownerId = req.body.owner;
    console.log(req.body.owner);
    delete req.body.owner;
    const petId = req.params.petId;
    const deletedPet = await Pet.findByIdAndDelete(petId);
    const updatedUser = await User.findByIdAndUpdate(ownerId, {
      $pull: { pets: deletedPet._id },
    });
    console.log(deletedPet, updatedUser, "DELETED PET AND UPDATED USER");

    if (!deletedPet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
