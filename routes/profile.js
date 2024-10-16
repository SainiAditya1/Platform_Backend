const express = require('express');
const User = require('../Modal/user_modal');
const multer = require('multer');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// userinfo API
router.post('/', isAuthenticated, async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(402).json({ message: 'userId is Required.' });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(402)
        .json({ message: 'User Is Not Register..Plz Register!' });
    }

    res.json({ userInfo: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error.', reason: error.message });
  }
});

// Update user info API
router.post(
  '/update',
  isAuthenticated,
  upload.single('file'),
  async (req, res) => {
    const userInfo = req.body;
    try {
      if (!userInfo.userId) {
        return res.status(402).json({ message: 'userId is required.' });
      }
      const user = await User.findById({ _id: userInfo.userId });
      if (!user) {
        return res
          .status(402)
          .json({ message: 'User not registered. Please register!' });
      }

      if (userInfo.phoneNumber) user.phoneNumber = userInfo.phoneNumber;
      if (userInfo.fullName) user.fullName = userInfo.fullName;

      if (userInfo.userRole === 'driver') {
        if (userInfo.vehicleNumber) user.vehicleNumber = userInfo.vehicleNumber;
        if (userInfo.vehicleType) user.vehicleType = userInfo.vehicleType;
        user.profileStatus = true;
      }

      if (req.file) {
        user.image = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }
      await user.save();
      res.json({ message: 'Profile updated successfully.' });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Internal server error.', reason: error.message });
    }
  }
);

module.exports = router;
