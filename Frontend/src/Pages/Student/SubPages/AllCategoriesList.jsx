import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { HiOutlineChevronRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const CategoryLink = ({ name }) => (
  <Link
    to={`/s/home/category/${name}`}
    className="group bg-gray-700 hover:bg-gray-600 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
  >
    <div className="p-4 flex items-center justify-between">
      <div className="text-lg font-semibold text-gray-100">{name}</div>
      <HiOutlineChevronRight className="text-gray-400" />
    </div>
  </Link>
);

const AllCategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/v4/notes/categories'); // Replace with your API endpoint
        const uniqueCategories = [...new Set(response.data.map((note) => note.Category))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        setError('Error fetching categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center bg-gray-900 pt-6 pb-2 mb-6 sticky top-0 z-[900] backdrop-blur-sm w-full px-6 shadow-lg shadow-gray-900">
        <button
          onClick={() => navigate(-1)} // Navigate to the previous page
          className="flex items-center text-white bg-gray-700 hover:bg-gray-600 transition duration-200 px-4 py-2 rounded-md"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-xl font-bold text-gray-100">All Categories</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-20 px-6">
        {categories.map((category, index) => (
          <CategoryLink key={index} name={category} />
        ))}
      </div>
    </div>
  );
};

export default AllCategoriesList;
