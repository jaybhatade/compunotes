import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBook, FaArrowLeft } from 'react-icons/fa';


const AllStudentNotesCard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/v3/student-notes');
        setNotes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notes. Please try again later.');
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen w-screen  bg-gray-900 text-white ">
      <div className="flex justify-between items-center bg-gray-900 pt-6 pb-4 mb-2 sticky top-0 z-[900] backdrop-blur-sm w-full px-6">
      <button
          onClick={() => navigate(-1)} // Navigate to the previous page
          className="flex items-center text-white bg-gray-800 hover:bg-gray-600 transition duration-200 px-4 py-2 rounded-md"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-xl font-bold text-gray-100">All Student Notes</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20 px-6">
        {notes.map((note) => (
          <div 
            key={note.NoteID} 
            className="group bg-gray-800 hover:bg-gray-700 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            onClick={() => navigate(`/s/home/details/${note.BatchID}/notes/${note.NoteID}`)}
          >
            <div className="p-4">
              <div className="flex items-center mb-3">
                <FaBook className="text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold">{note.Title}</h3>
              </div>
              <p className="text-gray-300 line-clamp-2">{note.Content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllStudentNotesCard;
