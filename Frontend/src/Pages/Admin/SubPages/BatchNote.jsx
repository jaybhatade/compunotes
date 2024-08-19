import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineArrowLeft, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { FiLoader } from 'react-icons/fi';

function BatchNote() {
  const { batchId, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedVideoLink, setEditedVideoLink] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedBatchId, setEditedBatchId] = useState('');

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const response = await axios.get(`/api/notes/${noteId}`);
        if (response.data && response.data.NoteID) {
          setNote(response.data);
          setEditedTitle(response.data.Title || '');
          setEditedContent(response.data.Content || '');
          setEditedVideoLink(response.data.VideoLink || '');
          setEditedCategory(response.data.Category || '');
          setEditedBatchId(response.data.BatchID || '');
        } else {
          setError('Note not found');
        }
      } catch (error) {
        setError('Failed to load note details. Please try again later.');
      }
    };

    fetchNoteDetails();
  }, [noteId]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedNote = {
        Title: editedTitle,
        Content: editedContent,
        VideoLink: editedVideoLink,
        Category: editedCategory,
        BatchID: editedBatchId,
      };
      const response = await axios.put(`/api/notes/${noteId}`, updatedNote);

      if (response.status === 200) {
        setNote({
          ...note,
          Title: editedTitle,
          Content: editedContent,
          VideoLink: editedVideoLink,
          Category: editedCategory,
          BatchID: editedBatchId,
        });
        setIsEditing(false);
      } else {
        setError('Failed to update note. Please try again later.');
      }
    } catch (error) {
      setError('Failed to update note. Please try again later.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/notes/${noteId}`);
      navigate(-1);
    } catch (error) {
      setError('Failed to delete note. Please try again later.');
    }
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
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
      <div className="flex justify-between items-center mb-4">
        <button onClick={handleBack} className="text-gray-400 hover:text-white flex items-center">
          <AiOutlineArrowLeft className="mr-2" /> Back
        </button>
        <div className="flex space-x-4">
          {/* <button onClick={handleEditToggle} className="text-gray-400 hover:text-white flex items-center">
            <AiOutlineEdit className="mr-2" /> {isEditing ? 'Cancel' : 'Edit'}
          </button> */}
          <button
            onClick={() => setShowDeletePopup(true)}
            className="text-gray-400 hover:text-red-500 flex items-center"
          >
            <AiOutlineDelete className="mr-2" /> Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="mb-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 mb-4 rounded-md"
            placeholder="Enter title"
            required
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 mb-4 rounded-md"
            placeholder="Enter content"
            rows="10"
            required
          />
          <input
            type="text"
            value={editedVideoLink}
            onChange={(e) => setEditedVideoLink(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 mb-4 rounded-md"
            placeholder="Enter YouTube video link"
          />
          <input
            type="text"
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 mb-4 rounded-md"
            placeholder="Enter category"
          />
          <input
            type="text"
            value={editedBatchId}
            onChange={(e) => setEditedBatchId(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 mb-4 rounded-md"
            placeholder="Enter batch ID"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
            Save Changes
          </button>
        </form>
      ) : (
        <>
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
            <div className="relative mb-4" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(note.VideoLink)}`}
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
        </>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center px-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchNote;
