import React, { useEffect } from 'react';
import { HiSearch } from 'react-icons/hi';
import Header from '../../../Components/HeaderComp';
import CategoryLink from '../../../Components/CategoryLink';
import StudentNotesCard from '../Components/StudentNotesCard';
import CategoryList from '../Components/CategoryLink2';
import { Link } from 'react-router-dom';
import YtLinkNotes from '../Components/YtLinkNotes';
import UserName from '../Components/UserName';

// Home Page
const HomePage2 = () => {

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

  return (
    <div className="flex flex-col min-h-screen h-fit  bg-gray-900 text-white transition-colors duration-200">
      <Header />
      <main className="flex-1 px-4 py-6 overflow-y-auto mt-14 pb-24">
        <section>
          <div>
            <UserName/>
          </div>
        </section>
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Notes</h2>
            <Link to={"all/notes"} className="text-sm text-blue-400 transition-colors duration-200">View all</Link>
          </div>
          <StudentNotesCard/>
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Note Categories</h2>
            <Link to={"all/categories"} className="text-sm text-blue-400 transition-colors duration-200">View all</Link>
          </div>
          <div className="">
            <CategoryList/>
          </div>
        </section>
        <section>
          <div className='pt-8'>
          <h2 className="text-xl font-semibold">All Notes</h2>
          <YtLinkNotes/>
          </div>
        </section>
     </main>
    </div>
  );
};

export default HomePage2;
