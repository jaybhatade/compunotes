import React from 'react';
import { RouterProvider } from 'react-router-dom';
import Rrouter from './Routes';


function App() {

  Rrouter

  return (
    <div className='bg-gray-900 min-h-screen'>
      <RouterProvider router={Rrouter} />
    </div>
  );
}

export default App;
