const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const Booking = require('../Modal/Booking');
const User = require('../Modal/user_modal');
const router = express.Router();

router.post('/', isAuthenticated, async (req, res) => {
  const {
    userId,
    pickupLocation,
    dropOffLocation,
    vehicleType,
    date,
    time,
    estimatedCost,
  } = req.body;

  if (
    !userId ||
    !pickupLocation ||
    !dropOffLocation ||
    !vehicleType ||
    !date ||
    !time ||
    !estimatedCost
  ) {
    return res.status(402).json({ message: 'All fields are required.' });
  }

  const newBooking = new Booking({
    userId,
    pickupLocation,
    dropOffLocation,
    vehicleType,
    date,
    time,
    estimatedCost,
  });

  try {
    await newBooking.save();
    res
      .status(200)
      .json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/viewBooking', isAuthenticated, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(402).json({ message: 'User ID is required.' });
  }

  try {
    const bookings = await Booking.find({ userId });
    res.status(200).json({ message: 'Booking created successfully', bookings });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/DeleteBooking', isAuthenticated, async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(402).json({ message: 'Booking ID is required.' });
  }

  try {
    await Booking.deleteOne({ _id: bookingId });
    res.status(200).json({ message: 'Booking Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/viewOpenBooking', isAuthenticated, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(402).json({ message: 'User ID is required.' });
  }

  try {
    const user = await User.findOne({ _id: userId }).select('vehicleType');

    if (!user) {
      return res.status(402).json({ message: 'User not found.' });
    }

    if (!user.vehicleType) {
      return res
        .status(402)
        .json({ message: 'User has no vehicle type assigned.' });
    }
    const bookings = await Booking.find({
      status: 'pending',
      vehicleType: user.vehicleType,
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/updateBookingStatus', isAuthenticated, async (req, res) => {
  const { bookingId, userId } = req.body;

  if (!bookingId || !userId) {
    return res
      .status(402)
      .json({ message: 'Booking ID and User ID are required.' });
  }

  try {
    const currentBooking = await Booking.findOne({ _id: bookingId });
    if (!currentBooking) {
      return res.status(402).json({ message: 'Booking not found.' });
    }

    currentBooking.status = 'current';
    currentBooking.cabId = userId;
    await currentBooking.save();
    res.status(200).json({ message: 'Booking status updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/gettingCurrentBooking', isAuthenticated, async (req, res) => {
  const { userRole, userId } = req.body;

  if (!userRole || !userId) {
    return res
      .status(402)
      .json({ message: 'userRole and User ID are required.' });
  }

  try {
    let currentBooking;
    let currentUser;
    if (userRole === 'user')
      currentBooking = await Booking.findOne({
        userId: userId,
        status: 'current',
      });
    else
      currentBooking = await Booking.findOne({
        cabId: userId,
        status: 'current',
      });

    if (!currentBooking) {
      return res.status(402).json({ message: 'No Current Booking is found.' });
    }
    if (userRole === 'user')
      currentUser = await User.findOne({ _id: currentBooking.cabId });
    else currentUser = await User.findOne({ _id: currentBooking.userId });
    res
      .status(200)
      .json({ currentBooking: currentBooking, currentUser: currentUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/handleCompleteTour', isAuthenticated, async (req, res) => {
  const { bookingId, userId } = req.body;

  if (!bookingId || !userId) {
    return res
      .status(402)
      .json({ message: 'Booking ID and user id  is required.' });
  }

  try {
    const booking = await Booking.findOne({ _id: bookingId });
    if (!booking) {
      return res.status(402).json({ message: 'Booking not found.' });
    }

    booking.status = 'completed';

    await booking.save();

    const user = await User.findOne({ _id: userId });

    user.earnedMoney += booking.estimatedCost;

    await user.save();

    res.status(200).json({
      message: `Congratulations! Your tour is completed, and you have earned ${booking.estimatedCost} booking success.`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
