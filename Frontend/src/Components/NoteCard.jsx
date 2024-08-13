import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NoteCard = ({ id }) => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`/api/notes/${id}`);
        setNote(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!note) return null;

  const formattedDate = new Date(note.CreatedAt).toLocaleDateString();

  return (
    <Link to={`/note/${note.NoteID}`} className="block">
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-600">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">{note.Title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">{formattedDate}</div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 transition-colors duration-200">{note.Content}</p>
      </div>
    </Link>
  );
};

export default NoteCard;