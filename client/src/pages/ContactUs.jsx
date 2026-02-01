import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Clock,
  Linkedin,
  Facebook,
  Instagram,
  CheckCircle,
  AlertCircle,
  Building2,
  ChevronDown,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";

const branches = [
  {
    id: "IITM MATHURA",
    title: "New Bus Stand,Mathura",
    address: "Shivpuri New Bus Stand, Mathura, UP 281001",
    phone: "+91 - 8899251616",
    email: "iitm.mathura@gmail.com",
    hours: "Mon-Sat: 8am - 8pm",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3539.497184288636!2d77.66986631506297!3d27.49132598288544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397371a5c6020df9%3A0x6a0c5c3632906b3!2sIITM%20Group%20of%20Institutions!5e0!3m2!1sen!2sin!4v1645511525000!5m2!1sen!2sin",
  },
  {
    id: "IITM LAXMI NAGAR",
    title: "Laxmi Nagar,Mathura",
    address: "First floor, rajkaran market, baldev road, Mathura, UP, 281204",
    phone: "+91 - 7017169810",
    email: "iitm.laxminagar@gmail.com",
    hours: "Mon-Sat: 9am - 6pm",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56778.60475373322!2d78.0000!3d27.1767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39740d857c2f41d9%3A0x784aef38a9523b42!2sAgra%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1645511525000!5m2!1sen!2sin",
  },
  {
    id: "IITM TOWNSHIP",
    title: "Township Mathura",
    address: "Near sadabaad bus stand, Township,Mathura, UP, 281006",
    phone: "+91 - 6396761616",
    email: "iitm.township@gmail.com",
    hours: "Mon-Fri: 9am - 5pm",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754721313!3d28.52761036066793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1645511525000!5m2!1sen!2sin",
  },
];

