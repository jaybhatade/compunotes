import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBook } from 'react-icons/fa';

const YtLinkNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numOfNotes, setNumOfNotes] = useState(12); // Default to 6 for larger screens

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 0) {
        setNumOfNotes(6); // Show 6 notes on mobile screens
      }
    };

    // Set the initial number of notes based on screen size
    handleResize();

    // Listen for window resize events to adjust the number of notes
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/v4/student-notes');
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

  // Helper function to extract YouTube video ID from the URL
  const getYouTubeID = (url) => {
    const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className=' py-4'>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {notes.slice(0, numOfNotes).map((note) => (
        <Link
          key={note.NoteID}
          to={`details/${note.BatchID}/notes/${note.NoteID}`}
          className="block"
        >
          <div className="bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
            {/* Skeleton loader for the YouTube embed link */}
            {loading && (
              <div className="aspect-w-16 aspect-h-9 bg-black animate-pulse rounded-lg mb-4"></div>
            )}

            {/* If the note contains a VideoLink, show the YouTube embed */}
            {!loading && note.VideoLink && getYouTubeID(note.VideoLink) && (
              <div className="">
                <iframe
                  className="w-full h-40 sm:h-48 md:h-64 lg:h-60 rounded-lg"
                  src={`https://www.youtube.com/embed/${getYouTubeID(note.VideoLink)}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="flex items-center mb-2 mt-4">
              <FaBook className="text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-white">{note.Title}</h3>
            </div>
            <p className="text-white line-clamp-2">{note.Content}</p>
          </div>
        </Link>
      ))}
    </div>
    </div>
  );
};

export default YtLinkNotes;
