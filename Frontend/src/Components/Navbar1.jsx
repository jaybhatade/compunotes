import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiHome, HiDatabase, HiPlus, HiUserGroup, HiUser } from 'react-icons/hi';

const NavigationBar1 = () => {
    const navItems = [
        { name: 'Home', icon: HiHome, path: '/a/home' },
        { name: 'Batches', icon: HiUserGroup, path: '/a/batches' },
        { name: 'Add', icon: HiPlus, path: '/a/add' },
        { name: 'Database', icon: HiDatabase, path: '/a/database' },
        { name: 'Profile', icon: HiUser, path: '/a/profile' }
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

export default NavigationBar1;
