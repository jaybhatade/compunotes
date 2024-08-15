import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NavigationBar from "../../Components/Navbar";
import HomePage from "../Admin/pages/HomePage";
import ProfilePage from "../Admin/pages/ProfilePage";
import AddNotesPage from '../Admin/pages/AddNotesPage';
import BatchesPage from '../Admin/pages/BatchesPage';
import DatabasePage from '../Admin/pages/DatabasePage';


// Define the MainLayout component
const MainLayout = () => {
  return (
    <div>
      <NavigationBar />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

function Admin() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "add", element: <AddNotesPage /> },
        // { path: "search", element: <SearchPage /> },
        { path: "database", element: <DatabasePage /> },
        { path: "batches", element: <BatchesPage/> },
        { path: "profile", element: <ProfilePage /> },
      ],
    },
  ]);
  

  return (
    <div className=' bg-gray-900'>
    <RouterProvider router={router}/>
    </div>
  );
}

export default Admin;