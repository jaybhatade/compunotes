import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from 'react-icons/fa';
import { FiLoader } from "react-icons/fi";

function BatchNote2() {
  const { batchId, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const response = await axios.get(`/api/notes/${noteId}`);
        if (response.data && response.data.NoteID) {
          setNote(response.data);
        } else {
          setError("Note not found");
        }
      } catch (error) {
        setError("Failed to load note details. Please try again later.");
      }
    };

    fetchNoteDetails();
  }, [noteId]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (error) {
    return (
      <div className="bg-gray-900 text-white p-4 rounded-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="bg-gray-900 text-white p-4 rounded-md">
        <FiLoader className="animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-4 pb-24">
      <div className="flex justify-between items-center">
        <div className="">
          <button
            onClick={() => navigate(-1)} // Navigate to the previous page
            className="flex items-center text-white bg-gray-700 hover:bg-gray-600 transition duration-200 px-4 py-2 rounded-md"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-white mb-4 mt-8">{note.Title}</h1>
      <div className="mb-4">
        <pre className="bg-gray-800 text-sm md:text-lg text-white overflow-x-auto p-4 rounded-md whitespace-pre-wrap">
          {note.Content}
        </pre>
      </div>

      {note.VideoLink === null && (
        <p className="text-red-500">No video link available.</p>
      )}

      {note.VideoLink && getYouTubeId(note.VideoLink) && (
        <div
          className="relative mb-4"
          style={{ paddingBottom: "56.25%", height: 0 }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeId(
              note.VideoLink
            )}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg"
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
  );
}

export default BatchNote2;
