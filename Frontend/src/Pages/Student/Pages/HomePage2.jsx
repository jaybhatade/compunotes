import React, { useEffect } from 'react';
import { HiSearch } from 'react-icons/hi';
import Header from '../../../Components/HeaderComp';
import CategoryLink from '../../../Components/CategoryLink';
import StudentNotesCard from '../Components/StudentNotesCard';

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
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Notes</h2>
            <a href="#" className="text-sm text-blue-400 transition-colors duration-200">View all</a>
          </div>
          <StudentNotesCard/>
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
