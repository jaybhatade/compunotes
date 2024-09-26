import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineChevronRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

// Category Link Component
const CategoryLink2 = ({ name }) => (
  <Link
    to={"categories"}
    className="shadow bg-gray-700 rounded-lg px-4 py-3 flex items-center justify-between transition-colors duration-200"
  >
    <div className="text-sm font-medium text-gray-200 transition-colors duration-200">{name}</div>
    <HiOutlineChevronRight className="text-gray-500 transition-colors duration-200" />
  </Link>
);

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories from the server
    axios
      .get('/api/v4/notes/categories') // Replace with your API endpoint
      .then((response) => {
        const uniqueCategories = [...new Set(response.data.map((note) => note.Category))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching categories');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-200">Loading categories...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ">
      {categories.map((category, index) => (
        <CategoryLink2 key={index} name={category} />
      ))}
    </div>
  );
};

export default CategoryList;
