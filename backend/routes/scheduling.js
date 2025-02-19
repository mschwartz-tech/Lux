const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Middleware to authenticate and attach user to req.user
const TrainerAvailability = require('../models/TrainerAvailability');
const Booking = require('../models/Booking');

// GET trainer availability (example existing route)
router.get('/availability', async (req, res) => {
  try {
    const availabilities = await TrainerAvailability.find().populate('trainer', 'name');
    res.status(200).json(availabilities);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST trainer availability (example existing route)
router.post('/availability', authMiddleware, async (req, res) => {
  const { day, startTime, endTime } = req.body;
  try {
    const availability = new TrainerAvailability({
      trainer: req.user.id,
      day,
      startTime,
      endTime,
    });
    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    console.error('Error creating availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE availability by ID (new endpoint for trainers and admins)
router.delete('/availability/:id', authMiddleware, async (req, res) => {
  try {
    const availability = await TrainerAvailability.findById(req.params.id);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    // Authorization: Only the trainer who owns the availability or an admin can delete
    if (req.user.role !== 'admin' && availability.trainer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this availability' });
    }
    await availability.remove();
    res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET bookings (example existing route)
router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ member: req.user.id }).populate('trainer', 'name');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST booking (example existing route)
router.post('/bookings', authMiddleware, async (req, res) => {
  const { availabilityId, date, time } = req.body;
  try {
    const availability = await TrainerAvailability.findById(availabilityId);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    const booking = new Booking({
      member: req.user.id,
      trainer: availability.trainer,
      date,
      time,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE booking by ID (new endpoint for members, trainers, and admins)
router.delete('/bookings/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Authorization: Only the member who booked, the assigned trainer, or an admin can delete
    if (
      req.user.role !== 'admin' &&
      booking.member.toString() !== req.user.id &&
      booking.trainer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }
    await booking.remove();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;