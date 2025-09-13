import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png'; // <-- adjust path as per your project

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className='flex items-center justify-between px-4 md:px-20 py-2  relative bg-[#0B2A4A] '>
            {/* Logo */}
            <div className='flex items-center gap-2'>
                <img src={logo} alt="Logo" className='w-20 h-20 object-contain' />
            </div>

            {/* Desktop Menu */}
            <div className='hidden md:flex items-center gap-10 text-lg text-white'>
                <NavLink to='/' className='hover:text-[#D6A419]'>Home</NavLink>
                <NavLink to='/course' className='hover:text-[#D6A419]'>Courses</NavLink>
                <NavLink to='/team' className='hover:text-[#D6A419]'>Team</NavLink>
                <NavLink to='/store' className='hover:text-[#D6A419]'>Store</NavLink>
            </div>

            {/* Desktop Sign In */}
            <button className='hidden md:block px-5 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-md font-bold cursor-pointer'>
                Sign In
            </button>

            {/* Hamburger Icon */}
            <div className='md:hidden'>
                <button onClick={toggleMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div className='absolute top-full left-0 w-full bg-[#0B2A4A] shadow-md flex flex-col items-center gap-4 py-4 md:hidden z-50 text-white'>
                    <NavLink to='/' onClick={toggleMenu} className='text-lg hover:text-[#D6A419]'>Home</NavLink>
                    <NavLink to='/course' onClick={toggleMenu} className='text-lg hover:text-[#D6A419]'>Courses</NavLink>
                    <NavLink to='/team' onClick={toggleMenu} className='text-lg hover:text-[#D6A419]'>Team</NavLink>
                    <NavLink to='/store' onClick={toggleMenu} className='text-lg hover:text-[#D6A419]'>Store</NavLink>
                    <button className='px-5 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-md font-bold' onClick={toggleMenu}>
                        Sign In
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
