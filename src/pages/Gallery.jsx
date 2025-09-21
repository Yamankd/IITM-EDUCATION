import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const gridItems = [
  { name: "SMART TONY", src: "#", color: "bg-red-500" },
  { name: "Leopard", src: "#", color: "bg-blue-500" },
  { name: "ABOUT US", src: null, color: "bg-green-500" },
  { name: "SUBSIDIZED BOARD", src: null, color: "bg-yellow-500" },
  { name: "Twitter Feed", src: null, color: "bg-purple-500" },
  { name: "OUR CREDO", src: "#", color: "bg-pink-500" },
  { name: "BOUNDARY", src: "#", color: "bg-indigo-500" },
  { name: "PINE", src: "#", color: "bg-gray-500" },
  { name: "AMOUR", src: "#", color: "bg-orange-500" },
  { name: "LAKESIDE", src: "#", color: "bg-teal-500" },
  { name: "DUMMY", src: null, color: "bg-fuchsia-500" },
  { name: "Motorcycle", src: "#", color: "bg-rose-500" },
  { name: "Pattern", src: "#", color: "bg-cyan-500" },
  { name: "SHARE NEWS", src: null, color: "bg-lime-500" },
  { name: "Robot", src: "#", color: "bg-amber-500" },
  { name: "BANANA", src: "#", color: "bg-violet-500" },
];

const Gallery = () => {
  const containerRef = useRef();

  useGSAP(
    () => {
      // Use gsap.from() for a clean entrance animation.
      gsap.from(".grid-item-gsap", {
        y: 100, // Start 100px below their final position
        opacity: 0, // Start completely transparent
        stagger: 0.1, // Stagger the animation of each item by 0.1 seconds
        duration: 0.8, // The duration of each item's animation
        ease: "power3.out", // Use a smooth easing function
      });
    },
    { scope: containerRef, revertOnUpdate: true } // Scopes the animation to the container and cleans up on re-renders
  );

  return (
    <div className="bg-[#0B2A4A] pt-20" style={{ minHeight: "100vh" }}>
      <div
        ref={containerRef}
        className="grid grid-cols-4 gap-4 mx-auto p-4 max-w-7xl"
      >
        {gridItems.map((item, index) => (
          <div
            key={index}
            className={`
              grid-item-gsap 
              ${item.color} 
              flex justify-center items-center 
              text-white font-bold text-center 
              p-4 rounded-md shadow-lg
              ${item.name === "SMART TONY" ? "col-span-2 row-span-2" : ""}
              ${item.name === "LAKESIDE" ? "col-span-2 row-span-2" : ""}
              ${item.name === "Pattern" ? "col-span-2" : ""}
              ${item.name === "Twitter Feed" ? "row-span-2" : ""}
            `}
          >
            {item.src ? (
              <div className="w-full h-full flex justify-center items-center">
                <span className="text-xl">{item.name}</span>
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <h3 className="text-xl">{item.name}</h3>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
