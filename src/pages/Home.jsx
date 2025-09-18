import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Home = () => {
    const [particles, setParticles] = useState([]);
    const [interactionMode, setInteractionMode] = useState('mouse');
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const requestRef = useRef();
    const [instructorStartIndex, setInstructorStartIndex] = useState(0);
    const autoScrollRef = useRef(null);
    const carouselRef = useRef(null);

    const instructors = [
        {
            name: "Yamank Dhuriya",
            role: "MERN Developer",
            image: "https://avatars.githubusercontent.com/u/148179853?v=4",
        },
        {
            name: "Walter White",
            role: "Frontend Developer",
            image: "https://randomuser.me/api/portraits/men/33.jpg",
        },
        {
            name: "Skyler White",
            role: "Backend Engineer",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
            name: "Jane Margolis",
            role: "Data Scientist",
            image: "https://randomuser.me/api/portraits/women/45.jpg",
        },
        {
            name: "Hank Schrader",
            role: "DevOps Specialist",
            image: "https://randomuser.me/api/portraits/men/46.jpg",
        },
        {
            name: "Marie Schrader",
            role: "Product Manager",
            image: "https://randomuser.me/api/portraits/women/47.jpg",
        },
    ];

    // Auto-scroll functionality
    useEffect(() => {
        const autoScroll = () => {
            setInstructorStartIndex(prev => (prev + 1) % instructors.length);
        };

        autoScrollRef.current = setInterval(autoScroll, 3000);

        return () => {
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
            }
        };
    }, [instructors.length]);

    // Function to reset auto-scroll timer
    const resetAutoScroll = () => {
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
        }
        autoScrollRef.current = setInterval(() => {
            setInstructorStartIndex(prev => (prev + 1) % instructors.length);
        }, 3000);
    };

    // Pause auto-scroll on hover
    const handleMouseEnter = () => {
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
        }
    };

    // Resume auto-scroll when mouse leaves
    const handleMouseLeave = () => {
        resetAutoScroll();
    };

    // Initialize particles
    useEffect(() => {
        const initParticles = () => {
            const newParticles = [];
            const count = window.innerWidth < 768 ? 30 : 50;

            for (let i = 0; i < count; i++) {
                newParticles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 3 + 1,
                    speedX: Math.random() * 0.5 - 0.25,
                    speedY: Math.random() * 0.5 - 0.25,
                    color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`,
                    originalSize: Math.random() * 3 + 1
                });
            }

            setParticles(newParticles);
        };

        initParticles();

        const handleResize = () => {
            initParticles();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Boundary check
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });

            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(214, 164, 25, ${1 - distance / 100})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        animate();

        return () => {
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [particles]);

    // Mouse interaction
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (interactionMode !== 'mouse') return;

            setParticles(prevParticles =>
                prevParticles.map(particle => {
                    const dx = e.clientX - particle.x;
                    const dy = e.clientY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const angle = Math.atan2(dy, dx);
                        const force = (100 - distance) / 100;

                        return {
                            ...particle,
                            speedX: particle.speedX - Math.cos(angle) * force * 0.3,
                            speedY: particle.speedY - Math.sin(angle) * force * 0.3,
                            size: Math.min(particle.originalSize * 2, particle.originalSize + force * 3)
                        };
                    }

                    // Gradually return to original size
                    return {
                        ...particle,
                        size: particle.size > particle.originalSize
                            ? Math.max(particle.originalSize, particle.size - 0.1)
                            : particle.size
                    };
                })
            );
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [interactionMode]);

    const toggleInteractionMode = () => {
        setInteractionMode(prevMode => prevMode === 'mouse' ? 'keyboard' : 'mouse');
    };

    return (
        <>
            <div ref={containerRef} className="relative h-[90vh] overflow-hidden bg-[#0B2A4A]">
                {/* Interactive Canvas Background */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ zIndex: 1 }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center text-white">
                    <div className="mb-8">
                        <img src={logo} alt="IITM Logo" className="w-24 h-24 mx-auto mb-6 object-contain" />
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to IITM</h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Discover world-class education and cutting-edge research
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <NavLink
                            to="/course"
                            className="px-6 py-3 bg-[#D6A419] text-[#0B2A4A] font-bold rounded-lg hover:bg-yellow-400 transition-colors duration-300"
                        >
                            Explore Courses
                        </NavLink>
                        <NavLink
                            to="/team"
                            className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors duration-300"
                        >
                            Meet Our Team
                        </NavLink>
                    </div>

                </div>
            </div>

            {/* Stats Section */}
            <div className='bg-[#0B2A4A] w-full h-55 flex items-center justify-center'>
                <div className='w-[90%] bg-white h-40 rounded-xl flex items-center justify-around p-4'>
                    {/* Stat Item 1: Years of Excellence */}
                    <div className="flex items-center gap-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#0B2A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" />
                        </svg>
                        <div>
                            <h3 className="text-3xl font-bold text-slate-800">14+</h3>
                            <p className="text-sm text-slate-500">Years of Educational Excellence</p>
                        </div>
                    </div>

                    {/* Stat Item 2: Successful Alumni */}
                    <div className="flex items-center gap-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#0B2A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 极市4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <div>
                            <h3 className="text-3xl font-bold text-slate-800">5,000+</h3>
                            <p className="text-sm text-slate-500">Successful Alumni</p>
                        </div>
                    </div>

                    {/* Stat Item 3: Placement Rate */}
                    <div className="flex items-center gap-x-4">
                        <svg xmlns="极市www.w3.org/2000/svg" className="h-12 w-12 text-[#0B2A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8极市v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12l-3-3-3 3" />
                        </svg>
                        <div>
                            <h3 className="text-3极市xl font-bold text-slate-800">95%</h3>
                            <p className="text-sm text-slate-500">Placement Rate</p>
                        </div>
                    </div>

                    {/* Stat Item 4: Industry Partners */}
                    <div className="flex items-center gap-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#0B2A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2极市h2a2 2 极市0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <div>
                            <h3 className="text-3xl font-bold text-slate-800">50+</h3>
                            <p className="text-sm text-slate-500">Industry Partners</p>
                        </div>
                    </div>

                    {/* Stat Item 5: Placeholder */}
                    <div className="flex items-center gap-x-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#0B2A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0极市l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Instructor Carousel Section */}
            <div className="bg-[#D6A419] py-12 px-4 md:px-15 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-[#0B2A4A]">Our Instructors</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => {
                                    setInstructorStartIndex(prev => {
                                        const newIndex = prev === 0 ? instructors.length - 1 : prev - 1;
                                        return newIndex;
                                    });
                                    resetAutoScroll();
                                }}
                                className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                onClick={() => {
                                    setInstructorStartIndex(prev => {
                                        const newIndex = (prev + 1) % instructors.length;
                                        return newIndex;
                                    });
                                    resetAutoScroll();
                                }}
                                className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M9 6l6 6-6 6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div
                        className="flex overflow-hidden w-full"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        ref={carouselRef}
                    >
                        <div
                            className="flex transition-all duration-500 ease-in-out"
                            style={{ transform: `translateX(-${instructorStartIndex * (320 + 16)}px)` }}
                        >
                            {/* Create an infinite loop by duplicating the items */}
                            {[...instructors, ...instructors, ...instructors].map((instructor, index) => (
                                <div key={index} className="bg-[#0B2A4A] rounded-lg shadow-md p-6 w-60 mx-2 text-center flex items-center justify-center flex-col hover:shadow-lg transition-shadow duration-300">
                                    <div className=' border-3 h-[150px] w-[150px] border-white rounded-full flex items-center justify-center overflow-hidden'>
                                        <img
                                            src={instructor.image}
                                            alt={instructor.name}
                                            className="w-full h-full  object-cover"
                                        />
                                    </div>
                                    <div className="flex justify-center mt-4 gap-4 text-gray-600">
                                        <FaFacebookF className="hover:text-[#0B2A4A] cursor-pointer transition-colors" />
                                        <FaTwitter className="hover:text-[#0B2A4A] cursor-pointer transition-colors" />
                                        <FaLinkedinIn className="hover:text-[#0B2A4A] cursor-pointer transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-semibold mt-4 text-white">{instructor.name}</h3>
                                    <p className="text-sm text-amber-400">{instructor.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots indicator */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {instructors.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setInstructorStartIndex(index);
                                    resetAutoScroll();
                                }}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === instructorStartIndex ? 'bg-[#0B2A4A]' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;