const ContactUs = () => {
  const [activeBranch, setActiveBranch] = useState(branches[0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    branch: branches[0].title,
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Preload map to avoid flicker
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = activeBranch.map;
  }, [activeBranch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      await api.post("/leads", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `[Branch: ${formData.branch}] ${formData.message}`,
        type: "contact_form",
      });
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        branch: activeBranch.title,
        message: "",
      });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message || "Failed to send message.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#0B2A4A] relative overflow-x-hidden selection:bg-[#D6A419] selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#0B2A4A] to-transparent" />
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-[#D6A419]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 pt-24 pb-20 text-center text-[#0B2A4A] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-[#0B2A4A]/5 backdrop-blur-md border border-[#0B2A4A]/10 text-sm font-semibold tracking-wide mb-6 text-[#D6A419]">
            24/7 SUPPORT AVAILABLE
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Let's Start a <br />
            <span className="text-[#D6A419] drop-shadow-sm">Conversation</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you have questions about our courses or just want to say
            hello, we'd love to hear from you.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pb-24 relative z-20 -mt-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[750px] border border-gray-100">
          {/* LEFT COLUMN: Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
            {/* Subtle form pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[4rem] -z-0" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2 text-[#0B2A4A]">
                Send a Message
              </h2>
              <p className="text-gray-500 mb-10">
                We usually respond within 24 hours.
              </p>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 text-green-900 p-10 rounded-3xl text-center border border-green-100 flex flex-col items-center justify-center h-full min-h-[400px]"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-sm animate-bounce">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Message Sent!</h3>
                  <p className="mb-8 text-gray-600 max-w-md">
                    Thank you for reaching out. One of our admissions counselors
                    will contact you shortly.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-8 py-3 bg-[#0B2A4A] text-white rounded-full hover:bg-opacity-90 transition shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#D6A419] focus:ring-4 focus:ring-[#D6A419]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-800"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#D6A419] focus:ring-4 focus:ring-[#D6A419]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-800"
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#D6A419] focus:ring-4 focus:ring-[#D6A419]/10 outline-none transition-all placeholder-gray-400 font-medium text-gray-800"
                      placeholder="e.g. john@example.com"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                      Interested Campus
                    </label>
                    <div className="relative">
                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#D6A419] focus:ring-4 focus:ring-[#D6A419]/10 outline-none transition-all appearance-none cursor-pointer font-medium text-gray-800"
                      >
                        {branches.map((b) => (
                          <option key={b.id} value={b.title}>
                            {b.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={20}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                      Your Message
                    </label>
                    <textarea
                      required
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#D6A419] focus:ring-4 focus:ring-[#D6A419]/10 outline-none transition-all placeholder-gray-400 resize-none font-medium text-gray-800"
                      placeholder="Tell us how we can help..."
                    ></textarea>
                  </div>

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100"
                    >
                      <AlertCircle size={20} />
                      <p className="font-medium">{errorMessage}</p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-4 text-white font-bold text-lg rounded-xl bg-gradient-to-r from-[#0B2A4A] to-blue-900 hover:from-blue-900 hover:to-[#0B2A4A] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-3"
                  >
                    {status === "submitting" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        Send Message <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Info (5 cols) */}
          <div className="lg:col-span-5 bg-gray-50 p-8 md:p-12 border-l border-gray-100 flex flex-col relative overflow-hidden">
            {/* Background pattern for right column */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6A419]/5 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10 h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-8 text-[#0B2A4A] flex items-center gap-3">
                <Globe size={24} className="text-[#D6A419]" />
                Campus Details
              </h2>

              {/* Branch Selector Tabs */}
              <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-x-auto scrollbar-none snap-x">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => {
                      setActiveBranch(branch);
                      setFormData((prev) => ({
                        ...prev,
                        branch: branch.title,
                      }));
                    }}
                    className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap snap-center relative z-10 ${
                      activeBranch.id === branch.id
                        ? "text-white shadow-md"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {activeBranch.id === branch.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#0B2A4A] rounded-xl -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    {branch.title.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Info Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBranch.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col gap-6"
                >
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 group hover:border-[#D6A419]/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Visit Us
                        </h3>
                        <p className="text-lg font-semibold text-gray-800 leading-snug">
                          {activeBranch.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <a
                      href={`tel:${activeBranch.phone}`}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50 flex items-center gap-4 hover:shadow-md hover:border-green-200 transition-all group"
                    >
                      <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-100 transition-colors">
                        <Phone size={22} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                          Call Us
                        </h3>
                        <p className="font-semibold text-gray-800">
                          {activeBranch.phone}
                        </p>
                      </div>
                    </a>

                    <a
                      href={`mailto:${activeBranch.email}`}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50 flex items-center gap-4 hover:shadow-md hover:border-orange-200 transition-all group"
                    >
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100 transition-colors">
                        <Mail size={22} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                          Email
                        </h3>
                        <p className="font-semibold text-gray-800">
                          {activeBranch.email}
                        </p>
                      </div>
                    </a>
                  </div>

                  <div className="bg-[#0B2A4A] text-white p-8 rounded-[2rem] shadow-xl mt-auto relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-32 bg-[#D6A419] rounded-full blur-[80px] opacity-20 -mr-16 -mt-16 group-hover:opacity-30 transition-opacity" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                          <Clock size={20} className="text-[#D6A419]" />
                        </div>
                        <h3 className="text-[#D6A419] font-bold tracking-wide uppercase text-sm">
                          Working Hours
                        </h3>
                      </div>
                      <p className="text-3xl font-bold mb-1">
                        {activeBranch.hours}
                      </p>
                      <p className="text-white/60 font-medium">
                        Closed on Sundays
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-2 justify-center">
                    {[
                      { Icon: Linkedin, href: "#" },
                      { Icon: Facebook, href: "#" },
                      { Icon: Instagram, href: "#" },
                    ].map(({ Icon, href }, idx) => (
                      <a
                        key={idx}
                        href={href}
                        className="p-3 bg-white text-gray-400 hover:text-[#0B2A4A] hover:bg-white hover:shadow-md rounded-xl transition-all border border-gray-100"
                      >
                        <Icon size={20} />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Map Section */}
      <div className="w-full h-[600px] bg-gray-100 relative grayscale-[100%] hover:grayscale-0 transition-all duration-1000">
        <iframe
          src={activeBranch.map}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Campus Location"
        ></iframe>

        {/* Map Overlay Badge */}
        <div className="absolute bottom-10 left-10 md:left-20 bg-white/95 backdrop-blur-xl px-8 py-6 rounded-3xl shadow-2xl border border-white max-w-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-[#0B2A4A] rounded-full text-white shadow-lg">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#0B2A4A]">Find Us Here</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                {activeBranch.title}
              </p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Visit our state-of-the-art campus. We're always excited to meet
            future innovators.
          </p>
          <a
            href={activeBranch.map}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-[#D6A419] font-bold hover:underline"
          >
            View on Google Maps <ChevronDown className="-rotate-90" size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
