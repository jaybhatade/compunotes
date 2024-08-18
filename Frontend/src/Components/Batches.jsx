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
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Batches</h1>
      </header>
      <div className="grid gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        {batches.map(batch => (
          <div
            key={batch.BatchID}
            onClick={() => handleBatchClick(batch.BatchID)}
            className="p-4 bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700"
          >
            <h2 className="text-xl font-semibold text-center">{batch.BatchName}</h2>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddBatch}
        className="flex items-center justify-center mt-8 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        <AiFillPlusCircle size={24} className="mr-2" />
        Add Batch
      </button>
    </div>
  );
};

export default Batches;
