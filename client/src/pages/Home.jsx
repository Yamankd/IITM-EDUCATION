import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import InstructorCarousel from "../components/common/InstructorCarousel";
import EventsShowcase from "../components/common/EventsShowcase";

const Home = () => {
  const [particles, setParticles] = useState([]);
  const [interactionMode, setInteractionMode] = useState("mouse");
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const requestRef = useRef();
  const [stats, setStats] = useState({
    years: 0,
    alumni: 0,
    placement: 0,
    partners: 0,
  });
  const statsRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Hide scroll indicator when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY <= 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stats animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;

            const duration = 2000; // ms
            const frameRate = 30;
            const totalFrames = Math.round(duration / (1000 / frameRate));

            animateValue(14, 0, totalFrames, "years");
            animateValue(25, 0, totalFrames, "alumni");
            animateValue(85, 0, totalFrames, "placement");
            animateValue(50, 0, totalFrames, "partners");
          }
        });
      },
      { threshold: 0.5 },
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  const animateValue = (target, start, totalFrames, statKey) => {
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(target * progress);

      setStats((prev) => ({ ...prev, [statKey]: current }));

      if (frame === totalFrames) clearInterval(timer);
    }, 1000 / 30);
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
          originalSize: Math.random() * 3 + 1,
        });
      }

      setParticles(newParticles);
    };

    initParticles();
    const handleResize = () => initParticles();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
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
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [particles]);

  // Mouse interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (interactionMode !== "mouse") return;

      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
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
              size: Math.min(
                particle.originalSize * 2,
                particle.originalSize + force * 3,
              ),
            };
          }

          return {
            ...particle,
            size:
              particle.size > particle.originalSize
                ? Math.max(particle.originalSize, particle.size - 0.1)
                : particle.size,
          };
        }),
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactionMode]);

  const toggleInteractionMode = () => {
    setInteractionMode((prevMode) =>
      prevMode === "mouse" ? "keyboard" : "mouse",
    );
  };

  return (
    <>
      {/* Hero Section */}
      <div
        ref={containerRef}
        className="relative h-[90vh] overflow-hidden bg-[#0B2A4A]"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center text-white">
          <div className="mb-8">
            <img
              src={logo}
              alt="IITM Logo"
              className="w-24 h-24 mx-auto mb-6 object-contain"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to IITM
            </h1>
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

          {showScrollIndicator && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="flex flex-col items-center">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Infinite Scroller Strip */}
      <div className="bg-[#0B2A4A] py-4 overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "infinite-scroll 30s linear infinite",
            width: "max-content",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.animationPlayState = "running")
          }
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="inline-flex items-center mx-8 text-white">
              <span className="text-2xl font-bold text-[#D6A419] mr-2">🎓</span>
              <span className="font-semibold text-sm md:text-base">
                Admissions Open{" "}
              </span>
              <span className="font-bold text-[#D6A419] mx-1 text-sm md:text-base">
                2026
              </span>
              <span className="font-semibold text-sm md:text-base">
                - Join New Batches Today!
              </span>
              <span className="text-2xl font-bold text-[#D6A419] ml-2">⭐</span>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
                @keyframes infinite-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                `}
      </style>

      {/* Stats Section */}
      <div
        ref={statsRef}
        className="bg-[#0B2A4A] w-full py-10 flex items-center justify-center"
      >
        <div className="w-[90%] bg-white h-auto rounded-xl flex flex-col md:flex-row items-center justify-around p-6 gap-6 md:gap-0">
          <div className="flex items-center justify-center flex-col">
            <h3 className="text-5xl md:text-6xl font-bold text-[#0B2A4A]">
              {stats.years}+
            </h3>
            <p className="text-sm md:text-md text-zinc-800 text-center mt-2">
              Years of Educational Excellence
            </p>
          </div>
          <div className="flex items-center justify-center flex-col">
            <h3 className="text-5xl md:text-6xl font-bold text-[#0B2A4A]">
              {stats.alumni}K+
            </h3>
            <p className="text-sm md:text-md text-zinc-800 text-center mt-2">
              Successful Alumni
            </p>
          </div>
          <div className="flex items-center justify-center flex-col">
            <h3 className="text-5xl md:text-6xl font-bold text-[#0B2A4A]">
              {stats.placement}%
            </h3>
            <p className="text-sm md:text-md text-zinc-800 text-center mt-2">
              Placement Rate
            </p>
          </div>
          <div className="flex items-center justify-center flex-col">
            <h3 className="text-5xl md:text-6xl font-bold text-[#0B2A4A]">
              {stats.partners}+
            </h3>
            <p className="text-sm md:text-md text-zinc-800 text-center mt-2">
              Industry Partners
            </p>
          </div>
        </div>
      </div>
      <InstructorCarousel />
      <EventsShowcase />
    </>
  );
};

export default Home;
