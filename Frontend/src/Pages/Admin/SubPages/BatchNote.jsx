import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BatchNote() {
  const { batchId, noteId } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatchNote = async () => {
      try {
        const response = await axios.get(`/api/batches/${batchId}/notes/${noteId}`);
        setNote(response.data);
      } catch (error) {
        console.error('Error fetching note details:', error);
        setError('Failed to load note details. Please try again later.');
      }
    };

    fetchBatchNote();
  }, [batchId, noteId]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!note) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">{note.Title}</h1>
      <p className="text-gray-400">{note.Content}</p>
    </div>
  );
}

export default BatchNote;
