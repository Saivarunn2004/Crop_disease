// routes/predictionRoutes.js
const express = require("express");
const router = express.Router();
const Prediction = require("../models/Prediction");
const authMiddleware = require("../middleware/auth"); // Make sure this validates JWT

// Save prediction
router.post("/", authMiddleware, async (req, res) => {
  const { result, confidence, imageUrl } = req.body;
  try {
    const prediction = new Prediction({
      userId: req.user.id,
      result,
      confidence,
      imageUrl,
    });
    await prediction.save();
    res.status(201).json(prediction);
  } catch (error) {
    res.status(500).json({ error: "Failed to save prediction" });
  }
});

// Get user history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const history = await Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;