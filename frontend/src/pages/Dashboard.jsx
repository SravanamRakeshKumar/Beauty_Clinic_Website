import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Calendar, Clock, Edit, Trash2, Filter } from 'lucide-react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const API_URL = 'https://686fae6b91e85fac42a215f6.mockapi.io/appointments';
const SERVICE_URL = 'https://686fae6b91e85fac42a215f6.mockapi.io/services';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const { user } = useAuth();
  const { addToast } = useToast();

  const filters = ['All', 'Confirmed', 'Pending', 'Cancelled', 'Completed'];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  useEffect(() => {
    filterAppointments(activeFilter);
  }, [appointments, activeFilter]);

  useEffect(() => {
    if (editingAppointment?.date) {
      fetchAvailableSlots(editingAppointment.date);
    }
  }, [editingAppointment?.date]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const userAppointments = response.data.filter(
        (apt) => apt.userEmail === user?.email
      );
      setAppointments(userAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      addToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(SERVICE_URL);
      setServices(res.data);
    } catch (err) {
      console.error('Service load error:', err);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/appointments/available-slots?date=${date}`
      );
      setAvailableSlots(res.data.availableSlots || []);
    } catch (err) {
      console.error('Failed to fetch slots:', err);
    }
  };

  const filterAppointments = (filter) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter(
          (apt) => apt.status.toLowerCase() === filter.toLowerCase()
        )
      );
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updated = appointments.map((apt) =>
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      );
      setAppointments(updated);
      addToast('Appointment cancelled successfully', 'success');
    } catch (error) {
      console.error('Cancel error:', error);
      addToast('Failed to cancel appointment', 'error');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const service = services.find((s) => s.id === editingAppointment.serviceId);
      if (!service) return addToast('Invalid service', 'error');

      const updatedData = {
        ...editingAppointment,
        serviceName: service.name,
        price: service.price,
      };

      await axios.put(`${API_URL}/${editingAppointment.id}`, updatedData);
      addToast('Appointment updated successfully', 'success');
      setEditingAppointment(null);
      fetchAppointments();
    } catch (err) {
      console.error('Update error:', err);
      addToast('Failed to update appointment', 'error');
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-xl text-gray-600">
            Welcome back, {user?.name || 'User'}!
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Appointments',
              value: appointments.length,
              color: 'from-purple-500 to-purple-600',
            },
            {
              label: 'Confirmed',
              value: appointments.filter((a) => a.status === 'confirmed').length,
              color: 'from-green-500 to-green-600',
            },
            {
              label: 'Pending',
              value: appointments.filter((a) => a.status === 'pending').length,
              color: 'from-yellow-500 to-yellow-600',
            },
            {
              label: 'Completed',
              value: appointments.filter((a) => a.status === 'completed').length,
              color: 'from-blue-500 to-blue-600',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>


<div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
            <Filter className="w-5 h-5 text-gray-500" />
          </div>

          

          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => filterAppointments(filter)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No appointments found
                </h3>
                <p className="text-gray-500">
                  {activeFilter === 'All'
                    ? "You haven't booked any appointments yet."
                    : `No ${activeFilter.toLowerCase()} appointments.`}
                </p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {appointment.serviceName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusColors[appointment.status]
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {appointment.time} ({appointment.duration || 60} min)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-purple-600">
                            ${appointment.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      {appointment.status === 'pending' && (
                        <>
                    <button
                      onClick={() => setEditingAppointment(appointment)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      <Edit className="w-4 h-4 inline mr-1" /> Edit
                    </button>
                          <button
                            onClick={() => cancelAppointment(appointment.id)}
                            className="flex items-center space-x-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>




      

        {editingAppointment && (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded shadow-lg mt-8 space-y-4"
          >
            <h3 className="text-xl font-bold">Edit Appointment</h3>

            <select
              value={editingAppointment.serviceId}
              onChange={(e) =>
                setEditingAppointment((prev) => ({ ...prev, serviceId: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - ₹{s.price}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={editingAppointment.date}
              onChange={(e) =>
                setEditingAppointment((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded"
            />

              <select
    value={editingAppointment.time}
    onChange={(e) =>
      setEditingAppointment((prev) => ({ ...prev, time: e.target.value }))
    }
    className="w-full border px-3 py-2 rounded"
  >
    <option value={editingAppointment.time}>{editingAppointment.time}</option>
    {availableSlots
      .filter((t) => t !== editingAppointment.time)
      .map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
  </select>


            <input
              type="tel"
              value={editingAppointment.phone}
              onChange={(e) =>
                setEditingAppointment((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Phone number"
              className="w-full border px-3 py-2 rounded"
              required
            />

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingAppointment(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </form>
        )}
    
     


        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Book New Appointment
              </h3>
              <p className="text-gray-600 mb-4">
                Schedule your next beauty session with us
              </p>
              <a
                href="/book-appointment"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Book Now
              </a>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Browse Services
              </h3>
              <p className="text-gray-600 mb-4">
                Explore our range of premium beauty treatments
              </p>
              <a
                href="/services"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                View Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;