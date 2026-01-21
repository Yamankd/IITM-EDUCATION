import React from "react";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const images = [
  "/images/img1.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/img4.jpg",
  "/images/img5.jpg",
  "/images/img6.jpg",
  "/images/img7.jpg",
  "/images/img8.jpg",
  "/images/img9.jpg",
  "/images/img10.jpg",
];

const About = () => {
  return (
    <div className="bg-[#0B2A4A] min-h-screen text-white overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative py-24 flex flex-col items-center text-center px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D6A419] rounded-full blur-[150px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D6A419] rounded-full blur-[150px] opacity-10 pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            “Learn today, lead tomorrow — <br className="hidden md:block" />
            <span className="text-[#D6A419]">with the power of computers.</span>
            ”
          </h1>
          <div className="w-24 h-1 bg-[#D6A419] mx-auto rounded-full mb-8" />
        </motion.div>

        {/* Infinite Image Marquee */}
        <div className="w-full max-w-[100vw] overflow-hidden py-12">
          <motion.div
            className="flex gap-8 w-max"
            animate={{ x: [0, -1035] }} // Seamless loop value dependent on width, approximated
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {[...images, ...images].map((src, idx) => (
              <div
                key={idx}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#D6A419]/30 overflow-hidden flex-shrink-0 shadow-lg"
              >
                <img
                  src={src}
                  alt="Gallery"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#D6A419] rounded-2xl rotate-3 opacity-20 transform scale-105" />
            <img
              src="/your-image-path.jpg"
              alt="About Us"
              className="relative rounded-2xl shadow-2xl w-full object-cover border border-white/10 aspect-square"
            />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-[#D6A419] font-bold tracking-wider text-sm uppercase mb-2">
                About Us
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome To Digital IITM
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                At{" "}
                <span className="text-[#D6A419] font-semibold">
                  Digital IITM
                </span>
                , we believe in transforming dreams into reality. Since 2010,
                we’ve been a trusted name, offering courses from basic computing
                to advanced technologies.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#D6A419]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#D6A419] text-xl">🎯</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Our Mission</h4>
                  <p className="text-gray-400">
                    To provide practical, industry-focused training that ensures
                    career readiness from day one.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#D6A419]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#D6A419] text-xl">💡</span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Our Vision</h4>
                  <p className="text-gray-400">
                    Unlocking potential through accessible, high-quality
                    computer education for everyone.
                  </p>
                </div>
              </div>
            </div>

            <blockquote className="border-l-4 border-[#D6A419] pl-6 italic text-xl text-gray-300">
              "Learning computers is not just about the future — it’s about
              unlocking your potential today."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Footer / Closing */}
      <section className="py-20 text-center px-4 bg-[#09223a]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold max-w-3xl mx-auto leading-normal">
            We don’t just teach technology — <br />
            <span className="text-[#D6A419]">
              we inspire confidence to create your digital future.
            </span>
          </h2>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
