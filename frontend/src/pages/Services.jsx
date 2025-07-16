import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Updated categories based on your dataset
  const categories = [
    'All',
    'Facials',
    'Skin Treatments',
    'Hair Spa',
    'Massage & Spa'
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://686fae6b91e85fac42a215f6.mockapi.io/services');
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filterServices = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(service => service.category === category));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const handleBookNow = (id) => {
    navigate('/book-appointment', {
      state: { serviceId: id } // pass the selected service id
    });
  };


  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600">
            Discover our premium beauty treatments designed just for you
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => filterServices(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ₹{service.price}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{service.rating || '4.8'}</span>
                  </div>
                </div>

                <button
      onClick={() => handleBookNow(service.id)}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
    >
      Book Now
    </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;