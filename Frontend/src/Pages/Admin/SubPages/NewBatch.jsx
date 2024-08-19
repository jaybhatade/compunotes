import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoAlertCircle, IoPencil, IoTrash, IoAdd, IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [newBatchName, setNewBatchName] = useState('');
  const [editingBatch, setEditingBatch] = useState(null);
  const [error, setError] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('/api/get-batches');
      setBatches(response.data);
    } catch (error) {
      setError('Failed to fetch batches.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingBatch) {
        await axios.put(`/api/update-batch/${editingBatch.BatchID}`, { BatchName: newBatchName });
      } else {
        await axios.post('/api/create-batch', { BatchName: newBatchName });
      }
      fetchBatches();
      setNewBatchName('');
      setEditingBatch(null);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('Batch already exists.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setNewBatchName(batch.BatchName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (batch) => {
    setBatchToDelete(batch);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/delete-batch/${batchToDelete.BatchID}`);
      fetchBatches();
      setBatchToDelete(null);
      setShowConfirmDelete(false);
    } catch (error) {
      setError('Failed to delete batch.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-400 p-2 rounded-lg transition-colors"
          >
            <IoArrowBack className="mr-2 text-xl" />
            <span className="inline">Back</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center">Batch Management</h1>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <input
              type="text"
              value={newBatchName}
              onChange={(e) => setNewBatchName(e.target.value)}
              className="flex-grow p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder={editingBatch ? "Edit batch name" : "Enter new batch name"}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 w-full md:w-auto bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center"
            >
              <IoAdd className="mr-2" />
              {editingBatch ? 'Update' : 'Add'} Batch
            </button>
          </div>
          {error && (
            <div className="mt-2 flex items-center text-red-400">
              <IoAlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
          )}
        </form>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Batch Name</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.BatchID} className="border-t border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4">{batch.BatchName}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(batch)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <IoPencil />
                    </button>
                    <button
                      onClick={() => handleDelete(batch)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <IoTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center space-y-4">
              <h2 className="text-lg font-semibold">Confirm Delete</h2>
              <p>Are you sure you want to delete this batch?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchManagement;
