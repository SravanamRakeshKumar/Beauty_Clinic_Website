const express = require('express');
const axios = require('axios');

const router = express.Router();

const MOCK_API_URL = 'https://686fae6b91e85fac42a215f6.mockapi.io/services';

// ✅ Get all services (public)
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(MOCK_API_URL);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching services:', error.message);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// ✅ Get single service by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${MOCK_API_URL}/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching service:', error.message);
    res.status(404).json({ message: 'Service not found' });
  }
});

// ✅ Create a new service (admin only, token-based logic handled in frontend or middleware)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, duration, category, image } = req.body;

    const newService = {
      name,
      description,
      price,
      duration,
      category,
      image
    };

    const response = await axios.post(MOCK_API_URL, newService);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating service:', error.message);
    res.status(500).json({ message: 'Failed to create service' });
  }
});

// ✅ Update service by ID
router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${MOCK_API_URL}/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error updating service:', error.message);
    res.status(500).json({ message: 'Failed to update service' });
  }
});

// ✅ Delete service by ID
router.delete('/:id', async (req, res) => {
  try {
    await axios.delete(`${MOCK_API_URL}/${req.params.id}`);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error.message);
    res.status(500).json({ message: 'Failed to delete service' });
  }
});

module.exports = router;