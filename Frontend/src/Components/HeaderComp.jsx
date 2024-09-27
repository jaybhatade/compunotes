

// Header Component
function Header () {
    return(
    <header className="flex items-center justify-between px-4 py-3 bg-gray-800 shadow-sm shadow-gray-800 transition-colors duration-200 fixed w-full z-[999]">
      <div className="flex items-center gap-4">
        <h1 href="#" className="text-lg font-semibold text-white transition-colors duration-200">CompuNotes</h1>
      </div>
      <div className="flex items-center gap-4">
        
        <div className="relative">
          <button className="w-8 h-8 rounded-full bg-gray-600 transition-colors duration-200"></button>
          <div className="absolute right-0 mt-2 w-48 :bg-gray-700 rounded-md shadow-lg hidden transition-colors duration-200">
            <a href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">Profile</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">Settings</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">Logout</a>
          </div>
        </div>
      </div>
    </header>
  )}

  export default Header