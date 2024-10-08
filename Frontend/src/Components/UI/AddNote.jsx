import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NotesForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoLink: '',
    category: '',
    batchId: ''
  });

  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get('/api/batches');
        setBatches(response.data);
      } catch (error) {
        console.error('Error fetching batches:', error);
      }
    };

    fetchBatches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/notes', formData);
      alert('Note added successfully!');
      setFormData({ title: '', content: '', videoLink: '', category: '', batchId: '' }); // Reset form
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Error adding note. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 pb-20">
      <div className="sticky top-0 z-10 bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-100">Add New Note</h1>
        </div>
      </div>
      <div className="flex-1 px-4 py-6 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a title"
              className="block w-full h-10 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-300">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter your notes"
              className="block w-full h-40 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="videoLink" className="block text-sm font-medium text-gray-300">
              Video Link
            </label>
            <input
              id="videoLink"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleChange}
              placeholder="Enter a video link (optional)"
              className="block w-full h-10 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">
              Category
            </label>
            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter a category"
              className="block w-full h-10 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="batchId" className="block text-sm font-medium text-gray-300">
              Batch
            </label>
            <select
              id="batchId"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              className="block w-full h-10 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select a batch</option>
              {batches.map(batch => (
                <option key={batch.BatchID} value={batch.BatchID}>
                  {batch.BatchName}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Add Note
          </button>
        </form>
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-100">Preview</h2>
          <div className="mt-4 p-4 border border-gray-600 rounded-md bg-gray-800">
            <h3 className="text-md font-semibold text-gray-100">{formData.title}</h3>
            <pre className="mt-2 whitespace-pre-wrap text-gray-100">{formData.content}</pre>
            {formData.videoLink && (
              <div className="mt-2">
                <a
                  href={formData.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Watch Video
                </a>
              </div>
            )}
            <p className="mt-2 text-sm text-gray-400">Category: {formData.category}</p>
            <p className="mt-1 text-sm text-gray-400">
              Batch: {batches.find(b => b.BatchID === parseInt(formData.batchId))?.BatchName || 'Not selected'}
            </p>
          </div>
        </div>
      </div>

      

    </div>
  );
}