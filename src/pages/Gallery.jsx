// import React, { useEffect, useRef } from "react";
// import { gsap } from "gsap";

// // Array with only title and direct image src
// const galleryData = [
//   {
//     title: "A Mountain",
//     src: "https://i.pinimg.com/736x/e7/f9/b2/e7f9b22cb6764147a9f65b3302831c0b.jpg",
//   },
//   {
//     title: "Traveling",
//     src: "https://i.pinimg.com/1200x/40/28/49/4028490c2454e3c6832e8dfa1a34ff35.jpg",
//   },
//   {
//     title: "Party Jokes",
//     src: "https://i.pinimg.com/736x/9b/81/a0/9b81a0ec7f5d79954c97cf0437f50f3e.jpg",
//   },
//   {
//     title: "Maui",
//     src: "https://i.pinimg.com/736x/c9/31/9d/c9319db31c9c18f9577cbe191b66dd3b.jpg",
//   },
//   {
//     title: "Man oceans",
//     src: "https://i.pinimg.com/1200x/45/87/d2/4587d27dc504746c6c04931312851edc.jpg",
//   },
//   {
//     title: "Barcelona",
//     src: "https://i.pinimg.com/1200x/86/55/b3/8655b31db3d3be0039b0ff5e9da03ef8.jpg",
//   },
//   {
//     title: "A Guide",
//     src: "https://i.pinimg.com/1200x/89/e2/b9/89e2b9870b7d3c03da5a28d40696f534.jpg",
//   },
//   {
//     title: "Party",
//     src: "https://i.pinimg.com/736x/a2/78/c5/a278c56ac2e76b9199e886ad3fd45af0.jpg",
//   },
//   {
//     title: "Around The Island",
//     src: "https://i.pinimg.com/1200x/78/cd/d7/78cdd71d2e0a14ff173aefd5b803797e.jpg",
//   },
//   {
//     title: "the shore.",
//     src: "https://i.pinimg.com/1200x/3f/c8/64/3fc864a832cc6d115a13bd33d22f860a.jpg",
//   },
// ];

// const Gallery = () => {
//   const galleryRef = useRef([]);

//   useEffect(() => {
//     gsap.from(galleryRef.current, {
//       opacity: 0,
//       y: 50,
//       stagger: 0.2,
//       duration: 0.8,
//       ease: "power3.out",
//     });
//   }, []);

//   return (
//     <div
//       className="gallery-container"
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//         gap: "10px",
//         padding: "20px",
//       }}
//     >
//       {galleryData.map((item, index) => (
//         <div
//           key={index}
//           ref={(el) => (galleryRef.current[index] = el)}
//           className="gallery-item"
//           style={{
//             position: "relative",
//             overflow: "hidden",
//             borderRadius: "15px",
//             cursor: "pointer",
//             minHeight: "200px",
//             background: "#eee",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <img src={item.src} alt={item.title} />
//           <div
//             style={{
//               position: "absolute",
//               bottom: "10px",
//               left: "10px",
//               color: "#fff",
//               background: "rgba(0,0,0,0.5)",
//               //   padding: "5px 10px",
//               borderRadius: "8px",
//               fontSize: "14px",
//             }}
//           >
//             {item.title}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Gallery;

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
