import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBook } from 'react-icons/fa';

const StudentNotesCard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numOfNotes, setNumOfNotes] = useState(6); // Default to 6 for larger screens

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setNumOfNotes(3); // Show 3 notes on mobile screens
      } else {
        setNumOfNotes(6); // Show 6 notes on larger screens
      }
    };

    // Set the initial number of notes based on screen size
    handleResize();

    // Listen for window resize events to adjust number of notes
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/v3/student-notes');
        const sortedNotes = response.data.sort(
          (a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt)
        ); // Sort notes by creation date (newest first)
        setNotes(sortedNotes); // Store all notes but we'll only display based on screen size
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
      {notes.slice(0, numOfNotes).map((note) => (
        <Link
          key={note.NoteID}
          to={`details/${note.BatchID}/notes/${note.NoteID}`}
          className="block"
        >
          <div className="bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
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
