import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from './home';
import HomePage from './Pages/Admin/pages/HomePage';
import ProfilePage from './Pages/Admin/pages/ProfilePage';
import AddNotesPage from './Pages/Admin/pages/AddNotesPage';
import BatchesPage from './Pages/Admin/pages/BatchesPage';
import DatabasePage from './Pages/Admin/pages/DatabasePage';
import NewBatch from './Pages/Admin/SubPages/NewBatch';
import BatchDetails from './Components/Batch';
import BatchNote from './Pages/Admin/SubPages/BatchNote';
import ManageUser from './Pages/Admin/SubPages/ManageUser';
import LoginPage from './Pages/Auth/Login';
import NavigationBar from './Components/Navbar';

// Define the AdminLayout component
const AdminLayout = () => {
  return (
    <div>
      <NavigationBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const MainLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <LoginPage /> },
        { path: "a", element: <AdminLayout />, children: [
        { index: true, path: "home", element: <HomePage /> },
          { path: "add", element: <AddNotesPage /> },
          { path: "database", element: <DatabasePage /> },
          { path: "batches", element: <BatchesPage /> },
          { path: "batches/new", element: <NewBatch /> },
          { path: "batches/details/:batchId", element: <BatchDetails /> },
          { path: "batches/:batchId/notes/:noteId", element: <BatchNote /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "users", element: <ManageUser /> },
        ]},
      ],
    },
  ]);

  return (
    <div className='bg-gray-900 min-h-screen'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
