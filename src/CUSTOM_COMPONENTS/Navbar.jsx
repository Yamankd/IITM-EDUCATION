import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className='flex items-center justify-between px-6 md:px-20 py-4 border-b relative bg-white shadow-sm'>
            <div className='text-2xl font-semibold'>Logo</div>

            {/* Desktop Menu */}
            <div className='hidden md:flex items-center gap-10 text-lg'>
                <NavLink to='/' className='hover:text-blue-600'>Home</NavLink>
                <NavLink to='/course' className='hover:text-blue-600'>Courses</NavLink>
                <NavLink to='/team' className='hover:text-blue-600'>Team</NavLink>
                <NavLink to='/store' className='hover:text-blue-600'>Store</NavLink>
            </div>

            <button className='hidden md:block px-5 py-2 bg-blue-600 text-white rounded-md cursor-pointer font-bold'>
                Sign In
            </button>

            {/* Hamburger Icon */}
            <div className='md:hidden'>
                <button onClick={toggleMenu}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-800"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className='absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 md:hidden z-50'>
                    <NavLink to='/' onClick={toggleMenu} className='text-lg hover:text-blue-600'>Home</NavLink>
                    <NavLink to='/course' onClick={toggleMenu} className='text-lg hover:text-blue-600'>Courses</NavLink>
                    <NavLink to='/team' onClick={toggleMenu} className='text-lg hover:text-blue-600'>Team</NavLink>
                    <NavLink to='/store' onClick={toggleMenu} className='text-lg hover:text-blue-600'>Store</NavLink>
                    <button className='px-5 py-2 bg-blue-600 text-white rounded-md font-bold' onClick={toggleMenu}>
                        Sign In
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
