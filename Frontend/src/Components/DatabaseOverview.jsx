import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DatabaseOverview = () => {
  const [topics, setTopics] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [noteTags, setNoteTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topicsRes, notesRes, tagsRes, noteTagsRes] = await Promise.all([
        axios.get('/api/topics'),
        axios.get('/api/notes'),
        axios.get('/api/tags'),
        axios.get('/api/note-tags'),
      ]);

      setTopics(topicsRes.data);
      setNotes(notesRes.data);
      setTags(tagsRes.data);
      setNoteTags(noteTagsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching data. Please try again later.');
      setLoading(false);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`/api/notes/${noteId}`);
      setNotes(notes.filter(note => note.NoteID !== noteId));
    } catch (err) {
      setError('Error deleting note. Please try again later.');
    }
  };

  if (loading) return <div className="text-center p-4 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="container mx-auto p-4 h-screen w-full bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white">Database Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Topics</h2>
          <ul className="divide-y divide-gray-700">
            {topics.map((topic) => (
              <li key={topic.TopicID} className="py-2">
                <h3 className="font-medium text-gray-300">{topic.TopicName}</h3>
                <p className="text-sm text-gray-400">{topic.Description}</p>
                <p className="text-xs text-gray-500">
                  Created: {new Date(topic.CreatedAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-800 shadow rounded-lg p-6">
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

        <div className="bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Tags</h2>
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag.TagID} className="bg-gray-700 rounded-full px-3 py-1 text-sm text-gray-300">
                {tag.TagName}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Note Tags</h2>
          <ul className="divide-y divide-gray-700">
            {noteTags.map((noteTag) => (
              <li key={`${noteTag.NoteID}-${noteTag.TagID}`} className="py-2">
                <p className="text-gray-300">Note ID: {noteTag.NoteID}</p>
                <p className="text-gray-300">Tag ID: {noteTag.TagID}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DatabaseOverview;
