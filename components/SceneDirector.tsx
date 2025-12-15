
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { ViewState } from '../types';

interface SceneDirectorProps {
  currentView: ViewState;
}

const STATUES: Record<string, string> = {
  home: 'https://images.unsplash.com/photo-1549491460-7ff53bf725b0?q=80&w=2069&auto=format&fit=crop', // David-esque
  products: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=1948&auto=format&fit=crop', // Hands
  intelligence: 'https://images.unsplash.com/photo-1555580133-c2153579b76c?q=80&w=2070&auto=format&fit=crop', // Bust
  network: 'https://images.unsplash.com/photo-1574351548919-21570773d22b?q=80&w=1935&auto=format&fit=crop', // Torso/Drape
  contact: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2111&auto=format&fit=crop', // Galaxy/Void
};

const SceneDirector: React.FC<SceneDirectorProps> = ({ currentView }) => {
  const [imgUrl, setImgUrl] = useState(STATUES.home);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
     setImgUrl(STATUES[currentView] || STATUES.home);
  }, [currentView]);

  // Global Parallax for the Scene
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 400 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
        mouseX.set((e.clientX / window.innerWidth) - 0.5);
        mouseY.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
      
      {/* 3D Wireframe Overlay */}
      <div className="absolute inset-0 z-20 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      {/* Main Art Subject */}
      <div className="absolute inset-0 flex items-center justify-center perspective-[1000px]">
        <AnimatePresence mode="wait">
            <motion.div
                key={currentView}
                initial={{ opacity: 0, scale: 0.8, rotateY: 90, z: -500, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.2, rotateY: -90, z: 500, filter: 'blur(20px)' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ rotateX, rotateY }}
                className="relative w-[60vh] h-[80vh] md:w-[800px] md:h-[1000px] transform-style-3d"
            >
                {/* The Image (Statue) - heavily processed */}
                <img 
                    src={imgUrl} 
                    alt="Neoclassical Art" 
                    className="w-full h-full object-contain grayscale mix-blend-screen opacity-20 md:opacity-30 drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                />
                
                {/* Geometric Cutouts / Glitch Effect */}
                <div className="absolute top-1/4 left-0 w-full h-[2px] bg-emerald-500 mix-blend-difference opacity-50 shadow-[0_0_10px_#10b981]"></div>
                <div className="absolute bottom-1/3 right-10 w-[100px] h-[100px] border border-white/20 rounded-full animate-spin-slow mix-blend-overlay"></div>
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Warp Tunnel Effect (Static but reacts to perspective) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-30">
          <motion.div 
             style={{ rotate: useTransform(springX, [-0.5, 0.5], [-20, 20]) }}
             className="w-[150vw] h-[150vw] border-[1px] border-emerald-900/30 rounded-full scale-[0.2]" 
          />
          <motion.div 
             style={{ rotate: useTransform(springX, [-0.5, 0.5], [20, -20]) }}
             className="w-[150vw] h-[150vw] border-[1px] border-emerald-900/20 rounded-full scale-[0.5] absolute" 
          />
           <motion.div 
             style={{ rotate: useTransform(springX, [-0.5, 0.5], [-10, 10]) }}
             className="w-[150vw] h-[150vw] border-[1px] border-emerald-900/10 rounded-full scale-[0.8] absolute" 
          />
      </div>

      {/* Floating Debris */}
      <motion.div style={{ x: useTransform(springX, [-0.5, 0.5], [50, -50]) }} className="absolute top-20 right-20 w-40 h-40 border border-emerald-900/40 rounded-full blur-[40px]"></motion.div>
      <motion.div style={{ y: useTransform(springY, [-0.5, 0.5], [50, -50]) }} className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-tr from-emerald-900/10 to-transparent blur-[60px]"></motion.div>

    </div>
  );
};

export default SceneDirector;
