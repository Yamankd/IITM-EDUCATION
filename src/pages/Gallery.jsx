import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// NOTE: In a real app, this data would likely come from an API.
// Positions are in 'rem' units for responsive scaling.
const imageData = [
    { id: 1, src: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800", alt: "Motorbike on a scenic road", pos: { x: 10, y: 5 }, rot: -10 },
    { id: 2, src: "https://images.unsplash.com/photo-1583244275333-25a212263749?q=80&w=800", alt: "Vintage car", pos: { x: 40, y: 15 }, rot: 5 },
    { id: 3, src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800", alt: "Black sports car", pos: { x: -20, y: 25 }, rot: 15 },
    { id: 4, src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800", alt: "Yellow sports car", pos: { x: 70, y: -10 }, rot: -5 },
    { id: 5, src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800", alt: "Blue sports car", pos: { x: 25, y: 60 }, rot: 20 },
    { id: 6, src: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=800", alt: "White sports car", pos: { x: -30, y: -15 }, rot: -8 },
    { id: 7, src: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=800", alt: "Classic red car", pos: { x: 90, y: 40 }, rot: 12 },
    { id: 8, src: "https://images.unsplash.com/photo-1542281286-9e0e16bb7366?q=80&w=800", alt: "Red sports car", pos: { x: -50, y: 50 }, rot: -15 },
    { id: 9, src: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=800", alt: "Pink vintage car", pos: { x: 120, y: 10 }, rot: 10 },
];

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;

const Gallery = () => {
    const canvasRef = useRef(null);
    const [showInstructions, setShowInstructions] = useState(true);

    // Using MotionValues for performance. These don't trigger React re-renders.
    const scale = useMotionValue(1);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Hide instructions after a delay
    useEffect(() => {
        const timer = setTimeout(() => setShowInstructions(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleWheel = (event) => {
        event.preventDefault();
        const currentScale = scale.get();
        let newScale = currentScale - event.deltaY * 0.005;

        // Clamp the scale to min/max values
        newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);

        scale.set(newScale);
    };

    const handleZoom = (direction) => {
        const currentScale = scale.get();
        let newScale = direction === 'in' ? currentScale + 0.2 : currentScale - 0.2;
        newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
        animate(scale, newScale, { type: 'spring', stiffness: 300, damping: 30 });
    };

    const handleReset = () => {
        animate(scale, 1, { type: 'spring', stiffness: 300, damping: 30 });
        animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
        animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
    };

    return (
        <div
            ref={canvasRef}
            className="w-full h-screen bg-[#0d1117] text-white overflow-hidden relative touch-none"
            onWheel={handleWheel}
        >
            <motion.div
                className="w-full h-full relative"
                drag
                dragConstraints={canvasRef} // Constrains dragging to the parent's bounds
                dragElastic={0.05} // Adds a bit of elastic resistance at the edges
                style={{ x, y, scale, cursor: 'grab' }}
                whileTap={{ cursor: 'grabbing' }}
            >
                {imageData.map(item => (
                    <motion.div
                        key={item.id}
                        className="absolute w-64 h-auto rounded-lg shadow-2xl overflow-hidden"
                        style={{
                            top: `${item.pos.y}rem`,
                            left: `${item.pos.x}rem`,
                            rotate: `${item.rot}deg`,
                        }}
                        whileHover={{ scale: 1.05, zIndex: 10, boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.25)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                        <img
                            src={item.src}
                            alt={item.alt}
                            className="w-full h-full object-cover pointer-events-none"
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* UI Controls */}
            <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 p-2 bg-gray-800/50 backdrop-blur-sm rounded-lg">
                <button onClick={() => handleZoom('out')} className="p-2 hover:bg-gray-700 rounded-md transition-colors" aria-label="Zoom out">
                    <ZoomOut size={20} />
                </button>
                <button onClick={handleReset} className="p-2 hover:bg-gray-700 rounded-md transition-colors" aria-label="Reset view">
                    <RotateCcw size={20} />
                </button>
                <button onClick={() => handleZoom('in')} className="p-2 hover:bg-gray-700 rounded-md transition-colors" aria-label="Zoom in">
                    <ZoomIn size={20} />
                </button>
            </div>

            {/* Instructions Toast */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showInstructions ? 1 : 0, y: showInstructions ? 0 : 20 }}
                className="absolute top-5 left-1/2 -translate-x-1/2 z-20 p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg text-sm"
            >
                Use mouse wheel to zoom, drag to pan
            </motion.div>
        </div>
    );
};

export default Gallery;