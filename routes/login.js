const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../Modal/user_modal');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants/constants');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

// Login API
router.post('/', async (req, res) => {
  const { userEmail, userPassword } = req.body;
  try {
    if (!userEmail || !userPassword) {
      return res
        .status(402)
        .json({ message: 'UserEmail And Password is Required.' });
    }
    const user = await User.findOne({ userEmail: userEmail.toLowerCase() });
    if (!user) {
      return res
        .status(402)
        .json({ message: 'User Is Not Register..Plz Register!' });
    }

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) {
      return res.status(402).json({ message: 'Invalid login details!' });
    }

    const userPayLoad = {
      userEmail: user.userEmail,
      userId: user._id,
      userRole: user.userRole,
    };
    const token = jwt.sign(userPayLoad, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, userInfo: userPayLoad, message: 'Login Successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error.', reason: error.message });
  }
});

// Login Check Route API
router.get('/user_login', isAuthenticated, (req, res) => {
  if (req.user && req.user.userEmail) {
    res.json({
      message: 'This is a protected route',
      userEmail: req.user.userEmail,
    });
  } else {
    res
      .status(401)
      .json({ message: 'User not authenticated', reason: error.message });
  }
});

module.exports = router;
