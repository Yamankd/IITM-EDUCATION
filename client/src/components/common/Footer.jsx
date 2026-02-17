import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import api from "../../api/api";
import logo from "../../assets/logo.png";

const Footer = () => {
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState([]);
  const [footerInfo, setFooterInfo] = useState({
    footerText: `© ${new Date().getFullYear()} IITM Computer Education. All rights reserved.`,
    footerLogoUrl: "",
  });
  const [footerData, setFooterData] = useState({
    description: "",
    quickLinks: [],
    courses: [],
  });
  const [contactInfo, setContactInfo] = useState({
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (data.success) {
          // Branding
          if (data.data.branding) {
            const { socialLinks, footerText, footerLogoUrl } =
              data.data.branding;
            if (socialLinks) setSocialLinks(socialLinks);
            if (footerText) setFooterInfo((prev) => ({ ...prev, footerText }));
            if (footerLogoUrl)
              setFooterInfo((prev) => ({ ...prev, footerLogoUrl }));
          }
          // Footer Content
          if (data.data.footer) {
            setFooterData((prev) => ({ ...prev, ...data.data.footer }));
          }
          // Contact Info
          if (data.data.content?.contactInfo) {
            setContactInfo((prev) => ({
              ...prev,
              ...data.data.content.contactInfo,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load footer settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <footer className="bg-[#0B2A4A] text-white pt-12 pb-6 border-t border-white/10 animate-pulse">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#0B2A4A] text-white pt-12 pb-6 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <NavLink
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-[#D6A419]"
            >
              {footerInfo.footerLogoUrl ? (
                <img
                  src={footerInfo.footerLogoUrl}
                  alt="IITM Logo"
                  className="h-10 object-contain"
                />
              ) : (
                <span>IITM Computer Education</span>
              )}
            </NavLink>
            <p className="text-gray-300 pt-4 leading-relaxed">
              {footerData.description}
            </p>

            {/* Dynamic Social Links */}
            <div className="flex space-x-4 pt-4">
              {socialLinks &&
                socialLinks.length > 0 &&
                socialLinks.map((link, index) => {
                  const IconComponent =
                    {
                      Facebook,
                      Twitter,
                      Linkedin,
                      Instagram,
                      Youtube,
                      MapPin,
                      Phone,
                      Mail,
                    }[link.icon] || Globe;

                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-[#D6A419] transition-transform hover:scale-110"
                      title={link.platform}
                    >
                      <IconComponent size={24} />
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#D6A419]">Quick Links</h3>
            <ul className="space-y-2">
              {footerData.quickLinks && footerData.quickLinks.length > 0 ? (
                footerData.quickLinks.map((link, index) => (
                  <li key={index}>
                    <NavLink
                      to={link.path}
                      onClick={scrollToTop}
                      className="text-gray-300 hover:text-[#D6A419] transition-colors flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-[#D6A419] rounded-full"></span>
                      {link.name}
                    </NavLink>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">
                  No quick links available
                </li>
              )}
            </ul>
          </div>

          {/* Courses */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#D6A419]">Our Courses</h3>
            <ul className="space-y-2">
              {footerData.courses && footerData.courses.length > 0 ? (
                footerData.courses.map((course, index) => (
                  <li key={index}>
                    <NavLink
                      to={course.path}
                      onClick={scrollToTop}
                      className="text-gray-300 hover:text-[#D6A419] transition-colors flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-[#D6A419] rounded-full"></span>
                      {course.name}
                    </NavLink>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">No courses added yet</li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#D6A419]">Contact Us</h3>
            <div className="space-y-3">
              {contactInfo.address && (
                <div className="flex items-start space-x-3 group">
                  <MapPin className="w-5 h-5 mt-1 text-[#D6A419] group-hover:animate-bounce" />
                  <p className="text-gray-300">{contactInfo.address}</p>
                </div>
              )}
              {contactInfo.phone && (
                <div className="flex items-center space-x-3 group">
                  <Phone className="w-5 h-5 text-[#D6A419] group-hover:shake" />
                  <p className="text-gray-300">{contactInfo.phone}</p>
                </div>
              )}
              {contactInfo.email && (
                <div className="flex items-center space-x-3 group">
                  <Mail className="w-5 h-5 text-[#D6A419]" />
                  <p className="text-gray-300">{contactInfo.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center text-gray-400">
          <p>{footerInfo.footerText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
