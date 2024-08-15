import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewBatch = () => {
  const [batchName, setBatchName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/batches', { BatchName: batchName });
      navigate('/batches'); // Redirect to the batches list page
    } catch (error) {
      console.error('Error adding new batch:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-gray-800 rounded-lg">
        <div className="mb-6">
          <label htmlFor="batchName" className="block mb-2 text-sm font-medium">
            Batch Name
          </label>
          <input
            type="text"
            id="batchName"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter batch name"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-4 text-lg font-semibold bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add Batch
        </button>
      </form>
    </div>
  );
};

export default NewBatch;
