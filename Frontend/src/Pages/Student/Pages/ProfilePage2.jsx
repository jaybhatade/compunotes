import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaIdBadge, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfilePage2 = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/v2/profile');
      setUserData(response.data);
      setEditedData(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login'); // Redirect to login if not authenticated
      } else {
        setError('Failed to fetch user data.');
        setLoading(false);
        console.error('Profile fetch error:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/v2/profile', editedData);
      setUserData(editedData);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile.');
      console.error('Profile update error:', error);
    }
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchUserProfile}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const { Username, FirstName, LastName, Email, PhoneNumber, Role, ProfileIcon } = isEditing ? editedData : userData;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full text-white transition-all transform hover:scale-105 duration-300">
        {/* Show profile picture only if ProfileIcon exists */}
        {ProfileIcon && (
          <div className="flex justify-center mb-6">
            <img src={ProfileIcon} alt="Profile" className="rounded-full h-24 w-24 border-4 border-blue-500 shadow-md" />
          </div>
        )}
        
        <h2 className="text-3xl font-bold text-center mb-4">{`${FirstName} ${LastName}`}</h2>
        <div className="space-y-6">
          <div className="flex items-center bg-gray-700 rounded-md p-3">
            <FaIdBadge className="mr-3 text-blue-500" />
            <span className="text-lg">{Username}</span>
          </div>
          <div className="flex items-center bg-gray-700 rounded-md p-3">
            <FaEnvelope className="mr-3 text-blue-500" />
            {isEditing ? (
              <input
                type="email"
                name="Email"
                value={Email}
                onChange={handleChange}
                className="bg-transparent text-white outline-none w-full"
              />
            ) : (
              <span>{Email}</span>
            )}
          </div>
          <div className="flex items-center bg-gray-700 rounded-md p-3">
            <FaPhone className="mr-3 text-blue-500" />
            {isEditing ? (
              <input
                type="tel"
                name="PhoneNumber"
                value={PhoneNumber || ''}
                onChange={handleChange}
                className="bg-transparent text-white outline-none w-full"
              />
            ) : (
              <span>{PhoneNumber || 'N/A'}</span>
            )}
          </div>
          <div className="flex items-center bg-gray-700 rounded-md p-3">
            <FaUserAlt className="mr-3 text-blue-500" />
            <span className="capitalize">{Role}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage2;
