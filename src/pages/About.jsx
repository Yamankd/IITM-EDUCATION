import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[80vh] mt-[5%] bg-[#0B2A4A] px-6 text-center space-y-10 relative overflow-hidden">
        {/* Decorative Gold Glow (background) */}
        <div className="absolute w-90 h-80 bg-[#ffbb00] rounded-full blur-3xl opacity-20 top-20 left-1/2 -translate-x-1/2 animate-bounce"></div>

        {/* Main Quote */}
        <motion.h2
          className="text-3xl md:text-5xl font-extrabold text-white leading-snug max-w-4xl relative z-10"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          “Learn today, lead tomorrow —
          <motion.span
            className="text-[#D6A419] drop-shadow-md"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {" "}
            with the power of computers in your hands.
          </motion.span>
          ”
        </motion.h2>

        {/* Divider */}
        <motion.div
          className="w-32 h-1 bg-gradient-to-r from-transparent via-[#D6A419] to-transparent rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        ></motion.div>
      </div>

      {/* --------------------------------------------------------------------------------- */}

      <motion.h1
        className="text-4xl md:text-5xl bg-[#0B2A4A] font-bold text-center text-[#D6A419] leading-tight"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        About Us
      </motion.h1>
      {/* ------------------------------------------------ */}
      <div className="bg-[#0B2A4A] text-white min-h-screen flex flex-col md:flex-row items-stretch justify-between px-6 md:px-16 py-12 gap-10">
        {/* Image Section */}
        {/* <div className="md:w-1/2 flex items-center"> */}
        {/* <motion.img
            src="#"
            alt="Computer Coaching"
            className="rounded-xl shadow-2xl w-full h-full object-cover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          /> */}
        {/* </div> */}

        {/* Text Section */}

        <div className="md:w-full text-center flex flex-col justify-center space-y-6">
          <motion.h2
            className="text-2xl md:text-3xl font-semibold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Welcome To IITM COMPUTER EDUCATION
          </motion.h2>

          <motion.p
            className="text-lg text-white/80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            At{" "}
            <span className="font-semibold text-[#D6A419]">
              IITM Computer Education
            </span>
            , we believe in transforming dreams into reality by empowering
            students with the skills needed to excel in today’s competitive
            world. Since 2010, we’ve been a trusted name in computer education,
            offering courses from basic computing to advanced technologies.
          </motion.p>

          <motion.p
            className="text-lg text-white/80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Our mission is to provide{" "}
            <span className="font-bold text-[#D6A419]">
              practical, industry-focused training
            </span>{" "}
            that bridges the gap between academics and real-world application.
            With experienced instructors, cutting-edge tools, and a hands-on
            approach, we ensure students are career-ready from day one.
          </motion.p>

          <motion.p
            className="text-lg text-white/80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Explore our{" "}
            <span className="font-bold text-[#D6A419]">Trending Courses</span>{" "}
            such as Python, Advanced Excel, AutoCAD, and Data Analytics,
            designed to cater to diverse industries. Dive into our Library
            Resources, packed with coding, design, and professional development
            materials.
          </motion.p>

          <motion.blockquote
            className="text-xl italic font-medium border-l-4 border-[#D6A419] pl-4 text-amber-300/90 mt-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            “Learning computers is not just about the future — it’s about
            unlocking your potential today.”
          </motion.blockquote>
        </div>
      </div>
      {/* ---------------------------------------------- */}
      <div className="flex flex-col items-center justify-center bg-[#0B2A4A] px-6 py-16 text-center space-y-8 relative overflow-hidden">
        <motion.p
          className="text-xl md:text-3xl font-semibold leading-relaxed max-w-3xl text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
        >
          We don’t just teach computers —{" "}
          <span className="text-[#D6A419]">
            we inspire confidence to create your digital future.
          </span>
        </motion.p>
      </div>
    </>
  );
};

export default About;
