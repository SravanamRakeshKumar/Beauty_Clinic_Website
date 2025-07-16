import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Star, Users, Award, Clock, Sparkles } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Home = () => {
  const [services, setServices] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Transform Your Beauty",
      subtitle: "Experience luxury treatments with professional care",
      image: "https://images.pexels.com/photos/3985360/pexels-photo-3985360.jpeg"
    },
    {
      title: "Expert Beauty Solutions",
      subtitle: "Personalized treatments for your unique beauty needs",
      image: "https://images.pexels.com/photos/3985321/pexels-photo-3985321.jpeg"
    },
    {
      title: "Relax & Rejuvenate",
      subtitle: "Your sanctuary for beauty and wellness",
      image: "https://images.pexels.com/photos/3985328/pexels-photo-3985328.jpeg"
    }
  ];

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await axios.get('https://686fae6b91e85fac42a215f6.mockapi.io/services');
        setServices(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                BeautyClinic
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <section className="relative h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div className="max-w-4xl px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 animate-fade-in-up delay-200">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <ScrollReveal>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose Us
              </h2>
              <p className="text-xl text-gray-600">
                Experience the difference with our premium beauty services
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Award,
                  title: "Expert Professionals",
                  description: "Certified beauty experts with years of experience"
                },
                {
                  icon: Star,
                  title: "Premium Quality",
                  description: "Only the finest products and latest techniques"
                },
                {
                  icon: Clock,
                  title: "Flexible Scheduling",
                  description: "Book appointments that fit your busy lifestyle"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <feature.icon className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Our Services */}
      <ScrollReveal>
        <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Services
              </h2>
              <p className="text-xl text-gray-600">
                Discover our range of premium beauty treatments
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <img
                    src={service.imageUrl || "https://images.pexels.com/photos/3985330/pexels-photo-3985330.jpeg"}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">${service.price}</span>
                      <span className="text-sm text-gray-500">{service.duration} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                <span>View All Services</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* People at Clinic */}
      <ScrollReveal>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Expert Team
              </h2>
              <p className="text-xl text-gray-600">
                Meet the professionals who make your beauty dreams come true
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Senior Beauty Specialist",
                  image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                },
                {
                  name: "Emily Chen",
                  role: "Skincare Expert",
                  image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                },
                {
                  name: "Maria Rodriguez",
                  role: "Makeup Artist",
                  image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
                },
                {
                  name: "Jessica Kim",
                  role: "Wellness Therapist",
                  image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
                }
              ].map((person, index) => (
                <div
                  key={index}
                  className="text-center group"
                >
                  <div className="relative overflow-hidden rounded-2xl mb-4">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{person.name}</h3>
                  <p className="text-purple-600">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Feedback Section */}
      <ScrollReveal>
        <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-600">
                Real experiences from our valued customers
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Anna Williams",
                  rating: 5,
                  comment: "Absolutely amazing experience! The staff is professional and the results exceeded my expectations."
                },
                {
                  name: "David Brown",
                  rating: 5,
                  comment: "Best beauty clinic in town. Clean, modern facilities and incredible service quality."
                },
                {
                  name: "Lisa Davis",
                  rating: 5,
                  comment: "I've been coming here for months and every visit is perfect. Highly recommend!"
                }
              ].map((review, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{review.comment}"</p>
                  <p className="font-semibold text-gray-900">- {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Contact Section */}
      <ScrollReveal>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-xl text-gray-600">
                Ready to start your beauty journey? Get in touch with us
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-600">123 Beauty Street, City, State 12345</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">info@beautyclinic.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Hours</h4>
                    <p className="text-gray-600">Mon-Fri: 9AM-8PM, Sat-Sun: 10AM-6PM</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Begin?</h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of satisfied customers and experience the transformation you deserve.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  <span>Book Your First Appointment</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold">BeautyClinic</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your premier destination for beauty and wellness
            </p>
            <p className="text-sm text-gray-500">
              © 2025 BeautyClinic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;