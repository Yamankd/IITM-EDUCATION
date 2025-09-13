import React from 'react';
import { NavLink } from 'react-router-dom';

const Home = () => {
    return (
        <div className='bg-white text-[#0B2A4A]'>
            {/* Hero Section */}
            <section className='w-full min-h-[80vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10 bg-[#0B2A4A] text-white'>
                <div className='flex-1'>
                    <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
                        Welcome to IITM Computer Education
                    </h1>
                    <p className='mt-4 text-lg'>
                        Empowering students with digital skills since 2010.
                        Learn programming, web development, and computer basics with us.
                    </p>
                    <NavLink to='/course'>
                        <button className='mt-6 px-6 py-3 bg-[#D6A419] text-[#0B2A4A] font-bold rounded-md hover:bg-yellow-500 transition'>
                            Explore Courses
                        </button>
                    </NavLink>
                </div>

                <div className='flex-1 mt-10 md:mt-0 flex justify-center'>
                    <img
                        src='https://cdn-icons-png.flaticon.com/512/3135/3135755.png'
                        alt='Education'
                        className='w-72 md:w-96'
                    />
                </div>
            </section>

            {/* Course Highlights */}
            <section className='py-16 px-6 md:px-20 bg-gray-50'>
                <h2 className='text-3xl font-bold text-center mb-10'>Popular Courses</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10'>
                    {[
                        { title: "Web Development", desc: "HTML, CSS, JS, React" },
                        { title: "Basic Computer Course", desc: "MS Office, Internet, Typing" },
                        { title: "Tally ERP 9", desc: "Accounting & GST Billing" }
                    ].map((course, index) => (
                        <div
                            key={index}
                            className='p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer'
                        >
                            <h3 className='text-xl font-semibold mb-2'>{course.title}</h3>
                            <p className='text-gray-700'>{course.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className='py-16 bg-[#0B2A4A] text-white text-center px-6 md:px-20'>
                <h2 className='text-3xl font-bold'>Ready to Start Learning?</h2>
                <p className='mt-4 text-lg'>Join IITM today and grow your career with digital skills.</p>
                <NavLink to='/store'>
                    <button className='mt-6 px-6 py-3 bg-[#D6A419] text-[#0B2A4A] font-bold rounded-md hover:bg-yellow-500 transition'>
                        Visit Our Store
                    </button>
                </NavLink>
            </section>
        </div>
    );
};

export default Home;
