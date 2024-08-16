import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoAlertCircle } from 'react-icons/io5';

const NewBatch = () => {
  const [batchName, setBatchName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages

    try {
      const response = await axios.post('/api/batches', { BatchName: batchName });

      if (response.status === 201) {
        navigate(-1); // Navigate to the previous page
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('Batch already exists.'); // Set error message for batch already existing
      } else {
        console.error('Error adding new batch:', error);
        setError('An unexpected error occurred.'); // Set error message for other errors
      }
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
        {error && (
          <div className="mb-4 flex items-center text-red-400">
            <IoAlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
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
