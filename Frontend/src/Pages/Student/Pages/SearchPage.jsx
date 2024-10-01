import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SearchStudentNotes = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/v3/student-notes');
        setNotes(response.data);
        setFilteredNotes(response.data); // Show all notes initially
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notes. Please try again later.');
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Filter notes based on the search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredNotes(notes); // Show all notes if the search query is empty
    } else {
      const filtered = notes.filter((note) =>
        note.Title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center pt-6 mb-4 px-4 sticky top-0 z-[9999] bg-gray-900 shadow-lg shadow-gray-900">
        <h1 className="text-xl font-bold mb-4">Search Notes</h1>
        <div className="relative w-full max-w-md mb-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20 px-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center text-gray-400 col-span-full">No notes found</div>
        ) : (
          filteredNotes.map((note) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default SearchStudentNotes;
