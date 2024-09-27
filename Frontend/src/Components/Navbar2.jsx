import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiHome, HiOutlineSearch, HiUserGroup, HiUser } from 'react-icons/hi';
// import { CgNotes } from "react-icons/cg";

const NavigationBar2 = () => {
    const navItems = [
        { name: 'Home', icon: HiHome, path: '/s/home' },
        { name: 'Batches', icon: HiUserGroup, path: '/s/batches' },
        { name: 'Search', icon: HiOutlineSearch, path: '/s/search' },
        // { name: 'Notes', icon: CgNotes, path: '/s/notes' },
        { name: 'Profile', icon: HiUser, path: '/s/profile' }
    ];

    return (
        <nav className="flex items-center justify-between md:px-16 px-6 xl:justify-evenly py-3 border-t bg-gray-800 border-gray-700 transition-colors duration-200 fixed w-full z-[999] bottom-0">
            {navItems.map(({ name, icon: Icon, path }) => (
                <NavLink
                    key={name}
                    to={path}
                    className={({ isActive }) => `
                        flex flex-col items-center gap-1 transition-colors duration-200
                        ${isActive 
                            ? 'text-blue-400' 
                            : 'text-gray-400 hover:text-white'
                        }
                    `}
                >
                    <Icon className="text-xl" />
                    <span className="text-xs">{name}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default NavigationBar2;
