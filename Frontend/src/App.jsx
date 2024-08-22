import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
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
import HomePage2 from './Pages/Student/Pages/HomePage2';
import BatchesPage2 from './Pages/Student/Pages/BatchesPage2';
import SearchPage from './Pages/Student/Pages/SearchPage';
import NotesPage from './Pages/Student/Pages/NotesPage';
import ProfilePage2 from './Pages/Student/Pages/ProfilePage2';
import ManageMembers from './Pages/Admin/SubPages/ManageMembers';

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
    <main>
      <Outlet />
    </main>
  </div>
);

// Authenticated Route Component
const ProtectedRoute = ({ element, roles }) => {
  const userRole = sessionStorage.getItem('userRole');
  if (!userRole) {
    return <Navigate to="/login" />;
  }
  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  return element;
};

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
        { index: true, path: "home", element: <ProtectedRoute element={<HomePage />} roles={['admin', 'teacher']} /> },
        { path: "add", element: <ProtectedRoute element={<AddNotesPage />} roles={['admin', 'teacher']} /> },
        { path: "database", element: <ProtectedRoute element={<DatabasePage />} roles={['admin']} /> },
        { path: "profile", element: <ProtectedRoute element={<ProfilePage />} roles={['admin', 'teacher']} /> },
        { path: "users", element: <ProtectedRoute element={<ManageUser />} roles={['admin']} /> },
        {
          path: "batches",
          element: <BatchesLayout />, // BatchesPage with Navbar
          children: [
            { index: true, element: <ProtectedRoute element={<BatchesPage />} roles={['admin', 'teacher']} /> },
            {
              path: "",
              element: <NonavLayout />, // Child routes without Navbar
              children: [
                { path: "new", element: <ProtectedRoute element={<NewBatch />} roles={['admin', 'teacher']} /> },
                { path: "details/:batchId", element: <ProtectedRoute element={<BatchDetails />} roles={['admin', 'teacher']} /> },
                { path: "members", element: <ProtectedRoute element={<ManageMembers />} roles={['admin', 'teacher']} /> },
                { path: "details/:batchId/notes/:noteId", element: <ProtectedRoute element={<BatchNote />} roles={['admin', 'teacher']} /> },
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
        { index: true, path: "home", element: <ProtectedRoute element={<HomePage2 />} roles={['student']} /> },
        { path: "search", element: <ProtectedRoute element={<SearchPage />} roles={['student']} /> },
        { path: "notes", element: <ProtectedRoute element={<NotesPage />} roles={['student']} /> },
        { path: "profile", element: <ProtectedRoute element={<ProfilePage2 />} roles={['student']} /> },
        {
          path: "batches",
          element: <BatchesLayout />, // BatchesPage with Navbar
          children: [
            { index: true, element: <ProtectedRoute element={<BatchesPage2 />} roles={['student']} /> },
            {
              path: "",
              element: <NonavLayout />, // Child routes without Navbar
              children: [
                { path: "new", element: <ProtectedRoute element={<NewBatch />} roles={['student']} /> },
                { path: "details/:batchId", element: <ProtectedRoute element={<BatchDetails />} roles={['student']} /> },
                { path: ":batchId/notes/:noteId", element: <ProtectedRoute element={<BatchNote />} roles={['student']} /> },
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
