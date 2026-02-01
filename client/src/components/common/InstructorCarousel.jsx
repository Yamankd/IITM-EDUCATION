// components/InstructorCarousel.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import api from "../../api/api";
import { FaLinkedinIn } from "react-icons/fa";

// ================= CONSTANTS =================
const AUTO_SCROLL_DELAY = 3000;
const TRANSITION_DURATION = 500;

// ================= FALLBACK DATA =================
// Removed per user request

const InstructorCarousel = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [cardWidth, setCardWidth] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const autoScrollRef = useRef(null);
  const cardRef = useRef(null);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await api.get("/instructors");
        setInstructors(res.data || []);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        setInstructors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  // ================= MEMOIZED DATA =================
  const effectiveInstructors = useMemo(() => {
    if (instructors.length > 0 && instructors.length < 4) {
      return [...instructors, ...instructors, ...instructors];
    }
    return instructors;
  }, [instructors]);

  const displayInstructors = useMemo(() => {
    if (!effectiveInstructors.length) return [];
    return [
      effectiveInstructors[effectiveInstructors.length - 1],
      ...effectiveInstructors,
      effectiveInstructors[0],
    ];
  }, [effectiveInstructors]);

  // ================= CARD WIDTH =================
  useEffect(() => {
    if (!instructors.length) return;

    const measure = () => {
      if (!cardRef.current) return;
      const style = getComputedStyle(cardRef.current);
      const margin =
        parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      setCardWidth(cardRef.current.offsetWidth + margin);
    };

    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(measure);
      return () => cancelAnimationFrame(raf2);
    });

    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf1);
      window.removeEventListener("resize", measure);
    };
  }, [instructors.length]);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    if (!instructors.length) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(autoScrollRef.current);
  }, [instructors.length]);

  // ================= INFINITE LOOP =================
  useEffect(() => {
    if (!displayInstructors.length) return;

    if (currentIndex === 0) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(effectiveInstructors.length);
      }, TRANSITION_DURATION);
    }

    if (currentIndex === displayInstructors.length - 1) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(1);
      }, TRANSITION_DURATION);
    }
  }, [currentIndex, displayInstructors.length, effectiveInstructors.length]);

  useEffect(() => {
    if (!transitionEnabled) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setTransitionEnabled(true)),
      );
    }
  }, [transitionEnabled]);

  const handlePrev = () => transitionEnabled && setCurrentIndex((p) => p - 1);
  const handleNext = () => transitionEnabled && setCurrentIndex((p) => p + 1);

  const handleMouseEnter = () => clearInterval(autoScrollRef.current);
  const handleMouseLeave = () => {
    autoScrollRef.current = setInterval(handleNext, AUTO_SCROLL_DELAY);
  };

  const activeDotIndex =
    (currentIndex - 1 + effectiveInstructors.length) %
    effectiveInstructors.length;

  if (loading) {
    return (
      <div className="bg-[#D6A419] py-12 text-center text-white">
        Loading Instructors...
      </div>
    );
  }

  return (
    <div
      className="bg-[#D6A419] py-12 px-4 md:px-15"
      role="region"
      aria-label="Instructor Carousel"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#0B2A4A] mb-8">
          Our Instructors
        </h2>

        <div
          className="overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}px)`,
              transition: transitionEnabled
                ? `transform ${TRANSITION_DURATION}ms ease-in-out`
                : "none",
            }}
          >
            {displayInstructors.map((instructor, index) => (
              <div
                key={`${instructor.name}-${index}`}
                ref={index === 1 ? cardRef : null}
                className="bg-[#0B2A4A] rounded-lg shadow-md p-6 w-60 mx-[8px] flex-shrink-0 text-center"
              >
                <div className="border-4 h-28 w-28 md:h-[150px] md:w-[150px] border-white rounded-full overflow-hidden mx-auto">
                  <img
                    src={
                      instructor.image ||
                      instructor.avatar ||
                      instructor.profileImage ||
                      "/fallback.png"
                    }
                    alt={instructor.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex justify-center mt-4 gap-4 text-white">
                  {instructor.social?.linkedin && (
                    <a
                      href={instructor.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-amber-400 transition-colors"
                    >
                      <FaLinkedinIn size={20} />
                    </a>
                  )}
                </div>

                <h3 className="text-lg font-semibold mt-4 text-white">
                  {instructor.name}
                </h3>
                <p className="text-sm text-amber-400">
                  {instructor.role || "Instructor"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {effectiveInstructors.map((_, index) => (
            <button
              key={index}
              onClick={() => transitionEnabled && setCurrentIndex(index + 1)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full ${
                index === activeDotIndex ? "bg-[#0B2A4A]" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorCarousel;
