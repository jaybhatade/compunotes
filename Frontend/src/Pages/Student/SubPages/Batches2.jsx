import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-24 flex flex-col items-center">
      <header className="mb-8 w-full max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Batch Management
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          View and explore your assigned batches.
        </p>
      </header>
      <div className="w-full grid gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-3">
        {batches.map((batch) => (
          <div
            key={batch.BatchID}
            onClick={() => handleBatchClick(batch.BatchID)}
            className="p-6 bg-gray-800 rounded-xl shadow-lg cursor-pointer transform transition-transform hover:scale-105 hover:bg-gray-700"
          >
            <h2 className="text-2xl font-semibold text-center text-indigo-100">
              {batch.BatchName}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Batches2;
