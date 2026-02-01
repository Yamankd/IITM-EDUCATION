import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Home, BookOpen, Image, LogIn, Monitor } from "lucide-react";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hasShadow, setHasShadow] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // 1. Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // 2. Handle Scroll (Hide on scroll down, show on scroll up)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHasShadow(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${hasShadow ? "bg-[#0B2A4A]/90 backdrop-blur-md shadow-xl" : "bg-[#0B2A4A]"}`}
    >
      <div className="max-w-10xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 relative z-[110]">
          <img
            src={logo}
            alt="IITM Logo"
            className="w-12 h-12 md:w-14 md:h-14 object-contain"
          />
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {!localStorage.getItem("studentToken") && (
            <div className="flex items-center gap-8 text-white font-medium">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#D6A419]"
                    : "hover:text-[#D6A419] transition-colors"
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/course"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#D6A419]"
                    : "hover:text-[#D6A419] transition-colors"
                }
              >
                Courses
              </NavLink>

              <NavLink
                to="/gallery"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#D6A419]"
                    : "hover:text-[#D6A419] transition-colors"
                }
              >
                Gallery
              </NavLink>
            </div>
          )}

          {localStorage.getItem("studentToken") ? (
            <button
              onClick={() => {
                localStorage.removeItem("studentToken");
                localStorage.removeItem("studentInfo");
                window.location.href = "/";
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-all shadow-lg shadow-black/20 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/student/login"
              className="px-6 py-2 bg-[#D6A419] text-[#0B2A4A] rounded-full font-bold hover:bg-[#f0b922] transition-all shadow-lg shadow-black/20 active:scale-95"
            >
              Sign In
            </NavLink>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-white relative z-[110]"
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      />

      <div
        className={`fixed top-0 right-0 h-screen w-full bg-[#0B2A4A] z-[105] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Logo and Close Button */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="IITM Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close Menu"
            >
              <X size={30} />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar px-6 py-6">
            {!localStorage.getItem("studentToken") && (
              <>
                <MobileLink
                  to="/"
                  icon={<Home size={20} />}
                  label="Home"
                  onClick={toggleMenu}
                />

                <MobileLink
                  to="/course"
                  icon={<BookOpen size={20} />}
                  label="Courses"
                  onClick={toggleMenu}
                />

                <MobileLink
                  to="/gallery"
                  icon={<Image size={20} />}
                  label="Gallery"
                  onClick={toggleMenu}
                />
              </>
            )}
          </div>

          <div className="mt-auto pt-6 px-6 pb-8 border-t border-white/10">
            {localStorage.getItem("studentToken") ? (
              <button
                onClick={() => {
                  localStorage.removeItem("studentToken");
                  localStorage.removeItem("studentInfo");
                  window.location.href = "/";
                }}
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-500 text-white rounded-2xl font-bold active:scale-95 transition-transform"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/student/login"
                onClick={toggleMenu}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#D6A419] text-[#0B2A4A] rounded-2xl font-bold active:scale-95 transition-transform"
              >
                <LogIn size={20} />
                Sign In
              </NavLink>
            )}
            <p className="text-center text-gray-500 text-xs mt-4 italic">
              © 2026 Digital IITM
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper Component for Mobile Links
const MobileLink = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-xl transition-all ${
        isActive
          ? "bg-[#D6A419]/20 text-[#D6A419]"
          : "text-gray-300 hover:bg-white/5"
      }`
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default Navbar;
