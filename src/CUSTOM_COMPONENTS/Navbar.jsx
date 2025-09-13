import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [scrollY, setScrollY] = useState(0);
    const [hasShadow, setHasShadow] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Blur + shadow on scroll
            setHasShadow(currentScrollY > 0);

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`
                fixed top-0 left-0 w-full z-50 transition-all duration-300
                ${isVisible ? 'translate-y-0' : '-translate-y-full'}
                ${hasShadow ? 'bg-[#0B2A4A]/80 backdrop-blur-md shadow-md' : 'bg-[#0B2A4A]'}
            `}
        >
            <div className='flex items-center justify-between px-4 md:px-20 py-3'>
                {/* Logo */}
                <div className='flex items-center gap-3'>
                    <img src={logo} alt="IITM Logo" className='w-16 h-16 object-contain' />
                </div>

                {/* Desktop Menu */}
                <div className='hidden md:flex items-center gap-10 text-lg text-white'>
                    <NavLink to='/' className={({ isActive }) => isActive ? 'text-[#D6A419] font-semibold' : 'hover:text-[#D6A419]'}>
                        Home
                    </NavLink>
                    <NavLink to='/course' className={({ isActive }) => isActive ? 'text-[#D6A419] font-semibold' : 'hover:text-[#D6A419]'}>
                        Courses
                    </NavLink>
                    <NavLink to='/team' className={({ isActive }) => isActive ? 'text-[#D6A419] font-semibold' : 'hover:text-[#D6A419]'}>
                        Team
                    </NavLink>
                    <NavLink to='/store' className={({ isActive }) => isActive ? 'text-[#D6A419] font-semibold' : 'hover:text-[#D6A419]'}>
                        Store
                    </NavLink>
                </div>

                {/* Sign In Button (Desktop) */}
                <button
                    className='hidden md:block px-5 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-md font-bold hover:bg-yellow-400 transition-all duration-200'
                    aria-label='Sign In'
                >
                    Sign In
                </button>

                {/* Hamburger Icon */}
                <div className='md:hidden'>
                    <button onClick={toggleMenu} aria-label='Toggle Menu'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className='bg-[#0B2A4A]/95 backdrop-blur-md flex flex-col items-center gap-4 py-4 md:hidden text-white transition-all duration-300'>
                    <NavLink to='/' onClick={toggleMenu} className='text-lg hover:text-[#D6A419]'>Home</NavLink>
                    <NavLink to='/course' onClick={toggleMenu} className='text-lg hover:text-[#D6A419]'>Courses</NavLink>
                    <NavLink to='/team' onClick={toggleMenu} className='text-lg hover:text-[#D6A419]'>Team</NavLink>
                    <NavLink to='/store' onClick={toggleMenu} className='text-lg hover:text-[#D6A419]'>Store</NavLink>
                    <button className='px-5 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-md font-bold hover:bg-yellow-400 transition-all duration-200'>
                        Sign In
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
