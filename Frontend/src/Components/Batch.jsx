import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {FaArrowLeft} from 'react-icons/fa'
import { AiOutlineFileText } from 'react-icons/ai';

function BatchDetails() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const response = await axios.get(`/api/batches/details/${batchId}`);
        if (response.data.batch) {
          setBatch(response.data.batch);
          setNotes(response.data.notes || []);
        } else {
          setError('Batch not found');
        }
      } catch (error) {
        console.error('Error fetching batch details:', error);
        setError('Failed to load batch details. Please try again later.');
      }
    };

    fetchBatchDetails();
  }, [batchId]);

  const handleNoteClick = (noteId) => {
    navigate(`notes/${noteId}`);
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!batch) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="flex items-center mb-6">
      <button
            onClick={() => navigate(-1)} // Navigate to the previous page
            className="flex items-center text-white bg-gray-700 hover:bg-gray-600 transition duration-200 px-4 py-2 rounded-md"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
      </div>

      <h1 className="text-2xl md:text-4xl font-bold mb-6">{batch.BatchName}</h1>

      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.NoteID}
              className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-transform transform hover:scale-[1.01]"
              onClick={() => handleNoteClick(note.NoteID)}
            >
              <div className="flex items-center mb-2">
                <AiOutlineFileText className="text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold">{note.Title}</h2>
              </div>
              <p className="text-gray-400">{note.Content.split('\n').slice(0, 2).join(' ')}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No notes available</div>
        )}
      </div>
    </div>
  );
}

export default BatchDetails;
