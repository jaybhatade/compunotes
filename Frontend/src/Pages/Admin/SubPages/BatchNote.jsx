import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineArrowLeft, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { FiLoader } from 'react-icons/fi';

function BatchNote() {
  const { batchId, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const response = await axios.get(`/api/notes/${noteId}`);
        if (response.data && response.data.NoteID) {
          setNote(response.data);
        } else {
          setError('Note not found');
        }
      } catch (error) {
        setError('Failed to load note details. Please try again later.');
      }
    };

    fetchNoteDetails();
  }, [noteId]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleEdit = () => {
    // Implement edit functionality
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`/api/notes/${noteId}`);
        navigate(`/batches/${batchId}`);
      } catch (error) {
        setError('Failed to delete note. Please try again later.');
      }
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-gray-500 text-3xl" />
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleBack} className="text-blue-600 flex items-center hover:text-blue-800 transition duration-200">
          <AiOutlineArrowLeft className="mr-1" /> Back
        </button>
        <div className="flex space-x-4">
          <button
            onClick={handleEdit}
            className="text-yellow-600 flex items-center hover:text-yellow-800 transition duration-200"
          >
            <AiOutlineEdit className="mr-1" /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 flex items-center hover:text-red-800 transition duration-200"
          >
            <AiOutlineDelete className="mr-1" /> Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-4">{note.Title}</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{note.Content}</p>
      </div>
    </div>
  );
}

export default BatchNote;
