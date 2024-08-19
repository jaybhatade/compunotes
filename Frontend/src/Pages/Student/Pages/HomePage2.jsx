import React, { useEffect } from 'react';
import { HiSearch } from 'react-icons/hi';
import Header from '../../../Components/HeaderComp';
import CategoryLink from '../../../Components/CategoryLink';

// Home Page
const HomePage2 = () => {

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

  return (
    <div className="flex flex-col min-h-screen h-[200vh] bg-gray-900 text-white transition-colors duration-200">
      <Header />
      <main className="flex-1 px-4 py-6 overflow-y-auto mt-14">
        <div className="relative mb-6">
          <input 
            type="search" 
            placeholder="Search notes..." 
            className="pl-8 w-full rounded-lg bg-gray-700 p-2 border-gray-600 border-2 text-white placeholder-gray-400 transition-colors duration-200" 
          />
          <HiSearch className="absolute left-2.5 top-3.5 text-gray-500 transition-colors duration-200" />
        </div>  
        
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Notes</h2>
            <a href="#" className="text-sm text-blue-400 transition-colors duration-200">View all</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
          </div>
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Note Categories</h2>
            <a href="#" className="text-sm text-blue-400 transition-colors duration-200">View all</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <CategoryLink name="React" />
            <CategoryLink name="Java" />
            <CategoryLink name="Tailwind CSS" />
            <CategoryLink name="JavaScript" />
          </div>
        </section>

     </main>
    </div>
  );
};

export default HomePage2;
