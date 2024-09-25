import {HiOutlineChevronRight } from 'react-icons/hi';

// Category Link Component
const CategoryLink = ({ name }) => (
    <a href="#" className=" shadow bg-gray-700 rounded-lg px-4 py-3 flex items-center justify-between transition-colors duration-200">
      <div className="text-sm font-medium :text-gray-200 transition-colors duration-200">{name}</div>
      <HiOutlineChevronRight className="text-gray-500 transition-colors duration-200" />
    </a>
  );

  export default CategoryLink