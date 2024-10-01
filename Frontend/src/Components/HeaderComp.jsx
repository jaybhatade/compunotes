import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa'; // User icon placeholder
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [profileIcon, setProfileIcon] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile icon from the server
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/v2/profile'); // Updated endpoint
        setProfileIcon(response.data.ProfileIcon || null); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching profile icon:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle profile icon click
  const handleProfileClick = () => {
    navigate('/s/profile');
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-800 shadow-md shadow-black/30 transition-colors duration-200 fixed w-full z-[999]">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white transition-colors duration-200">CompuNotes</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button onClick={handleProfileClick} className="w-8 h-8 rounded-full bg-gray-600 transition-colors duration-200 flex items-center justify-center">
            {profileIcon ? (
              <img src={profileIcon} alt="Profile" className="w-full h-full rounded-full" />
            ) : (
              <FaUserCircle className="text-white w-full h-full" /> // User icon placeholder
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
