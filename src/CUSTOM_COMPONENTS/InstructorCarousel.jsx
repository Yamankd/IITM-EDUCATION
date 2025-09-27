// components/InstructorCarousel.js
import React, { useState, useEffect, useRef } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import deepakImage from '../assets/instructorImages/deepak.png';
import rohit from '../assets/instructorImages/rohit.png';
import aashish from '../assets/instructorImages/aashish.jpeg';
import deepakYadav from '../assets/instructorImages/deepakYadav.png';


const InstructorCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(1); // Start at the first "real" item
    const [cardWidth, setCardWidth] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const autoScrollRef = useRef(null);
    const carouselRef = useRef(null);
    const cardRef = useRef(null);

    const instructors = [
        { name: "Yamank Dhuriya", role: "MERN Developer", image: "https://avatars.githubusercontent.com/u/148179853?v=4" },
        { name: "Deepak Kumar", role: "Accounts & Finance", image: deepakImage },
        { name: "Rohit Mahour", role: "Accounts & Finance", image: rohit },
        { name: "Aashish Gupta", role: "Accounts & Finance", image: aashish },
        { name: "Deepak Yadav", role: "Python Developer", image: deepakYadav },

    ];

    // Create a new array with clones for seamless looping
    const loopedInstructors = [
        instructors[instructors.length - 1], // Last item at the beginning
        ...instructors, // All original items
        instructors[0] // First item at the end
    ];

    // Function to calculate and set the card width
    const updateCardWidth = () => {
        if (cardRef.current) {
            const style = window.getComputedStyle(cardRef.current);
            const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
            setCardWidth(cardRef.current.offsetWidth + margin);
        }
    };

    // Calculate card width on mount and on window resize
    useEffect(() => {
        updateCardWidth();
        window.addEventListener('resize', updateCardWidth);
        return () => window.removeEventListener('resize', updateCardWidth);
    }, []);

    // Function to handle moving to the next slide
    const handleNext = () => {
        if (transitionEnabled) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    // Function to handle moving to the previous slide
    const handlePrev = () => {
        if (transitionEnabled) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Effect to handle the "infinite" loop reset
    useEffect(() => {
        if (currentIndex === 0) {
            // When we reach the first clone (last item), jump to the real last item
            const timer = setTimeout(() => {
                setTransitionEnabled(false);
                setCurrentIndex(instructors.length);
            }, 500);
            return () => clearTimeout(timer);
        }
        if (currentIndex === loopedInstructors.length - 1) {
            // When we reach the last clone (first item), jump to the real first item
            const timer = setTimeout(() => {
                setTransitionEnabled(false);
                setCurrentIndex(1);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, instructors.length, loopedInstructors.length]);

    // Effect to re-enable transition after the "snap" reset
    useEffect(() => {
        if (!transitionEnabled) {
            const timer = setTimeout(() => setTransitionEnabled(true), 50);
            return () => clearTimeout(timer);
        }
    }, [transitionEnabled]);

    // Auto-scroll functionality
    const resetAutoScroll = () => {
        if (autoScrollRef.current) clearInterval(autoScrollRef.current);
        autoScrollRef.current = setInterval(handleNext, 3000);
    };

    useEffect(() => {
        resetAutoScroll();
        return () => {
            if (autoScrollRef.current) clearInterval(autoScrollRef.current);
        };
    }, []);

    const handleMouseEnter = () => {
        if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };

    const handleMouseLeave = () => resetAutoScroll();

    // The dot index should correspond to the original array
    const activeDotIndex = (currentIndex - 1 + instructors.length) % instructors.length;

    return (
        <div className="bg-[#D6A419] py-12 px-4 md:px-15 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-[#0B2A4A]">Our Instructors</h2>
                    {/* Navigation buttons for desktop */}
                    <div className="hidden md:flex space-x-2">
                        <button
                            onClick={handlePrev}
                            className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            aria-label="Previous Instructor"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            aria-label="Next Instructor"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M9 6l6 6-6 6" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div
                    className="overflow-hidden w-full"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={carouselRef}
                >
                    <div
                        className="flex"
                        style={{
                            transform: `translateX(-${currentIndex * cardWidth}px)`,
                            transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
                        }}
                    >
                        {loopedInstructors.map((instructor, index) => (
                            <div
                                key={index}
                                ref={index === 1 ? cardRef : null} // Attach ref to first real card to measure
                                className="bg-[#0B2A4A] rounded-lg shadow-md p-4 md:p-6 w-60 mx-2 text-center flex items-center justify-center flex-col hover:shadow-lg transition-shadow duration-300 flex-shrink-0"
                            >
                                <div className='border-3 h-28 w-28 md:h-[150px] md:w-[150px] border-white rounded-full flex items-center justify-center overflow-hidden'>
                                    <img
                                        src={instructor.image}
                                        alt={instructor.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150/0B2A4A/FFFFFF?text=No+Image';
                                        }}
                                    />
                                </div>
                                <div className="flex justify-center mt-4 gap-4 text-gray-600">
                                    <FaFacebookF className="hover:text-[#D6A419] cursor-pointer transition-colors text-white" />
                                    <FaTwitter className="hover:text-[#D6A419] cursor-pointer transition-colors text-white" />
                                    <FaLinkedinIn className="hover:text-[#D6A419] cursor-pointer transition-colors text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mt-4 text-white">{instructor.name}</h3>
                                <p className="text-sm text-amber-400">{instructor.role || "Instructor"}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile navigation buttons */}
                <div className="flex md:hidden justify-center mt-6 space-x-4">
                    <button
                        onClick={handlePrev}
                        className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Previous Instructor"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Next Instructor"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 6l6 6-6 6" />
                        </svg>
                    </button>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center mt-8 space-x-2">
                    {instructors.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index + 1)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeDotIndex ? 'bg-[#0B2A4A]' : 'bg-white/50'}`}
                            aria-label={`Go to instructor ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InstructorCarousel;