const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/authController');

router.get('/login', (req, res) => {
    res.render('login', { error: null}); // Initialize error as null
  });
// routes/authRoutes.js
router.get('/signup', (req, res) => {
    res.render('signup', { error: null}); // Initialize error as null
  });
router.post('/login', login);
router.post('/signup', signup);

// Add logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;