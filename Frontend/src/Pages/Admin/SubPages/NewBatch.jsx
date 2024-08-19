import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoAlertCircle, IoPencil, IoTrash, IoAdd } from 'react-icons/io5';

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [newBatchName, setNewBatchName] = useState('');
  const [editingBatch, setEditingBatch] = useState(null);
  const [error, setError] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);

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
    if (batch && batch.BatchID) {
      setEditingBatch(batch);
      setNewBatchName(batch.BatchName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError('Cannot edit batch: Invalid batch data.');
    }
  };

  const handleDelete = (batch) => {
    if (batch && batch.BatchID) {
      setBatchToDelete(batch);
      setShowConfirmDelete(true);
    } else {
      setError('Cannot delete batch: Invalid batch data.');
    }
  };

  const confirmDelete = async () => {
    if (batchToDelete && batchToDelete.BatchID) {
      try {
        await axios.delete(`/api/delete-batch/${batchToDelete.BatchID}`);
        fetchBatches();
        setBatchToDelete(null);
        setShowConfirmDelete(false);
      } catch (error) {
        setError('Failed to delete batch.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Batch Management</h1>

        <form onSubmit={handleSubmit} className="mb-8 bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4 flex-wrap md:flex-nowrap gap-4">
            <input
              type="text"
              value={newBatchName}
              onChange={(e) => setNewBatchName(e.target.value)}
              className="flex-grow p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={editingBatch ? "Edit batch name" : "Enter new batch name"}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 w-full md:w-auto bg-blue-600 rounded-lg hover:bg-blue-700 flex justify-center items-center md:justify-start"
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

        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete this batch?</p>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Batch Name</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.BatchID} className="border-t border-gray-700">
                  <td className="px-6 py-4">{batch.BatchName}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(batch)}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      <IoPencil />
                    </button>
                    <button
                      onClick={() => handleDelete(batch)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <IoTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;
