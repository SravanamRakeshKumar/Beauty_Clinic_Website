import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogOut, Calendar, Settings, Users, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? (user.isAdmin ? "/admin-dashboard" : "/dashboard") : "/"} className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              BeautyClinic
            </span>
          </Link>

          {/* Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {user.isAdmin ? (
                  <>
                    <NavLink to="/admin/services" icon={<Settings />} label="Services" active={isActive('/admin/services')} />
                    <NavLink to="/admin/appointments" icon={<Calendar />} label="Appointments" active={isActive('/admin/appointments')} />
                    <NavLink to="/admin/slots" icon={<Users />} label="Slots" active={isActive('/admin/slots')} />
                    <NavLink to="/admin-dashboard" icon={<Users />} label="Dashboard" active={isActive('/admin-dashboard')} />
                  </>
                ) : (
                  <>
                    <NavLink to="/services" icon={<Settings />} label="Services" active={isActive('/services')} />
                    <NavLink to="/book-appointment" icon={<Calendar />} label="Book" active={isActive('/book-appointment')} />
                    <NavLink to="/dashboard" icon={<Users />} label="Dashboard" active={isActive('/dashboard')} />
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-purple-600 transition-colors">Sign In</Link>
                <Link to="/register" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2">
            {user ? (
              <div className="flex flex-col space-y-2">
                {user.isAdmin ? (
                  <>
                    <MobileLink to="/admin/services" label="Services" />
                    <MobileLink to="/admin/appointments" label="Appointments" />
                    <MobileLink to="/admin/slots" label="Slots" />
                    <MobileLink to="/admin-dashboard" label="Dashboard" />
                  </>
                ) : (
                  <>
                    <MobileLink to="/services" label="Services" />
                    <MobileLink to="/book-appointment" label="Book" />
                    <MobileLink to="/dashboard" label="Dashboard" />
                  </>
                )}
                <button onClick={handleLogout} className="text-red-600 text-left">Logout</button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" className="text-gray-700">Sign In</Link>
                <Link to="/register" className="bg-purple-600 text-white px-3 py-2 rounded-md text-center">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
      active ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:text-purple-600'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const MobileLink = ({ to, label }) => (
  <Link to={to} className="text-gray-700 px-2 py-1 block">
    {label}
  </Link>
);

export default Navbar;
