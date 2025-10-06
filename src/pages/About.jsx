import React from "react";
import { motion } from "framer-motion";
import { section } from "framer-motion/client";

// REFACTORED: Animation variants for cleaner JSX and easier management.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Animates children one after another
      duration: 0.8,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Component for the main hero quote
const HeroQuote = () => (
  <section className="flex flex-col items-center justify-center py-50 min-h-[80vh] px-6 text-center space-y-10 relative overflow-hidden">
    {/* Decorative Gold Glow (background) */}
    <div className="absolute w-90 h-80 bg-[#ffbb00] rounded-full blur-3xl opacity-20 top-20 left-1/2 -translate-x-1/2 animate-bounce" />

    <motion.h1
      className="text-3xl md:text-5xl font-extrabold text-white leading-snug max-w-4xl relative z-10"
      variants={fadeInUp}
    >
      “Learn today, lead tomorrow —
      <motion.span
        className="text-[#D6A419] drop-shadow-md"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {" "}
        with the power of computers in your hands.
      </motion.span>
      ”
    </motion.h1>
    <motion.div
      className="w-32 h-1 bg-gradient-to-r from-transparent via-[#D6A419] to-transparent"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    />
  </section>
);

// //image animation of the founder of the coaching.
const imageAnimation = {
  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 1, type: "spring", stiffness: 80 },
  },
};

// Component for the core "About Us" content
const CoreContent = () => (
  <section className="px-6  flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20">
    {/* Image Section */}
    <motion.div
      className="flex justify-center items-center w-full md:w-1/2"
      variants={imageAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <img
        src="/your-image-path.jpg"
        alt="Beautiful scenery"
        className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full shadow-2xl border-4 border-[#D6A419]"
      />
    </motion.div>

    {/* Text Section */}
    <div className="w-full md:w-1/2 text-center md:text-left flex flex-col items-center md:items-start justify-center space-y-6">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-[#D6A419]"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        About Us
      </motion.h2>

      <motion.h3
        className="text-2xl md:text-3xl font-semibold text-white"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        Welcome To IITM COMPUTER EDUCATION
      </motion.h3>

      <motion.p
        className="text-lg text-white/80 leading-relaxed max-w-3xl"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        At{" "}
        <span className="font-semibold text-[#D6A419]">
          IITM Computer Education
        </span>
        , we believe in transforming dreams into reality. Since 2010, we’ve been
        a trusted name, offering courses from basic computing to advanced
        technologies.
      </motion.p>

      <motion.p
        className="text-lg text-white/80 leading-relaxed max-w-3xl"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        Our mission is to provide{" "}
        <span className="font-bold text-[#D6A419]">
          practical, industry-focused training
        </span>
        . With experienced instructors and a hands-on approach, we ensure
        students are career-ready from day one.
      </motion.p>

      <motion.blockquote
        className="text-xl italic font-medium border-l-4 border-[#D6A419] pl-4 text-amber-300/90 mt-6 max-w-3xl"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        “Learning computers is not just about the future — it’s about unlocking
        your potential today.”
      </motion.blockquote>
    </div>
  </section>
);

// Component for the closing statement
const ClosingStatement = () => (
  <section className="px-6 py-16 text-center">
    <motion.p
      className="text-xl md:text-3xl font-semibold leading-relaxed max-w-3xl mx-auto"
      variants={scaleIn}
    >
      We don’t just teach computers —{" "}
      <span className="text-[#D6A419]">
        we inspire confidence to create your digital future.
      </span>
    </motion.p>
  </section>
);

const About = () => {
  return (
    // STRUCTURE: A single <main> container for better semantics and styling.
    <motion.main
      className="bg-[#0B2A4A] text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <HeroQuote />
      {/* <Photo /> */}
      <CoreContent />
      <ClosingStatement />
    </motion.main>
  );
};

export default About;
