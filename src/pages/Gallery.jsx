import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const gridItems = [
  {
    name: "SMART TONY",
    src: "https://i.pinimg.com/1200x/19/fc/fb/19fcfbb5debcb7d95a5f73a556a54b39.jpg",
  },
  {
    name: "Leopard",
    src: "https://i.pinimg.com/1200x/47/da/2d/47da2d09a9bb2394dd764adc789ab193.jpg",
  },
  {
    name: "ABOUT US",
    src: "https://i.pinimg.com/736x/f6/d6/d0/f6d6d040430fd8f2ad22433f484097cb.jpg",
  },
  {
    name: "SUBSIDIZED BOARD",
    src: "https://i.pinimg.com/736x/53/8d/a9/538da97ebccd34bd14d0f1d04d4a29c3.jpg",
  },
  {
    name: "Twitter Feed",
    src: "https://i.pinimg.com/736x/0d/8c/f6/0d8cf6d416a8e2683ef77f1f12f397fb.jpg",
  },
  {
    name: "OUR CREDO",
    src: "https://i.pinimg.com/736x/ba/68/79/ba6879befda4c03360f8bcae238bd614.jpg",
  },
  {
    name: "BOUNDARY",
    src: "https://i.pinimg.com/736x/ad/dc/ca/addccaf0bf3ffc7a5d899e00f33bbe48.jpg",
  },
  {
    name: "PINE",
    src: "https://i.pinimg.com/736x/b2/1e/21/b21e2138327dc1623cfc479810049d1e.jpg",
  },
  {
    name: "AMOUR",
    src: "https://i.pinimg.com/736x/b2/1e/21/b21e2138327dc1623cfc479810049d1e.jpg",
  },
  {
    name: "LAKESIDE",
    src: "https://i.pinimg.com/736x/f0/51/f8/f051f8b1d4831d2a3089f3add9ed26e5.jpg",
  },
  {
    name: "DUMMY",
    src: "https://i.pinimg.com/736x/67/93/eb/6793eb18e70311ae8ff451596133ffb9.jpg",
  },
  {
    name: "Motorcycle",
    src: "https://i.pinimg.com/736x/27/fd/32/27fd3208e9ccc2286bdb457b51f8fee5.jpg",
  },
  {
    name: "Pattern",
    src: "https://i.pinimg.com/736x/21/ec/cb/21eccb05f73cbf266193bd3288bbe4bf.jpg",
  },
  {
    name: "SHARE NEWS",
    src: "https://i.pinimg.com/1200x/1e/18/42/1e184225a4a3cb0b2c31cf2f49f5e9b0.jpg",
  },
  {
    name: "Robot",
    src: "https://i.pinimg.com/736x/2e/27/b7/2e27b7fdb359646f478966435744a0c2.jpg",
  },
  {
    name: "BANANA",
    src: "https://i.pinimg.com/736x/68/6b/43/686b4353afe7563c1c54f725c0d2fa41.jpg",
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
    </div>
  );
};

export default Gallery;
