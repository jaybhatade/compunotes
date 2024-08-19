import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the user role from session storage (or any other method)
    const userRole = sessionStorage.getItem('userRole');

    if (userRole === 'student') {
      navigate('/s/home');
    } else if (userRole === 'admin') {
      navigate('/a/home');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>Loading...</div>
  );
}

export default Home;
