import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({ Username: '', Password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', formData);
      const { Role } = response.data;

      // Store user role in session storage
      sessionStorage.setItem('userRole', Role);

      if (Role === 'teacher' || Role === 'admin') {
        navigate('/a/home');
      } else if (Role === 'student') {
        navigate('/s/home');
      }
    } catch (error) {
      setError('Invalid Username or Password');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 p-6 sm:p-8">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-4xl font-extrabold text-center text-blue-400">Login</h2>

        {error && (
          <div className="text-red-400 text-center text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUserAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              name="Username" 
              value={formData.Username} 
              onChange={handleInputChange} 
              placeholder="Username" 
              className="w-full pl-12 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required 
              aria-label="Username"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="password" 
              name="Password" 
              value={formData.Password} 
              onChange={handleInputChange} 
              placeholder="Password" 
              className="w-full pl-12 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required 
              aria-label="Password"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg mt-6 hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
