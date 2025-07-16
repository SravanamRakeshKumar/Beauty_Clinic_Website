import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // ✅ Get login from context
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const user = await login(formData.email, formData.password);
    addToast('Welcome back!', 'success');

    if (user.isAdmin) {
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
    }
  } catch (err) {
    // ✅ Safely access custom backend error message
    const errorMessage = err?.response?.data?.message || 'Invalid email or password';
    addToast(errorMessage, 'error');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="w-full bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/3985319/pexels-photo-3985319.jpeg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-pink-600/80" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
              <p className="text-xl">Continue your beauty journey with us</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                BeautyClinic
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Welcome back to your beauty sanctuary</p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg pr-10 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don’t have an account?{' '}
              <Link to="/register" className="text-purple-600 font-semibold">Sign up here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;