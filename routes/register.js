const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../Modal/user_modal');
const router = express.Router();

// Registration API
router.post('/', async (req, res) => {
  const { userEmail, userPassword, username, phoneNumber, fullName, userRole } =
    req.body;

  if (
    !userEmail ||
    !userPassword ||
    !username ||
    !phoneNumber ||
    !fullName ||
    !userRole
  ) {
    return res.status(402).json({
      message:
        'All fields are required(userEmail,userPassword,username,phonenumber,fullName,userRole)',
    });
  }

  try {
    const existingUser = await User.findOne({
      userEmail: userEmail.toLowerCase(),
    });
    if (existingUser) {
      return res
        .status(402)
        .json({ message: 'User already exists Plz Go Login' });
    }

    const existingUserName = await User.findOne({
      username: username,
    });
    if (existingUserName) {
      return res
        .status(402)
        .json({ message: 'UserName is Already Exists Try Other Email.' });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = new User({
      userEmail: userEmail.toLowerCase(),
      userPassword: hashedPassword,
      username: username,
      phoneNumber: phoneNumber,
      fullName: fullName,
      userRole: userRole,
      profileStatus: userRole === 'user' ? true : false,
    });

    const repponse = await newUser.save();
    res.status(200).json({ message: 'User Registered Successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error.', reason: error.message });
  }
});

module.exports = router;
