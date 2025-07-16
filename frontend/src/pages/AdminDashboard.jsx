import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Users, Calendar, DollarSign, Clock, TrendingUp, Star } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });

  const [animatedStats, setAnimatedStats] = useState({ ...stats });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('https://686fae6b91e85fac42a215f6.mockapi.io/appointments');
        const data = await response.json();

        const today = new Date().toISOString().split('T')[0];

        const totalAppointments = data.length;
        const todayAppointments = data.filter(app => app.date === today).length;
        const totalRevenue = data.reduce((sum, app) => sum + Number(app.price || 0), 0);
        const totalCustomers = new Set(data.map(app => app.userEmail)).size;
        const pendingAppointments = data.filter(app => app.status === 'pending').length;
        const completedAppointments = data.filter(app => app.status === 'completed').length;

        const todayAppointmentsList = data.slice(-3);

      

        setStats({
          totalAppointments,
          todayAppointments,
          totalRevenue,
          totalCustomers,
          pendingAppointments,
          completedAppointments
        });

        setRecentAppointments(todayAppointmentsList);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const animateValue = (key, start, end, duration) => {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        setAnimatedStats(prev => ({ ...prev, [key]: current }));
        if (progress === 1) clearInterval(timer);
      }, 16);
    };

    Object.keys(stats).forEach(key => {
      animateValue(key, 0, stats[key], 1500);
    });
  }, [stats]);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        {/* All stat cards and layout same as before using animatedStats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{animatedStats.totalAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12% from last month</span>
            </div>
          </div>



          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">{animatedStats.totalCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+15% from last month</span>
            </div>
          </div>


          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{animatedStats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+8% from last month</span>
            </div>
          </div>

        </div>
        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Resent Appointments</h2>
            <a href="/admin/appointments" className="text-purple-600 hover:text-purple-700 font-medium">View All</a>
          </div>
          <div className="space-y-4">
            {recentAppointments.length === 0 ? (
              <p className="text-gray-500">No appointments for today.</p>
            ) : (
              recentAppointments.map((appointment) => (
  <div
    key={appointment.id}
    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
  >
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
        <span className="text-white font-semibold">
          {appointment.userName?.charAt(0).toUpperCase() || "?"}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{appointment.userName}</h3>
        <p className="text-sm text-gray-600">{appointment.serviceName}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-600">{appointment.time}</span>
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          statusColors[appointment.status] || ""
        }`}
      >
        {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1) || "Unknown"}
      </span>
      <span className="font-semibold text-purple-600">₹{appointment.price}</span>
    </div>
  </div>
))

            )}
          </div>
        </div>
        {/* Keep quick actions section unchanged */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Appointments</h3>
            <p className="text-gray-600 mb-4">View and manage all customer appointments</p>
            <a
              href="/admin/appointments"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              View Appointments
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Services</h3>
            <p className="text-gray-600 mb-4">Add, edit, or remove beauty services</p>
            <a
              href="/admin/services"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Manage Services
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Slots</h3>
            <p className="text-gray-600 mb-4">Configure available time slots</p>
            <a
              href="/admin/slots"
              className="inline-block bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Manage Slots
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;