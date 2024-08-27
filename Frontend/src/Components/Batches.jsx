import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiFillPlusCircle } from 'react-icons/ai';

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get('/api/batches');
        setBatches(response.data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };
    fetchBatches();
  }, []);

  const handleBatchClick = (batchID) => {
    navigate(`details/${batchID}`);
  };

  const handleAddBatch = () => {
    navigate('new');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-24 flex flex-col items-center">
      <header className="mb-8 w-full max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Batch Management
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Manage your batches effectively and easily.
        </p>
      </header>
      <div className="w-full  grid gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-3">
        {batches.map(batch => (
          <div
            key={batch.BatchID}
            onClick={() => handleBatchClick(batch.BatchID)}
            className="p-6 bg-gray-800 rounded-xl shadow-lg cursor-pointer transform transition-transform hover:scale-105 hover:bg-gray-700"
          >
            <h2 className="text-2xl font-semibold text-center text-blue-100">
              {batch.BatchName}
            </h2>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddBatch}
        className="flex items-center justify-center w-full max-w-xs px-6 py-3 bg-blue-600 rounded-full text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        <AiFillPlusCircle size={28} className="mr-2" />
        Add & Manage Batches
      </button>
    </div>
  );
};

export default Batches;
