import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import axios from 'axios';
import { FaBook, FaArrowLeft } from 'react-icons/fa';

const CategoryNotesView = () => {
  const { category } = useParams(); // Get the category from the URL
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    // Log the category name from the URL
    console.log('Category from URL:', category);

    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/v4/category/notes');
        // Filter notes by the category from the URL
        const filteredNotes = response.data.filter((note) => note.Category === category);
        setNotes(filteredNotes);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notes. Please try again later.');
        setLoading(false);
      }
    };

    fetchNotes();
  }, [category]); // Add category as a dependency to refetch notes if the URL changes

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (notes.length === 0) {
    return <div className="text-center text-gray-500">No notes found for this category.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)} // Navigate to the previous page
          className="flex items-center text-white bg-gray-700 hover:bg-gray-600 transition duration-200 px-4 py-2 rounded-md"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Notes for Category: {category}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {notes.map((note) => (
          <Link
            key={note.NoteID}
            to={`/s/home/details/${note.BatchID}/notes/${note.NoteID}`}
            className="block"
          >
            <div className="bg-gray-800 shadow-md rounded-lg p-6 hover:bg-gray-700 transition duration-300 transform hover:scale-105">
              <div className="flex items-center mb-3">
                <FaBook className="text-blue-400 mr-3 text-2xl" />
                <h3 className="text-xl font-semibold text-white">{note.Title}</h3>
              </div>
              <p className="text-gray-300 line-clamp-2">
                {note.Content}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNotesView;
