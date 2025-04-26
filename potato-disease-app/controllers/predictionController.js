const Prediction = require('../models/Prediction');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path'); // Add this

exports.predict = async (req, res) => {
  try {
    if (!req.file) {
      return res.render('dashboard', { error: 'Please upload an image' });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    const targetPath = path.join(__dirname, '../public/uploads/', filename);

    // Move file to permanent location
    await fs.promises.rename(req.file.path, targetPath);

    // Prepare request to FastAPI
    const formData = new FormData();
    formData.append('file', fs.createReadStream(targetPath));

    const response = await axios.post('http://localhost:8000/predict', formData, {
      headers: formData.getHeaders()
    });

    // Validate API response
    if (!response.data || !response.data.class || !response.data.confidence) {
      throw new Error('Invalid API response');
    }

    // Save prediction with user ID
    await Prediction.create({
      user: req.user.id,
      image: filename, // Store unique filename
      prediction: response.data.class,
      confidence: response.data.confidence
    });

    res.render('dashboard', { 
      prediction: response.data,
      success: 'Prediction successful!',
    });

  } catch (err) {
    // Cleanup uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      await fs.promises.unlink(req.file.path);
    }

    console.error('Prediction error:', err);
    res.render('dashboard', { 
      error: 'Prediction failed. Please try again with a valid image.',
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user.id })
      .sort('-createdAt')
      .lean(); // Convert to plain JS objects

    // Add formatted date and confidence percentage
    const formattedPredictions = predictions.map(prediction => ({
      ...prediction,
      formattedDate: new Date(prediction.createdAt).toLocaleString(),
      confidencePercentage: (prediction.confidence * 100).toFixed(2) + '%'
    }));

    res.render('history', { 
      predictions: formattedPredictions ,
    });

  } catch (err) {
    console.error('History error:', err);
    res.render('history', { 
      error: 'Failed to load prediction history'
    });
  }
};