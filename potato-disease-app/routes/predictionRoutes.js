const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { predict, getHistory } = require('../controllers/predictionController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// routes/predictionRoutes.js
router.get('/dashboard', protect, (req, res) => {
    res.render('dashboard', { 
      prediction: null,  // Initialize prediction
      error: null,  // Initialize error      
    });
  });
router.post('/predict', protect, upload.single('image'), predict);
router.get('/history', protect, getHistory);

module.exports = router;