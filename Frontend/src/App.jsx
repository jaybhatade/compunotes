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
import BatchNote2 from './Pages/Student/SubPages/BatchNote2';

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
    // Main layout with Home and Login pages
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },   // Home page
        { path: "login", element: <LoginPage /> },   // Login page
      ],
    },
    // Admin layout with protected routes
    {
      path: "a",
      element: <AdminLayout />,
      children: [
        { index: true, path: "home", element: <ProtectedRoute element={<HomePage />} roles={['admin', 'teacher']} /> },   // Admin home page
        { path: "add", element: <ProtectedRoute element={<AddNotesPage />} roles={['admin', 'teacher']} /> },   // Add notes page
        { path: "database", element: <ProtectedRoute element={<DatabasePage />} roles={['admin']} /> },   // Admin database page
        { path: "profile", element: <ProtectedRoute element={<ProfilePage />} roles={['admin', 'teacher']} /> },   // Admin/Teacher profile page
        { path: "users", element: <ProtectedRoute element={<ManageUser />} roles={['admin']} /> },   // User management (admin only)
        
        // Batches section with Navbar
        {
          path: "batches",
          element: <BatchesLayout />,
          children: [
            { index: true, element: <ProtectedRoute element={<BatchesPage />} roles={['admin', 'teacher']} /> },  // Batches main page
            { path: "new", element: <ProtectedRoute element={<NewBatch />} roles={['admin', 'teacher']} /> },   // New batch creation
            { path: "details/:batchId", element: <ProtectedRoute element={<BatchDetails />} roles={['admin', 'teacher']} /> },   // Batch details
            { path: "details/:batchId/notes/:noteId", element: <ProtectedRoute element={<BatchNote />} roles={['admin', 'teacher']} /> },   // Batch note details
            { path: "members", element: <ProtectedRoute element={<ManageMembers />} roles={['admin', 'teacher']} /> },   // Manage batch members
          ],
        },
      ],
    },
    // Student layout with protected routes
    {
      path: "s",
      element: <StudentLayout />,
      children: [
        { index: true, path: "home", element: <ProtectedRoute element={<HomePage2 />} roles={['student']} /> },   // Student home page
        { path: "search", element: <ProtectedRoute element={<SearchPage />} roles={['student']} /> },   // Search page
        { path: "notes", element: <ProtectedRoute element={<NotesPage />} roles={['student']} /> },   // Notes page
        { path: "profile", element: <ProtectedRoute element={<ProfilePage2 />} roles={['student']} /> },   // Student profile page
        
        // Batches section with Navbar
        {
          path: "batches",
          element: <BatchesLayout />,
          children: [
            { index: true, element: <ProtectedRoute element={<BatchesPage2 />} roles={['student']} /> },   // Student batches page
            { path: "details/:batchId", element: <ProtectedRoute element={<BatchDetails />} roles={['student']} /> },   // Batch details
            { path: "details/:batchId/notes/:noteId", element: <ProtectedRoute element={<BatchNote2 />} roles={['student']} /> },   // Batch note details
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
