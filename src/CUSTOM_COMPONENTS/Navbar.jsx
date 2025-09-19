import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
const Navbar = () => {
    const {pathname} = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const [scrollY, setScrollY] = useState(0);
    const [hasShadow, setHasShadow] = useState(false);
    const [isCoursesHovered, setIsCoursesHovered] = useState(false);
    const [coursesMenuTimeout, setCoursesMenuTimeout] = useState(null);
    const [courses, setCourses] = useState([]);
    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        fetch("/navCourse.json")   // ✅ Path relative to public/
          .then((res) => res.json())
          .then((data) => setCourses(data))
          .catch((err) => console.error(err));
      }, []);

    const handleCoursesHover = () => {
        if (coursesMenuTimeout) {
            clearTimeout(coursesMenuTimeout);
            setCoursesMenuTimeout(null);
        }
        setIsCoursesHovered(true);
    };

    const handleCoursesLeave = () => {
        const timeout = setTimeout(() => {
            setIsCoursesHovered(false);
        }, 300); // Small delay to prevent accidental closing
        setCoursesMenuTimeout(timeout);
    };

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Blur + shadow on scroll
            setHasShadow(currentScrollY > 0);

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
                setIsCoursesHovered(false); // Close dropdown when scrolling
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

                <div className='flex gap-20'>
                    {/* Desktop Menu */}
                    <div className='hidden md:flex items-center gap-10 text-lg text-white'>
                        <NavLink to='/' className={({ isActive }) => isActive ? 'text-[#D6A419] font-semibold' : 'hover:text-[#D6A419]'}>
                            Home
                        </NavLink>

                        {/* Courses Menu with Hover */}
                        <div
                            className="relative"
                            onMouseEnter={handleCoursesHover}
                            onMouseLeave={handleCoursesLeave}
                        >
                            <NavLink
                                to='/course'
                                className={({ isActive }) =>
                                    `flex items-center ${isActive ? 'text-[#D6A419] font-semibold' : 'hover:text-[#D6A419]'}`
                                }
                            >
                                Courses
                                {/* <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`ml-1 h-4 w-4 transition-transform ${isCoursesHovered ? 'rotate-180' : ''}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg> */}
                            </NavLink>

                            {/* Full-width Dropdown */}
                            {isCoursesHovered && (
                                <div
                                    className="absolute left-1/2 transform -translate-x-1/2 mt-8 w-screen max-w-5xl px-8"
                                    onMouseEnter={handleCoursesHover}
                                    onMouseLeave={handleCoursesLeave}
                                >
                                    <div className="rounded-lg shadow-lg overflow-hidden">
                                        <div className="relative bg-white grid grid-cols-2 md:grid-cols-3 gap-4 p-8">
                                            {/* Decorative element */}
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B2A4A] to-[#D6A419]"></div>

                                            {courses.map((course) => (
                                                <NavLink
                                                    key={course.id}
                                                    to={course.path}
                                                    className=" group block p-2 rounded-lg hover:bg-gray-50 transition-all duration-200  hover:border-gray-200 border border-transparent"
                                                    onClick={() => setIsCoursesHovered(false)}
                                                >
                                                    <h3 className="font-semibold text-[#0B2A4A] group-hover:text-[#D6A419] transition-colors">
                                                        {course.title}
                                                    </h3>
                                                    {/* <p className="mt-2 text-sm text-gray-600">
                                                        {course.description}
                                                    </p> */}
                                                    <div className="mt-3 flex items-center text-sm text-[#0B2A4A] font-medium group-hover:text-[#D6A419] transition-colors">
                                                        Explore course
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </NavLink>
                                            ))}

                                            {/* View All Courses Link */}
                                            <div className="col-span-full mt-4 pt-4 border-t border-gray-200">
                                                <NavLink
                                                    to="/course"
                                                    className="inline-flex items-center text-[#0B2A4A] font-semibold hover:text-[#D6A419] transition-colors"
                                                    onClick={() => setIsCoursesHovered(false)}
                                                >
                                                    View all courses
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

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
                </div>
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

                    {/* Mobile Courses Accordion */}
                    <div className="w-full px-4">
                        <button
                            className="flex items-center justify-between w-full text-lg"
                            onClick={() => setIsCoursesHovered(!isCoursesHovered)}
                        >
                            <span>Courses</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 transition-transform ${isCoursesHovered ? 'rotate-180' : ''}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {isCoursesHovered && (
                            <div className="mt-2 pl-4 space-y-2">
                                {courses.map((course) => (
                                    <NavLink
                                        key={course.id}
                                        to={course.path}
                                        className="block py-2 text-gray-200 hover:text-[#D6A419]"
                                        onClick={toggleMenu}
                                    >
                                        {course.title}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>

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