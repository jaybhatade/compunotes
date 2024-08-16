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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-500">Login</h2>

        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUserAlt className="absolute left-3 top-3 text-gray-500" />
            <input 
              type="text" 
              name="Username" 
              value={formData.Username} 
              onChange={handleInputChange} 
              placeholder="Username" 
              className="w-full pl-10 p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input 
              type="password" 
              name="Password" 
              value={formData.Password} 
              onChange={handleInputChange} 
              placeholder="Password" 
              className="w-full pl-10 p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg mt-6 hover:bg-blue-700 transition-all duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
