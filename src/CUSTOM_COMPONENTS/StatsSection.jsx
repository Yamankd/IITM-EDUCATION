import React, { useState, useEffect } from 'react';

const StatsSection = () => {
    const [counters, setCounters] = useState({
        students: 0,
        courses: 0,
        placements: 0,
        years: 0
    });

    useEffect(() => {
        // Animate counters on component mount
        const targetValues = {
            students: 10000,
            courses: 50,
            placements: 9500,
            years: 15
        };

        const duration = 2000; // Animation duration in ms
        const interval = 20; // Update interval in ms
        const steps = duration / interval;

        const increments = {
            students: targetValues.students / steps,
            courses: targetValues.courses / steps,
            placements: targetValues.placements / steps,
            years: targetValues.years / steps
        };

        let currentValues = { ...counters };
        let step = 0;

        const timer = setInterval(() => {
            step += 1;

            currentValues = {
                students: Math.min(Math.floor(currentValues.students + increments.students), targetValues.students),
                courses: Math.min(Math.floor(currentValues.courses + increments.courses), targetValues.courses),
                placements: Math.min(Math.floor(currentValues.placements + increments.placements), targetValues.placements),
                years: Math.min(Math.floor(currentValues.years + increments.years), targetValues.years)
            };

            setCounters(currentValues);

            if (step >= steps) {
                clearInterval(timer);
                // Set final values to ensure accuracy
                setCounters(targetValues);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-gradient-to-r from-[#0B2A4A] to-[#1a3c61] py-16 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact in Numbers</h2>
                    <p className="text-gray-300 max-w-3xl mx-auto">
                        For over a decade, we've been transforming lives through quality computer education and career development.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Students Trained */}
                    <div className="bg-white rounded-lg p-6 text-center shadow-lg transform transition-transform duration-300 hover:scale-105">
                        <div className="bg-[#D6A419] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[#0B2A4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-4xl font-bold text-[#0B2A4A] mb-2">{counters.students}+</h3>
                        <p className="text-gray-600 font-medium">Students Trained</p>
                    </div>

                    {/* Courses Offered */}
                    <div className="bg-white rounded-lg p-6 text-center shadow-lg transform transition-transform duration-300 hover:scale-105">
                        <div className="bg-[#D6A419] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[#0B2A4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-4xl font-bold text-[#0B2A4A] mb-2">{counters.courses}+</h3>
                        <p className="text-gray-600 font-medium">Courses Offered</p>
                    </div>

                    {/* Successful Placements */}
                    <div className="bg-white rounded-lg p-6 text-center shadow-lg transform transition-transform duration-300 hover:scale-105">
                        <div className="bg-[#D6A419] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[#0B2A4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 002 2h2a2 2 0 002-2V6m0 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6" />
                            </svg>
                        </div>
                        <h3 className="text-4xl font-bold text-[#0B2A4A] mb-2">{counters.placements}+</h3>
                        <p className="text-gray-600 font-medium">Successful Placements</p>
                    </div>

                    {/* Years of Experience */}
                    <div className="bg-white rounded-lg p-6 text-center shadow-lg transform transition-transform duration-300 hover:scale-105">
                        <div className="bg-[#D6A419] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[#0B2A4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-4xl font-bold text-[#0B2A4A] mb-2">{counters.years}+</h3>
                        <p className="text-gray-600 font-medium">Years of Excellence</p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 bg-[#D6A419] rounded-lg p-6 text-center">
                    <p className="text-[#0B2A4A] font-bold text-lg">
                        Join thousands of successful students who have launched their tech careers with our programs.
                    </p>
                    <button className="mt-4 px-6 py-2 bg-[#0B2A4A] text-white rounded-md font-bold hover:bg-blue-900 transition-colors">
                        Start Your Journey Today
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatsSection;