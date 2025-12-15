
import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue } from 'framer-motion';

// Particle Component with Mouse Parallax
const Ember = ({ 
  delay, 
  duration, 
  xStart, 
  size, 
  depth, 
  mouseX, 
  mouseY 
}: { 
  delay: number; 
  duration: number; 
  xStart: number; 
  size: number;
  depth: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) => {
  // Parallax movement based on mouse position and depth factor
  const x = useTransform(mouseX, [-0.5, 0.5], [depth * 40, -depth * 40]); // Increased movement range
  const yMouse = useTransform(mouseY, [-0.5, 0.5], [depth * 40, -depth * 40]);
  
  return (
    <motion.div
      style={{ x, y: yMouse }} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" // Ensure full container coverage
    >
        <motion.div
            initial={{ y: "110vh", x: `${xStart}vw`, opacity: 0 }}
            animate={{ 
                y: "-20vh", 
                opacity: [0, 0.8, 1, 0.8, 0], // Increased opacity for visibility
                x: [`${xStart}vw`, `${xStart + (Math.random() * 20 - 10)}vw`] // More drift
            }}
            transition={{ 
                duration: duration, 
                repeat: Infinity, 
                delay: delay, 
                ease: "linear" 
            }}
            style={{ width: size, height: size }}
            // Brightened color and added glow shadow
            className="bg-red-500 rounded-full blur-[0.5px] shadow-[0_0_8px_2px_rgba(220,38,38,0.6)]"
        />
    </motion.div>
  );
};

const ProblemStatement: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 2. Mouse Tracking Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  const springConfig = { damping: 30, stiffness: 200 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // --- PARALLAX TRANSFORMS ---

  const yScrollGhost = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const xMouseGhost = useTransform(mouseXSpring, [-0.5, 0.5], [30, -30]);
  const yMouseGhost = useTransform(mouseYSpring, [-0.5, 0.5], [30, -30]);
  const opacityGhost = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.4, 0]); // Increased opacity

  const yScrollHighlight = useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]);
  const xMouseHighlight = useTransform(mouseXSpring, [-0.5, 0.5], [-50, 50]); 
  const yMouseHighlight = useTransform(mouseYSpring, [-0.5, 0.5], [-30, 30]);
  const rotateXHighlight = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]); 
  const rotateYHighlight = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]); 

  // Background Grid Parallax - Increased movement
  const xGrid = useTransform(mouseXSpring, [-0.5, 0.5], [-40, 40]);
  const yGrid = useTransform(mouseYSpring, [-0.5, 0.5], [-40, 40]);

  // Generate particles
  const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 5, // Less delay to show up immediately
    duration: Math.random() * 8 + 8, // Faster movement
    xStart: Math.random() * 100,
    size: Math.random() * 3 + 2, // Slightly larger
    depth: Math.random() * 1.5 + 0.5 
  })), []);

  const yLabel = useTransform(scrollYProgress, [0, 1], ["150%", "-150%"]);
  const yDesc = useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]);
  const opacityDesc = useTransform(scrollYProgress, [0.4, 0.6, 0.9], [0, 1, 0]);

  return (
    <section 
        id="problem"
        ref={containerRef} 
        className="py-40 min-h-[90vh] flex items-center justify-center relative overflow-hidden z-10 bg-neutral-950 perspective-[1000px]"
        onMouseMove={handleMouseMove}
    >
      
      {/* LAYER 0: Particles / Embers (Now Z-10 to be visible above bg but below text) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map((p) => (
          <Ember 
            key={p.id} 
            {...p} 
            mouseX={mouseXSpring}
            mouseY={mouseYSpring}
          />
        ))}
      </div>

      {/* LAYER 1: Background Ghost Echo */}
      <motion.div 
        style={{ 
            y: yScrollGhost, 
            x: xMouseGhost, 
            translateY: yMouseGhost,
            opacity: opacityGhost,
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      >
        <h2 className="font-display font-bold text-[18vw] leading-none text-red-900/40 blur-[2px] text-center tracking-tighter whitespace-nowrap mix-blend-screen">
            CRITICAL<br/>FAILURE
        </h2>
      </motion.div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-5xl mx-auto text-center perspective-[1000px]">
          
          <motion.h2 
             style={{ 
                 y: useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]), 
                 opacity: useTransform(scrollYProgress, [0.1, 0.3, 0.8], [0, 1, 0]) 
             }}
             className="font-display text-2xl md:text-4xl leading-tight mb-6 text-neutral-400"
          >
            En 2025, desplegar IA sin gobernanza es
          </motion.h2>

          <motion.div 
             style={{ 
                 y: yScrollHighlight, 
                 x: xMouseHighlight,
                 translateY: yMouseHighlight,
                 rotateX: rotateXHighlight,
                 rotateY: rotateYHighlight,
                 scale: useTransform(scrollYProgress, [0.4, 0.6], [1, 1.05])
             }}
             className="relative inline-block mb-16 md:mb-24 transform-style-3d"
          >
             <span className="block font-display text-4xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-t from-red-950 via-red-700 to-red-500 drop-shadow-[0_0_25px_rgba(220,38,38,0.5)]">
                 SUICIDIO OPERATIVO
             </span>
             
             <motion.div 
                style={{ x: useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]) }}
                className="absolute -bottom-2 left-0 w-full h-[2px] bg-red-900 opacity-80 shadow-[0_0_10px_red]" 
             />
             <motion.div 
                style={{ x: useTransform(mouseXSpring, [-0.5, 0.5], [-30, 30]) }}
                className="absolute -bottom-2 left-1/4 w-1/2 h-[2px] bg-red-500 animate-pulse shadow-[0_0_15px_red]" 
             />
          </motion.div>

          <div className="max-w-2xl mx-auto relative h-[150px] flex flex-col justify-center">
             <motion.div 
                style={{ y: yLabel, opacity: opacityDesc }}
                className="absolute top-0 left-8 z-20"
             >
                <span className="text-red-500 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase bg-black/90 px-3 py-1 border border-red-500/50 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                  // System_Diagnostic
                </span>
             </motion.div>

             <motion.div 
                style={{ y: yDesc, opacity: opacityDesc }}
                className="relative z-10"
             >
               <div className="absolute left-0 -top-10 -bottom-10 w-[1px] bg-gradient-to-b from-transparent via-red-600 to-transparent opacity-80" />
               <p className="font-mono text-neutral-400 text-base md:text-lg leading-relaxed pl-8 text-left drop-shadow-md">
                 Los proveedores quieren venderle una caja negra. Estamos aquí para abrirla, inspeccionarla y reconstruirla para que no rompa su negocio.
               </p>
             </motion.div>
          </div>

        </div>
      </div>
      
      {/* Decorative Grid Overlay - Adjusted colors for contrast against black */}
      <motion.div 
        style={{ x: xGrid, y: yGrid }}
        className="absolute inset-[-10%] z-0 pointer-events-none"
      >
        <div className="w-full h-full bg-[linear-gradient(rgba(200,20,20,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(200,20,20,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950" />
      </motion.div>
      
    </section>
  );
};

export default ProblemStatement;
