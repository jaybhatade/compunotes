import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBook } from 'react-icons/fa';

const StudentNotesCard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {notes.map((note) => (
        <Link
          key={note.NoteID}
          to={`/details/${note.BatchID}/notes/${note.NoteID}`}
          className="block"
        >
          <div className="bg-gray-700 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <FaBook className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">{note.Title}</h3>
            </div>
            <p className="text-white line-clamp-1">{note.Content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default StudentNotesCard;