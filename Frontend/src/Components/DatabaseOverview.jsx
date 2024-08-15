import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DatabaseOverview = () => {
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesResponse, usersResponse, batchesResponse] = await Promise.all([
          axios.get('/api/notes'),
          axios.get('/api/users'),
          axios.get('/api/batches')
        ]);
        setNotes(notesResponse.data);
        setUsers(usersResponse.data);
        setBatches(batchesResponse.data);
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
      await axios.delete(`/api/notes/${noteId}`);
      setNotes(prevNotes => prevNotes.filter(note => note.NoteID !== noteId));
    } catch (err) {
      setError('Error deleting note. Please try again later.');
    }
  };

  if (loading) return <div className="text-center p-4 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="container mx-auto p-4 h-screen w-full bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white">Database Overview</h1>
      
      {/* Notes Section */}
      <div className="bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Notes</h2>
        <ul className="divide-y divide-gray-700">
          {notes.map((note) => (
            <li key={note.NoteID} className="py-2 flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-300">{note.Title}</h3>
                <p className="text-sm text-gray-400">{note.Content.substring(0, 100)}...</p>
                {note.VideoLink && (
                  <a href={note.VideoLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                    Video Link
                  </a>
                )}
                <p className="text-xs text-gray-500">
                  Category: {note.Category} | Batch ID: {note.BatchID}
                </p>
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

      {/* Users Section */}
      <div className="bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Users</h2>
        <ul className="divide-y divide-gray-700">
          {users.map((user) => (
            <li key={user.UserID} className="py-2">
              <h3 className="font-medium text-gray-300">{user.Username}</h3>
              <p className="text-sm text-gray-400">{user.FirstName} {user.LastName}</p>
              <p className="text-xs text-gray-500">Role: {user.Role}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Batches Section */}
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">Batches</h2>
        <ul className="divide-y divide-gray-700">
          {batches.map((batch) => (
            <li key={batch.BatchID} className="py-2">
              <h3 className="font-medium text-gray-300">{batch.BatchName}</h3>
              <p className="text-xs text-gray-500">
                Created: {new Date(batch.CreatedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DatabaseOverview;