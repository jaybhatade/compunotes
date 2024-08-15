import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NoteView = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/notes');
        console.log('Fetched notes:', response.data); // Log the entire response data
        setNotes(response.data);

        // Log each note to ensure VideoLink is being fetched correctly
        response.data.forEach((note) => {
          console.log(`Note ID: ${note.NoteID}, VideoLink: ${note.VideoLink}`);
        });
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-white mb-8">My Notes</h1>
      <div className="grid grid-cols-1 gap-6">
        {notes.map((note) => (
          <div key={note.NoteID} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">{note.Title}</h2>
              <pre className="text-gray-400 whitespace-pre-wrap">{note.Content}</pre>
              <br/>
              {note.VideoLink === null && (
                <p className="text-red-500">No video link available.</p> // Inform the user if VideoLink is null
              )}
              {note.VideoLink && getYouTubeId(note.VideoLink) && (
                <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(note.VideoLink)}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full lg:w-[100%] md:pl-14 md:pr-14"
                  ></iframe>
                </div>
              )}
              <p className="text-gray-500 text-sm mt-4">
                Created: {new Date(note.CreatedAt).toLocaleString()}
              </p>
              {note.UpdatedAt && (
                <p className="text-gray-500 text-sm">
                  Updated: {new Date(note.UpdatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteView;
