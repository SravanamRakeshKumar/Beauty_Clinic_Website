const express = require('express');
const axios = require('axios');
const Slot = require('../models/Slot');
const router = express.Router();
const MOCK_API_URL = 'https://686fae6b91e85fac42a215f6.mockapi.io/appointments';

/**
 * GET /appointments - Fetch all appointments
 */
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(MOCK_API_URL);
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching appointments:', err.message);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

/**
 * GET /appointments/user/:userId - Get appointments for a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await axios.get(MOCK_API_URL);
    const userAppointments = response.data.filter(apt => apt.userId === userId);
    res.json(userAppointments);
  } catch (err) {
    console.error('Error fetching user appointments:', err.message);
    res.status(500).json({ message: 'Failed to fetch user appointments' });
  }
});

/**
 * GET /appointments/available-slots?date=YYYY-MM-DD - Get available slots for a specific date
 */
router.get('/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // 1. Full slot list
    const allSlots = [
      '09:00', '10:00', '11:00',
      '12:00', '13:00', '14:00',
      '15:00', '16:00', '17:00', '18:00'
    ];

    // 2. Get all booked appointments for the date
    const response = await axios.get(MOCK_API_URL);
    const booked = response.data.filter(apt => apt.date === date);
    const bookedTimes = booked.map(apt => apt.time);

    // 3. Get admin CLOSED slots from Slot model
    const slotDoc = await Slot.findOne({ date });
    const closedByAdmin = slotDoc?.timeSlots || [];

    // 4. Final available = allSlots - bookedTimes - closedByAdmin
    const availableSlots = allSlots.filter(
      slot => !bookedTimes.includes(slot) && !closedByAdmin.includes(slot)
    );

    res.json({ availableSlots });
  } catch (err) {
    console.error('Error fetching available slots:', err.message);
    res.status(500).json({ message: 'Failed to get available slots' });
  }
});

/**
 * POST /appointments - Book a new appointment
 */
router.post('/', async (req, res) => {
  try {
    const appointment = req.body;

    if (!appointment.userId || !appointment.serviceId || !appointment.date || !appointment.time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const response = await axios.post(MOCK_API_URL, appointment);
    res.status(201).json({ message: 'Appointment booked successfully', data: response.data });
  } catch (err) {
    console.error('Error booking appointment:', err.message);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
});

/**
 * PUT /appointments/:id - Update an existing appointment
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const response = await axios.put(`${MOCK_API_URL}/${id}`, updatedData);
    res.json({ message: 'Appointment updated successfully', data: response.data });
  } catch (err) {
    console.error('Error updating appointment:', err.message);
    res.status(500).json({ message: 'Failed to update appointment' });
  }
});

/**
 * DELETE /appointments/:id - Cancel/Delete an appointment
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await axios.delete(`${MOCK_API_URL}/${id}`);
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling appointment:', err.message);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
});

module.exports = router;