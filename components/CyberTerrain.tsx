
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const VectorFlux: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Mouse Interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 400 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  // --- PARALLAX TRANSFORMS ---

  // 1. Slow Background Grid (Moves slightly)
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  // 2. Vertical Vector Lines (Fast movement up/down)
  const lineY1 = useTransform(scrollYProgress, [0, 1], ["10%", "-50%"]);
  const lineY2 = useTransform(scrollYProgress, [0, 1], ["-20%", "40%"]);
  const lineY3 = useTransform(scrollYProgress, [0, 1], ["50%", "-100%"]);

  // 3. Central Geometry (Rotates and Scales)
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scale = useTransform(scrollYProgress, [0.3, 0.7], [0.8, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // 4. Mouse Parallax layers
  const x1 = useTransform(mouseXSpring, [-0.5, 0.5], [-20, 20]);
  const y1 = useTransform(mouseYSpring, [-0.5, 0.5], [-10, 10]); // Reduced Y movement for banner format
  const x2 = useTransform(mouseXSpring, [-0.5, 0.5], [40, -40]);
  const y2 = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]); // Reduced Y movement for banner format

  return (
    <div 
        ref={containerRef}
        className="relative h-[35vh] min-h-[300px] w-full bg-[#030303] overflow-hidden flex items-center justify-center border-y border-white/10"
        onMouseMove={handleMouseMove}
    >
        {/* --- LAYER 1: BACKGROUND GRID --- */}
        <motion.div 
            style={{ y: gridY }}
            className="absolute inset-[-20%] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"
        />

        {/* --- LAYER 2: VERTICAL VECTORS (Left & Right) --- */}
        <div className="absolute inset-0 flex justify-between px-10 md:px-32 pointer-events-none">
            {/* Left Vectors */}
            <div className="h-full w-[1px] bg-white/10 relative overflow-hidden">
                <motion.div style={{ y: lineY1 }} className="absolute top-0 w-full h-[40%] bg-emerald-500/50 blur-[1px]" />
                <motion.div style={{ y: lineY3 }} className="absolute bottom-0 w-full h-[20%] bg-emerald-500/30" />
            </div>
            
            {/* Right Vectors */}
            <div className="h-full w-[1px] bg-white/10 relative overflow-hidden">
                <motion.div style={{ y: lineY2 }} className="absolute top-[20%] w-full h-[30%] bg-emerald-500/50 blur-[1px]" />
            </div>
        </div>

        {/* --- LAYER 3: FLOATING GEOMETRY (Interactive) --- */}
        
        {/* Outer Ring - Scaled down for banner height */}
        <motion.div 
            style={{ x: x1, y: y1, rotate: rotate, opacity }}
            className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] border border-white/10 rounded-full flex items-center justify-center"
        >
            <div className="absolute inset-0 border border-dashed border-emerald-500/20 rounded-full animate-[spin_60s_linear_infinite]" />
        </motion.div>

        {/* Inner Square - Scalable */}
        <motion.div 
            style={{ x: x2, y: y2, scale, opacity }}
            className="absolute z-10"
        >
            <svg width="200" height="200" viewBox="0 0 300 300" className="opacity-80">
                {/* Decorative Brackets */}
                <motion.path 
                    d="M 50 100 V 50 H 100" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                />
                <motion.path 
                    d="M 250 200 V 250 H 200" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                />
                
                {/* Center Crosshair */}
                <line x1="140" y1="150" x2="160" y2="150" stroke="white" strokeWidth="1" opacity="0.5" />
                <line x1="150" y1="140" x2="150" y2="160" stroke="white" strokeWidth="1" opacity="0.5" />
                <circle cx="150" cy="150" r="20" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
            </svg>
        </motion.div>

        {/* --- LAYER 4: DATA STREAMS --- */}
        <div className="absolute inset-0 pointer-events-none">
             {[...Array(6)].map((_, i) => (
                 <motion.div 
                    key={i}
                    style={{ 
                        left: `${15 + i * 15}%`,
                        y: useTransform(scrollYProgress, [0, 1], [`${100 + i * 20}%`, `-${100 + i * 20}%`])
                    }}
                    className="absolute top-0 w-[1px] h-20 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent"
                 />
             ))}
        </div>

        {/* --- LAYER 5: TEXT LABELS --- */}
        <motion.div 
            style={{ opacity }}
            className="absolute bottom-4 left-4 md:bottom-10 md:left-10 font-mono text-[10px] text-emerald-500 tracking-widest"
        >
            TRANSITION_VECTOR // SYNC
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] pointer-events-none" />
    </div>
  );
};

export default VectorFlux;
