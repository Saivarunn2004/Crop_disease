const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000) // 1 hour
    });

    res.redirect('/dashboard');
  } catch (err) {
    res.render('login', { error: 'Something went wrong' });
  }
};

// controllers/authController.js
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      return res.render('signup', { 
        error: 'User already exists', 
        username,  // Preserve form input
        email,
      });
    }

    const newUser = await User.create({ username, email, password });
    res.redirect('/login',{user:req.user });
  } catch (err) {
    res.render('signup', { 
      error: 'Registration failed',
      username: req.body.username,
      email: req.body.email,
    });
  }
};