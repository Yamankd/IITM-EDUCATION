import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { color } from "framer-motion";

const gridItems = [
  {
    name: "SMART TONY",
    src: "#",
  },
  {
    name: "Leopard",
    src: "#",
  },
  {
    name: "ABOUT US",
    src: "#",
  },
  {
    name: "SUBSIDIZED BOARD",
    src: "#",
  },
  {
    name: "Twitter Feed",
    src: "#",
  },
  {
    name: "OUR CREDO",
    src: "#",
  },
  {
    name: "BOUNDARY",
    src: "#",
  },
  {
    name: "PINE",
    src: "#",
  },
  {
    name: "AMOUR",
    src: "#",
  },
  {
    name: "LAKESIDE",
    src: "#",
  },
  {
    name: "DUMMY",
    src: "#",
  },
  {
    name: "Motorcycle",
    src: "#",
  },
  {
    name: "Pattern",
    src: "#",
  },
  {
    name: "SHARE NEWS",
    src: "#",
  },
  {
    name: "Robot",
    src: "#",
  },
  {
    name: "BANANA",
    src: "#",
  },
];

const Gallery = () => {
  const containerRef = useRef();

  // GSAP diagonal entry animation
  useGSAP(
    () => {
      gsap.from(".masonry-item", {
        x: -80,
        y: -80,
        opacity: 0,
        stagger: 0.2,
        duration: 0.9,
        ease: "power3.out",
      });
    },
    { scope: containerRef, revertOnUpdate: true }
  );

  return (
    <div className="bg-[#0B2A4A] pt-20 min-h-screen">
      <div
        ref={containerRef}
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4 max-w-7xl mx-auto"
      >
        {gridItems.map((item, index) => (
          <div
            key={index}
            className="masonry-item relative mb-4 break-inside-avoid overflow-hidden
                       rounded-xl border border-white/30
                       transition-shadow duration-300 hover:shadow-[2px_1px_5px_rgba(255,255,255,0.4)]"
          >
            <LazyLoadImage
              src={item.src}
              alt={item.name}
              effect="blur"
              className="w-full h-full object-cover rounded-xl
                         transform transition-transform duration-500 ease-in-out
                         hover:scale-105"
            />
          </div>
        ))}
      </div>
      <hr style={{ color: "#364153", width: "98%", margin: "auto" }} />
    </div>
  );
};

export default Gallery;
