const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// CREATE NEW CATEGORY
router.post("/", async (req, res) => {
  const newCat = new Category(req.body);
  try {
    const savedCat = await newCat.save();
    return res.status(200).json(savedCat);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// GET CATEGORY
router.get("/", async (req, res) => {
    try {
      const cats = await Category.find();
      return res.status(200).json(cats);
    } catch (error) {
      return res.status(500).json(error);
    }
  });

module.exports = router;
