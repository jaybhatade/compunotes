import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { IoAlertCircle, IoPencil, IoTrash, IoAdd, IoArrowBack, IoPersonAdd, IoPersonRemove, IoClose } from 'react-icons/io5';

const BatchManagement = () => {
  const { BatchID } = useParams();
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [newBatchName, setNewBatchName] = useState('');
  const [editingBatch, setEditingBatch] = useState(null);
  const [error, setError] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(BatchID || '');
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [showMemberManagement, setShowMemberManagement] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmRemoveStudent, setShowConfirmRemoveStudent] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchStudentsInBatch();
      fetchAvailableStudents();
    }
  }, [selectedBatch]);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('/api/v1/batches/get-all-batches');
      setBatches(response.data);
    } catch (error) {
      setError('Failed to fetch batches. Please try again later.');
    }
  };

  const fetchStudentsInBatch = async () => {
    try {
      const response = await axios.get(`/api/v1/batches/${selectedBatch}/get-batch-students`);
      setStudents(response.data);
    } catch (error) {
      setError('Error fetching students in batch. Please try again.');
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const response = await axios.get('/api/v1/users/get-all-students');
      setAvailableStudents(response.data);
    } catch (error) {
      setError('Error fetching available students. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      if (editingBatch) {
        await axios.put(`/api/update-batch/${editingBatch.BatchID}`, { BatchName: newBatchName });
        setSuccessMessage('Batch updated successfully!');
      } else {
        await axios.post('/api/create-batch', { BatchName: newBatchName });
        setSuccessMessage('New batch created successfully!');
      }
      fetchBatches();
      setNewBatchName('');
      setEditingBatch(null);
    } catch (error) {
      if (error.response?.status === 409) {
        setError('A batch with this name already exists. Please choose a different name.');
      } else {
        setError('An unexpected error occurred. Please try again.');
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
      setSuccessMessage('Batch deleted successfully!');
    } catch (error) {
      setError('Failed to delete batch. Please try again.');
    }
  };

  const handleAddStudent = async () => {
    setError('');
    setSuccessMessage('');
    try {
      if (selectedStudent) {
        await axios.post(`/api/v1/batches/${selectedBatch}/add-student-to-batch`, { UserID: selectedStudent });
        fetchStudentsInBatch();
        setSelectedStudent('');
        setSuccessMessage('Student added to batch successfully!');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError('This student is already in the batch.');
      } else {
        setError('Error adding student to batch. Please try again.');
      }
    }
  };

  const handleRemoveStudent = (student) => {
    setStudentToRemove(student);
    setShowConfirmRemoveStudent(true);
  };

  const confirmRemoveStudent = async () => {
    setError('');
    setSuccessMessage('');
    try {
      await axios.delete(`/api/v1/batches/${selectedBatch}/remove-student-from-batch/${studentToRemove.UserID}`);
      fetchStudentsInBatch();
      setSuccessMessage('Student removed from batch successfully!');
      setShowConfirmRemoveStudent(false);
    } catch (error) {
      setError('Error removing student from batch. Please try again.');
    }
  };

  const getSelectedBatchName = () => {
    const batch = batches.find(b => b.BatchID === selectedBatch);
    return batch ? batch.BatchName : '';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 mb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-between text-white hover:text-gray-400 p-2 rounded-lg transition-colors transform hover:scale-105"
          >
            <IoArrowBack className="mr-2 text-xl" />
            <span className="hidden lg:inline">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-right md:text-center">Batch Management</h1>
          
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4 transform transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <input
              type="text"
              value={newBatchName}
              onChange={(e) => setNewBatchName(e.target.value)}
              className="flex-grow p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              placeholder={editingBatch ? "Edit batch name" : "Enter new batch name"}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 w-full md:w-auto bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center transform hover:scale-105"
            >
              <IoAdd className="mr-2" />
              {editingBatch ? 'Update' : 'Add'} Batch
            </button>
          </div>
          {error && (
            <div className="mt-2 flex items-center text-red-400 bg-red-100 p-3 rounded-lg animate-pulse">
              <IoAlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="mt-2 flex items-center text-green-400 bg-green-100 p-3 rounded-lg animate-pulse">
              <IoAlertCircle className="mr-2" />
              <span>{successMessage}</span>
            </div>
          )}
        </form>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:shadow-lg">
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
                      onClick={() => {
                        setSelectedBatch(batch.BatchID);
                        setShowMemberManagement(true);
                      }}
                      className="text-green-400 hover:text-green-300 transition-colors transform hover:scale-110"
                    >
                      <IoPersonAdd />
                    </button>
                    <button
                      onClick={() => handleEdit(batch)}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors transform hover:scale-110"
                    >
                      <IoPencil />
                    </button>
                    <button
                      onClick={() => handleDelete(batch)}
                      className="text-red-400 hover:text-red-300 transition-colors transform hover:scale-110"
                    >
                      <IoTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showMemberManagement && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-6 transform transition-all duration-300 hover:shadow-lg mb-36">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Manage Members - {getSelectedBatchName()}</h2>
              <button
                onClick={() => setShowMemberManagement(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="flex-grow p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <option value="">Select Student</option>
                {availableStudents.map(student => (
                  <option key={student.UserID} value={student.UserID}>
                    {student.FirstName} {student.LastName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddStudent}
                className="px-6 py-3 w-full md:w-auto bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex justify-center items-center transform hover:scale-105"
              >
                <IoPersonAdd className="mr-2" />
                Add Student
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Students in Batch</h3>
              <ul className="space-y-2">
                {students.map(student => (
                  <li key={student.UserID} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg transition-all duration-300 hover:bg-gray-650">
                    <span>{student.FirstName} {student.LastName}</span>
                    <button
                      onClick={() => handleRemoveStudent(student)}
                      className="text-red-400 hover:text-red-300 transition-colors transform hover:scale-110"
                    >
                      <IoPersonRemove />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 animate-fadeIn">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4 animate-scaleIn">
              <h2 className="text-lg font-semibold">Confirm Delete</h2>
              <p>Are you sure you want to delete this batch? 
                This action cannot be undone, all the notes related to batch will be deleted</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmRemoveStudent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 animate-fadeIn">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4 animate-scaleIn">
              <h2 className="text-lg font-semibold">Confirm Remove Student</h2>
              <p>Are you sure you want to remove {studentToRemove?.FirstName} {studentToRemove?.LastName} from this batch?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirmRemoveStudent(false)}
                  className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveStudent}
                  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors transform hover:scale-105"
                >
                  Remove
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