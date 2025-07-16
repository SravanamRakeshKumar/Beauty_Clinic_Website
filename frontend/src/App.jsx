import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminServices from './pages/AdminServices';
import AdminAppointments from './pages/AdminAppointments';
import AdminSlots from './pages/AdminSlots';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected User Routes */}
              <Route path="/services" element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              } />
              <Route path="/book-appointment" element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/services" element={
                <AdminRoute>
                  <AdminServices />
                </AdminRoute>
              } />
              <Route path="/admin/appointments" element={
                <AdminRoute>
                  <AdminAppointments />
                </AdminRoute>
              } />
              <Route path="/admin/slots" element={
                <AdminRoute>
                  <AdminSlots />
                </AdminRoute>
              } />
              
              {/* Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;