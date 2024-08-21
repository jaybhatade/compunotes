import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';

const BatchManagement = () => {
  const { BatchID } = useParams();
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    fetchBatches();
    fetchStudentsInBatch();
    fetchAvailableStudents();
  }, [BatchID]);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('/api/v1/batches');
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchStudentsInBatch = async () => {
    try {
      const response = await axios.get(`/api/v1/batches/${BatchID}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students in batch:', error);
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const response = await axios.get('/api/v1/users/students');
      setAvailableStudents(response.data);
    } catch (error) {
      console.error('Error fetching available students:', error);
    }
  };

  const handleAddStudent = async () => {
    try {
      if (selectedStudent) {
        await axios.post(`/api/v1/batches/${BatchID}/add-student`, { UserID: selectedStudent });
        fetchStudentsInBatch();
      }
    } catch (error) {
      console.error('Error adding student to batch:', error);
    }
  };

  const handleRemoveStudent = async (UserID) => {
    try {
      await axios.delete(`/api/v1/batches/${BatchID}/remove-student/${UserID}`);
      fetchStudentsInBatch();
    } catch (error) {
      console.error('Error removing student from batch:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Batch Management</h1>
        <select
          value={BatchID}
          onChange={(e) => navigate(`/batches/${e.target.value}`)}
          className="mt-2 p-2 bg-gray-700 border border-gray-600 rounded"
        >
          {batches.map(batch => (
            <option key={batch.BatchID} value={batch.BatchID}>
              {batch.BatchName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Students in Batch</h2>
        <ul className="mt-2">
          {students.map(student => (
            <li key={student.UserID} className="flex justify-between items-center mb-2">
              {student.FirstName} {student.LastName}
              <button
                onClick={() => handleRemoveStudent(student.UserID)}
                className="p-2 bg-red-600 rounded hover:bg-red-700"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Add Student to Batch</h2>
        <div className="flex items-center mt-2">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="p-2 bg-gray-700 border border-gray-600 rounded mr-2"
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
            className="p-2 bg-green-600 rounded hover:bg-green-700"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchManagement;
