import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    PhoneNumber: '',
    Email: '',
    FirstName: '',
    LastName: '',
    Role: 'student',
    ProfileIcon: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', formData);
      fetchUsers();
      setFormData({
        Username: '',
        Password: '',
        PhoneNumber: '',
        Email: '',
        FirstName: '',
        LastName: '',
        Role: 'student',
        ProfileIcon: ''
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDelete = async (userID) => {
    try {
      await axios.delete(`/api/users/${userID}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 pb-24">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-500">Manage Users</h1>

      {/* Add User Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            name="Username" 
            value={formData.Username} 
            onChange={handleInputChange} 
            placeholder="Username" 
            className="input-field bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <input 
            type="password" 
            name="Password" 
            value={formData.Password} 
            onChange={handleInputChange} 
            placeholder="Password" 
            className="input-field bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <input 
            type="text" 
            name="PhoneNumber" 
            value={formData.PhoneNumber} 
            onChange={handleInputChange} 
            placeholder="Phone Number" 
            className="input-field bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="email" 
            name="Email" 
            value={formData.Email} 
            onChange={handleInputChange} 
            placeholder="Email" 
            className="input-field bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <input 
            type="text" 
            name="FirstName" 
            value={formData.FirstName} 
            onChange={handleInputChange} 
            placeholder="First Name" 
            className="input-field bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="text" 
            name="LastName" 
            value={formData.LastName} 
            onChange={handleInputChange} 
            placeholder="Last Name" 
            className="input-field bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <select 
            name="Role" 
            value={formData.Role} 
            onChange={handleInputChange} 
            className="input-field bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <input 
            type="text" 
            name="ProfileIcon" 
            value={formData.ProfileIcon} 
            onChange={handleInputChange} 
            placeholder="Profile Icon URL" 
            className="input-field bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg mt-6 hover:bg-blue-700 transition-all duration-200"
        >
          Add User
        </button>
      </form>

      {/* List of Users */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full bg-gray-800 text-white ">
          <thead>
            <tr className="text-left bg-gray-700">
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.UserID} className="border-t border-gray-700 hover:bg-gray-700 transition-all duration-200">
                <td className="p-3">{user.Username}</td>
                <td className="p-3">{user.Email}</td>
                <td className="p-3">{user.Role}</td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => handleDelete(user.UserID)} 
                    className="text-red-500 hover:text-red-700 transition-all duration-200"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUser;
