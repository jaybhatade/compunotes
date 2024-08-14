import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DatabaseOverview = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/notes');
        setNotes(response.data);
      } catch (err) {
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteNote = async (noteId) => {
    try {
      console.log(`Attempting to delete note with ID: ${noteId}`);
      const response = await axios.delete(`/api/notes/${noteId}`);
      console.log('Delete response:', response);

      // Update the notes list by filtering out the deleted note
      setNotes(prevNotes => prevNotes.filter(note => note.NoteID !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Error deleting note. Please try again later.');
    }
  };

  if (loading) return <div className="text-center p-4 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="container mx-auto p-4 h-screen w-full bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white">Database Overview</h1>
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Notes</h2>
        <ul className="divide-y divide-gray-700">
          {notes.map((note) => (
            <li key={note.NoteID} className="py-2 flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-300">{note.Title}</h3>
                <p className="text-sm text-gray-400">{note.Content.substring(0, 100)}...</p>
                {note.VideoLink && (
                  <a 
                    href={note.VideoLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:underline text-sm"
                  >
                    Video Link
                  </a>
                )}
                <p className="text-xs text-gray-500">
                  Created: {new Date(note.CreatedAt).toLocaleString()}
                  {note.UpdatedAt && ` | Updated: ${new Date(note.UpdatedAt).toLocaleString()}`}
                </p>
              </div>
              <button
                onClick={() => deleteNote(note.NoteID)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DatabaseOverview;
