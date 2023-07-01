const express = require("express");
const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Pet = require("../models/Pet.model");

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

module.exports = router;
