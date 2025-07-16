import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock API endpoints for services and appointments
export const mockApi = {
  services: 'https://686fae6b91e85fac42a215f6.mockapi.io/services',
  appointments: 'https://686fae6b91e85fac42a215f6.mockapi.io/appointments'
};

export const fetchServices = async () => {
  try {
    const response = await axios.get(mockApi.services);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    // Fallback data if API fails
    return [
      {
        id: '1',
        name: 'Classic Facial',
        description: 'Deep cleansing and moisturizing facial treatment',
        price: 89,
        duration: 60,
        category: 'Facial',
        image: 'https://images.pexels.com/photos/3985330/pexels-photo-3985330.jpeg'
      },
      {
        id: '2',
        name: 'Relaxing Massage',
        description: 'Full body massage for ultimate relaxation',
        price: 120,
        duration: 90,
        category: 'Massage',
        image: 'https://images.pexels.com/photos/3997994/pexels-photo-3997994.jpeg'
      },
      {
        id: '3',
        name: 'Hair Styling',
        description: 'Professional hair cut and styling',
        price: 75,
        duration: 45,
        category: 'Hair',
        image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg'
      },
      {
        id: '4',
        name: 'Manicure & Pedicure',
        description: 'Complete nail care and polish',
        price: 65,
        duration: 60,
        category: 'Nail',
        image: 'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg'
      },
      {
        id: '5',
        name: 'Body Wrap',
        description: 'Detoxifying and hydrating body treatment',
        price: 95,
        duration: 75,
        category: 'Body',
        image: 'https://images.pexels.com/photos/3985327/pexels-photo-3985327.jpeg'
      },
      {
        id: '6',
        name: 'Anti-Aging Facial',
        description: 'Advanced facial with anti-aging benefits',
        price: 130,
        duration: 90,
        category: 'Facial',
        image: 'https://images.pexels.com/photos/3985333/pexels-photo-3985333.jpeg'
      }
    ];
  }
};

export const fetchAppointments = async () => {
  try {
    const response = await axios.get(mockApi.appointments);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};