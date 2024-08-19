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
import NavigationBar1 from './Components/Navbar1';
import NavigationBar2 from './Components/Navbar2';

// Define the AdminLayout component
const AdminLayout = () => (
  <div>
    <NavigationBar1 />
    <main>
      <Outlet />
    </main>
  </div>
);

const StudentLayout = () => (
  <div>
    <NavigationBar2 />
    <main>
      <Outlet />
    </main>
  </div>
);

const MainLayout = () => (
  <div>
    <main>
      <Outlet />
    </main>
  </div>
);

const NonavLayout = () => (
  <div>
    {/* No Navigation Bar Here */}
    <main>
      <Outlet />
    </main>
  </div>
);

const BatchesLayout = () => (
  <div>
    <NavigationBar1 />
    <main>
      <Outlet />
    </main>
  </div>
);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <LoginPage /> },
      ],
    },
    {
      path: "a",
      element: <AdminLayout />,
      children: [
        { index: true, path: "home", element: <HomePage /> },
        { path: "add", element: <AddNotesPage /> },
        { path: "database", element: <DatabasePage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "users", element: <ManageUser /> },
        {
          path: "batches",
          element: <BatchesLayout />, // BatchesPage with Navbar
          children: [
            { index: true, element: <BatchesPage /> },
            {
              path: "",
              element: <NonavLayout />, // Child routes without Navbar
              children: [
                { path: "new", element: <NewBatch /> },
                { path: "details/:batchId", element: <BatchDetails /> },
                { path: "details/:batchId/notes/:noteId", element: <BatchNote /> },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "s",
      element: <StudentLayout />,
      children: [
        { index: true, path: "home", element: <HomePage /> },
        { path: "add", element: <AddNotesPage /> },
        { path: "database", element: <DatabasePage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "users", element: <ManageUser /> },
        {
          path: "batches",
          element: <BatchesLayout />, // BatchesPage with Navbar
          children: [
            { index: true, element: <BatchesPage /> },
            {
              path: "",
              element: <NonavLayout />, // Child routes without Navbar
              children: [
                { path: "new", element: <NewBatch /> },
                { path: "details/:batchId", element: <BatchDetails /> },
                { path: ":batchId/notes/:noteId", element: <BatchNote /> },
              ],
            },
          ],
        },
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
