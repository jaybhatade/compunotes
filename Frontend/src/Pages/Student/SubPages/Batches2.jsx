import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiFillPlusCircle } from 'react-icons/ai';

const Batches2 = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        console.log('Sending request to fetch batches...');
        const response = await axios.get('/api/v3/batches', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Response received:', response);
        setBatches(response.data);
      } catch (error) {
        console.error('Error fetching batches:', error);
        if (error.response && error.response.status === 401) {
          setError('You are not logged in. Please log in to view batches.');
          // Optionally, redirect to login page
          // navigate('/login');
        } else {
          setError('An error occurred while fetching batches. Please try again later.');
        }
      }
    };
    fetchBatches();
  }, [navigate]);

  const handleBatchClick = (batchID) => {
    navigate(`details/${batchID}`);
  };

  const handleAddBatch = () => {
    navigate('new');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Batches</h1>
      </header>
      <div className="grid gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        {batches.map((batch) => (
          <div
            key={batch.BatchID}
            onClick={() => handleBatchClick(batch.BatchID)}
            className="p-4 bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700"
          >
            <h2 className="text-xl font-semibold text-center">{batch.BatchName}</h2>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Batches2;