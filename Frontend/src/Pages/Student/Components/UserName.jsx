import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter'; // Ensure you have installed this package

const UserName = () => {
  const [userName, setUserName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get('/api/v2/profile');
        if (response.data && response.data.FirstName && response.data.LastName) {
          setUserName(response.data.FirstName);
          setLastName(response.data.LastName);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserName();
  }, []);

  // Combine first name and last name
  const fullName = `${userName} ${lastName}`;

  return (
    <div className="flex justify-left items-center h-fit py-4 pb-8 bg-gray-900 text-white">
      {loading ? (
        <div className="text-xl animate-pulse">Loading...</div>
      ) : (
        <h1 className="text-3xl md:text-4xl font-bold">
          Hello, <span className="text-blue-400">
            <Typewriter words={[fullName]} loop={false} cursor cursorStyle="|" typeSpeed={100} />
          </span>
        </h1>
      )}
    </div>
  );
};

export default UserName;
