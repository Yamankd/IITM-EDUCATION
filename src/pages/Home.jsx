import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const Home = () => {
    const [particles, setParticles] = useState([]);
    const [interactionMode, setInteractionMode] = useState('mouse');
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const requestRef = useRef();

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

    // Keyboard interaction
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (interactionMode !== 'keyboard') return;

            if (e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
                e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                setParticles(prevParticles =>
                    prevParticles.map(particle => {
                        let forceX = 0;
                        let forceY = 0;

                        if (e.key === 'ArrowUp') forceY = -1;
                        if (e.key === 'ArrowDown') forceY = 1;
                        if (e.key === 'ArrowLeft') forceX = -1;
                        if (e.key === 'ArrowRight') forceX = 1;

                        return {
                            ...particle,
                            speedX: particle.speedX + forceX * 0.5,
                            speedY: particle.speedY + forceY * 0.5
                        };
                    })
                );
            }

            // Spacebar to create explosion effect
            if (e.key === ' ') {
                setParticles(prevParticles =>
                    prevParticles.map(particle => {
                        const angle = Math.random() * Math.PI * 2;
                        const force = Math.random() * 2 + 1;

                        return {
                            ...particle,
                            speedX: Math.cos(angle) * force,
                            speedY: Math.sin(angle) * force
                        };
                    })
                );
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [interactionMode]);

    const toggleInteractionMode = () => {
        setInteractionMode(prevMode => prevMode === 'mouse' ? 'keyboard' : 'mouse');
    };

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#0B2A4A]">
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

                {/* Interaction Instructions */}
                {/* <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-[#D6A419]">Interactive Background</h2>
                    <p className="mb-4">Try interacting with the background using:</p>

                    <div className="flex justify-center mb-4">
                        <button
                            onClick={toggleInteractionMode}
                            className={`px-4 py-2 rounded-l-lg ${interactionMode === 'mouse'
                                ? 'bg-[#D6A419] text-[#0B2A4A]'
                                : 'bg-gray-700 text-white'
                                }`}
                        >
                            Mouse Mode
                        </button>
                        <button
                            onClick={toggleInteractionMode}
                            className={`px-4 py-2 rounded-r-lg ${interactionMode === 'keyboard'
                                ? 'bg-[#D6A419] text-[#0B2A4A]'
                                : 'bg-gray-700 text-white'
                                }`}
                        >
                            Keyboard Mode
                        </button>
                    </div>

                    {interactionMode === 'mouse' ? (
                        <div className="text-sm">
                            <p>✨ Move your mouse to influence the particles</p>
                            <p>✨ Watch them react to your cursor movement</p>
                        </div>
                    ) : (
                        <div className="text-sm">
                            <p>🎮 Use arrow keys to create currents</p>
                            <p>🎮 Press spacebar for an explosion effect</p>
                        </div>
                    )}
                </div> */}

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce">
                        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;