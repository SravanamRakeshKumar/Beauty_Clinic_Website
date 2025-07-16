import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, Phone, Search, Filter, Check, X, Eye ,BadgeCheck } from 'lucide-react';
import axios from 'axios';


const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const { addToast } = useToast();

  const statusFilters = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };


  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const loadAppointments = async () => {
    try {
      // Mock API call
      const mockAppointments = await axios.get('https://686fae6b91e85fac42a215f6.mockapi.io/appointments');
      setAppointments(mockAppointments.data);
    } catch (error) {
      console.error('Error loading appointments:', error);
      addToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(appointment =>
        appointment.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredAppointments(filtered);
  };


  const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    // Optional: update status on mock API if needed
    await axios.put(`https://686fae6b91e85fac42a215f6.mockapi.io/appointments/${appointmentId}`, {
      status: newStatus
    });

    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: newStatus }
        : appointment
    );

    setAppointments(updatedAppointments);
    addToast(`Appointment ${newStatus} successfully`, 'success');
  } catch (error) {
    console.error('Failed to update appointment:', error);
    addToast('Failed to update appointment', 'error');
  }
};


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Appointments</h1>
          <p className="text-xl text-gray-600">View and manage all customer appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statusFilters.slice(1).map((status) => {
            const count = appointments.filter(apt => apt.status.toLowerCase() === status.toLowerCase()).length;
            const colors = {
              pending: 'from-yellow-500 to-yellow-600',
              confirmed: 'from-green-500 to-green-600',
              completed: 'from-blue-500 to-blue-600',
              cancelled: 'from-red-500 to-red-600'
            };
            
            return (
              <div key={status} className="bg-white rounded-2xl shadow-lg p-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${colors[status.toLowerCase()]} rounded-lg flex items-center justify-center mb-4`}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
                <p className="text-gray-600">{status} Appointments</p>
              </div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {statusFilters.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Price</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{appointment.userName}</div>
                        <div className="text-sm text-gray-500">{appointment.userEmail}</div>
                        <div className="text-sm text-gray-500">{appointment.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{appointment.serviceName}</div>
                      <div className="text-sm text-gray-500">{appointment.duration} minutes</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{formatDate(appointment.date)}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[appointment.status]}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-purple-600">${appointment.price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => viewAppointmentDetails(appointment)}
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {appointment.status === 'pending' && (
  <button
    onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
    title="Confirm"
  >
    <Check className="w-4 h-4" />
  </button>
)}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                            title="Mark Complete"
                          >
                            {/* <Check className="w-4 h-4" /> */}
                            <BadgeCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500">No appointments match your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointment Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Customer Information</h3>
                  <p className="text-gray-900">{selectedAppointment.userName}</p>
                  <p className="text-gray-600">{selectedAppointment.userEmail}</p>
                  <p className="text-gray-600">{selectedAppointment.phone}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Service Details</h3>
                  <p className="text-gray-900">{selectedAppointment.serviceName}</p>
                  <p className="text-gray-600">{selectedAppointment.duration} minutes - ${selectedAppointment.price}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Appointment Time</h3>
                  <p className="text-gray-900">{formatDate(selectedAppointment.date)}</p>
                  <p className="text-gray-600">{selectedAppointment.time}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedAppointment.status]}`}>
                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                  </span>
                </div>
                
              </div>

              <div className="flex space-x-4 pt-6 mt-6 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                {selectedAppointment.status === 'pending' && (
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'confirmed');
                      setShowModal(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;