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
      const response = await axios.post('/api/login', formData, {
        withCredentials: true
      });
      const { user } = response.data;

      // Store user role and username in session storage
      sessionStorage.setItem('userRole', user.Role);
      sessionStorage.setItem('username', user.Username);

      if (user.Role === 'teacher' || user.Role === 'admin') {
        navigate('/a/home');
      } else if (user.Role === 'student') {
        navigate('/s/home');
      }
    } catch (error) {
      setError('Invalid Username or Password');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="px-8 py-6 mt-4 text-left bg-gray-800 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-blue-400">Login</h3>
        {error && (
          <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div className="flex items-center">
              <FaUserAlt className="text-blue-400 mr-2" />
              <input
                type="text"
                placeholder="Username"
                name="Username"
                className="w-full px-4 py-2 mt-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={formData.Username}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <FaLock className="text-blue-400 mr-2" />
              <input
                type="password"
                placeholder="Password"
                name="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={formData.Password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex items-baseline justify-center">
            <button
              type="submit"
              className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
