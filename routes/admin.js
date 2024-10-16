const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const Booking = require('../Modal/Booking');
const User = require('../Modal/user_modal');

const router = express.Router();

router.get('/get_users', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find({ userRole: 'user' });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/delete_users', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.body;

    await User.deleteOne({ _id: userId });
    res.status(200).json({ message: 'User Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.get('/get_driver', isAuthenticated, async (req, res) => {
  try {
    const drivers = await User.find({ userRole: 'driver' });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/delete_driver', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.body;
    await User.deleteOne({ _id: userId });
    res.status(200).json({ message: 'Driver Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.get('/get_booking', isAuthenticated, async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});
router.post('/delete_booking', isAuthenticated, async (req, res) => {
  try {
    const { bookingId } = req.body;
    await Booking.deleteOne({ _id: bookingId });
    res.status(200).json({ message: 'Booking Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/check_profile_status', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId });
    res.status(200).json({ status: user.profileStatus });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.get('/get_analytics', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find({ userRole: 'user' });
    const drivers = await User.find({ userRole: 'driver' });
    const bookings = await Booking.find();
    res.status(200).json({
      userLength: users.length,
      driverLength: drivers.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
