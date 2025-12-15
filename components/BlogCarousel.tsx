
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { ArrowRight, Database, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useData } from '../contexts/DataContext';

// --- Background Elements ---

const DataCore = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <motion.div 
          className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] relative opacity-[0.03]"
          animate={{ rotate: -360 }}
          transition={{ duration: 120, ease: "linear", repeat: Infinity }}
      >
          <svg className="absolute inset-0 w-full h-full text-emerald-500" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.1">
              <circle cx="50" cy="50" r="48" strokeDasharray="4 4" />
              <circle cx="50" cy="50" r="38" strokeDasharray="2 2" />
              <path d="M50,2 L50,98 M2,50 L98,50" />
              <rect x="35" y="35" width="30" height="30" strokeWidth="0.2" transform="rotate(45 50 50)" />
          </svg>
      </motion.div>
  </div>
);

const HolographicFloor = ({ activeIndex }: { activeIndex: number }) => {
    return (
        <div className="absolute bottom-[-20%] left-[-50%] w-[200%] h-[50%] z-0 pointer-events-none perspective-[1000px] opacity-30">
            <motion.div 
                className="w-full h-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(16,185,129,0.1)_100%),linear-gradient(to_right,rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.1)_1px,transparent_1px)]"
                style={{ 
                    backgroundSize: '100px 100px',
                    transform: 'rotateX(60deg)',
                }}
                animate={{ 
                    backgroundPositionX: activeIndex * -100 + 'px',
                    backgroundPositionY: activeIndex * 50 + 'px'
                }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
            {/* Horizon Glow */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-950 to-transparent" />
        </div>
    );
};

// --- Main Component ---

const BlogCarousel: React.FC = () => {
  const { blogs } = useData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex((prev) => {
      let next = prev + newDirection;
      const len = blogs.length;
      if (next < 0) next = len - 1;
      if (next >= len) next = 0;
      return next;
    });
  }, [blogs.length]);

  const jumpTo = (index: number) => {
      const diff = index - activeIndex;
      if (diff !== 0) navigate(diff);
  };

  // Auto-scroll logic
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => navigate(1), 6000);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused, navigate]);

  return (
    <section 
        id="blog" 
        className="py-24 bg-neutral-950 relative overflow-hidden min-h-screen flex flex-col justify-center"
        ref={containerRef}
    >
      <DataCore />
      <HolographicFloor activeIndex={activeIndex} />

      {/* Header Info */}
      <div className="container mx-auto px-6 mb-8 relative z-20 pointer-events-none">
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
            <div>
                <h2 className="font-display text-4xl md:text-6xl text-white mb-2">INTELIGENCIA</h2>
                <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs tracking-widest">
                    <Activity size={14} className="animate-pulse" />
                    TRANSMISIÓN EN VIVO
                </div>
            </div>
            <div className="text-right hidden md:block">
                <div className="font-mono text-xs text-gray-500 mb-1">INDEX_POINTER</div>
                <div className="font-display text-2xl text-white">
                    0{activeIndex + 1} <span className="text-gray-600">/ 0{blogs.length}</span>
                </div>
            </div>
        </div>
      </div>

      {/* 3D Carousel Area */}
      <div 
        className="relative h-[600px] w-full flex items-center justify-center perspective-[1200px] z-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence initial={false} custom={direction}>
          {blogs.map((post, index) => {
             // Calculate circular offset for infinite feel
             const len = blogs.length;
             let offset = index - activeIndex;
             if (offset > len / 2) offset -= len;
             if (offset < -len / 2) offset += len;
             
             // Only render visible items
             if (Math.abs(offset) > 2) return null;

             return (
               <Card 
                 key={post.id}
                 post={post}
                 offset={offset}
                 isActive={offset === 0}
                 onClick={() => jumpTo(index)}
                 accessText="ACCEDER ARCHIVO"
               />
             );
          })}
        </AnimatePresence>
      </div>

      {/* Tactical Control Deck */}
      <div className="container mx-auto px-6 relative z-30 flex justify-center mt-[-40px] md:mt-0">
         <div className="flex items-center gap-8 bg-neutral-900/80 backdrop-blur-md border border-white/10 px-8 py-4 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            
            <button 
                onClick={() => navigate(-1)}
                className="group relative flex items-center justify-center w-12 h-12 rounded-full border border-gray-700 hover:border-emerald-500 hover:bg-emerald-900/20 transition-all"
                aria-label="Previous"
            >
                <ChevronLeft className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </button>

            {/* Pagination Lines */}
            <div className="flex gap-2">
                {blogs.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => jumpTo(idx)}
                        className={`w-1 h-8 rounded-full transition-all duration-500 ${idx === activeIndex ? 'bg-emerald-500 h-12 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-gray-800 hover:bg-gray-600'}`}
                    />
                ))}
            </div>

            <button 
                onClick={() => navigate(1)}
                className="group relative flex items-center justify-center w-12 h-12 rounded-full border border-gray-700 hover:border-emerald-500 hover:bg-emerald-900/20 transition-all"
                aria-label="Next"
            >
                <ChevronRight className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </button>

         </div>
      </div>
      
    </section>
  );
};

const Card = ({ post, offset, isActive, onClick, accessText }: any) => {
  // Mouse tilt effect (only active on center card)
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isActive || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(xPct);
      mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
  };

  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);
  
  // Parallax layers
  const layerX = useTransform(springX, [-0.5, 0.5], [-25, 25]);
  const layerY = useTransform(springY, [-0.5, 0.5], [-25, 25]);

  // Carousel positioning logic
  const absOffset = Math.abs(offset);
  const xDist = 55; // Percentage distance
  
  // Decryption effect
  const [displayTitle, setDisplayTitle] = useState(post.title);
  useEffect(() => {
    if (isActive) {
      let iterations = 0;
      const original = post.title;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&_";
      const interval = setInterval(() => {
        setDisplayTitle(original.split("").map((_char: string, i: number) => {
            if(i < iterations) return original[i];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join(""));
        if(iterations >= original.length) clearInterval(interval);
        iterations += 1; 
      }, 30);
      return () => clearInterval(interval);
    } else {
        setDisplayTitle(post.title); 
    }
  }, [isActive, post.title]);

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      className={`absolute w-[80vw] md:w-[550px] h-[450px] md:h-[600px] cursor-pointer perspective-[1000px]`}
      style={{ zIndex: 100 - absOffset }}
      animate={{
        x: `${offset * xDist}%`, 
        scale: isActive ? 1 : 0.8,
        opacity: isActive ? 1 : Math.max(0, 0.5 - absOffset * 0.2),
        rotateY: offset * -25, // Stronger rotation for side cards
        z: Math.abs(offset) * -300 // Push side cards back
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Reflection (Only visual, flipped) */}
      {isActive && (
         <motion.div 
            className="absolute -bottom-[20px] left-0 right-0 h-[50%] bg-gradient-to-b from-emerald-500/20 to-transparent opacity-30 blur-md transform scale-y-[-1] mask-image-[linear-gradient(to_bottom,black,transparent)] pointer-events-none"
            style={{ 
                rotateX, 
                rotateY,
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)'
            }}
         />
      )}

      {/* Main Card */}
      <motion.div 
         className="relative w-full h-full transform-style-3d group"
         style={{ 
             rotateX: isActive ? rotateX : 0, 
             rotateY: isActive ? rotateY : 0 
         }}
      >
        {/* Data Tethers (Top/Bottom Lines) */}
        {isActive && (
            <>
                <motion.div 
                    initial={{ height: 0 }} animate={{ height: '100vh' }} 
                    className="absolute bottom-full left-1/2 w-[1px] bg-gradient-to-t from-emerald-500 to-transparent opacity-50 -z-10" 
                />
                <motion.div 
                    initial={{ height: 0 }} animate={{ height: '200px' }} 
                    className="absolute top-full left-1/2 w-[1px] bg-gradient-to-b from-emerald-500 to-transparent opacity-50 -z-10" 
                />
            </>
        )}

        {/* Card Frame */}
        <div className={`absolute inset-0 bg-[#050505] border ${isActive ? 'border-emerald-500/50' : 'border-white/10'} transition-colors duration-500 overflow-hidden`}>
            
            {/* Image Layer */}
            <motion.div 
                className="absolute inset-0 scale-110"
                style={{ x: isActive ? layerX : 0, y: isActive ? layerY : 0 }}
            >
                <img 
                    src={post.image} 
                    alt={post.title} 
                    className={`w-full h-full object-cover transition-all duration-700 ${isActive ? 'opacity-40 grayscale-[20%]' : 'opacity-20 grayscale'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
            </motion.div>

            {/* Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none" />

            {/* Content Layer */}
            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between translate-z-[30px]">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-emerald-500 tracking-widest uppercase mb-1">
                            /{post.category}
                        </span>
                        <span className="font-mono text-[10px] text-gray-500">
                            {post.date}
                        </span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-700'}`} />
                </div>

                {/* Body */}
                <div className="space-y-6">
                    <h3 className={`font-display text-2xl md:text-4xl text-white leading-[1.1] transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'opacity-50'}`}>
                        {displayTitle}
                        {isActive && <span className="animate-blink">_</span>}
                    </h3>
                    
                    <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="font-mono text-gray-400 text-sm leading-relaxed border-l border-emerald-500/30 pl-4">
                            {post.excerpt}
                        </p>
                    </div>
                </div>

                {/* Footer / CTA */}
                <div className={`flex items-center justify-between pt-6 border-t border-white/5 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center gap-2 text-white/50 text-xs font-mono uppercase">
                        <Database size={12} /> {post.readTime}
                    </div>
                    <button className="flex items-center gap-3 bg-white text-black px-4 py-2 font-bold font-display text-xs uppercase hover:bg-emerald-500 hover:text-white transition-colors">
                        {accessText} <ArrowRight size={14} />
                    </button>
                </div>
            </div>
            
            {/* Hover Glitch Overlay (White Flash) */}
            <div className="absolute inset-0 bg-white mix-blend-overlay opacity-0 group-hover:opacity-10 transition-opacity duration-100 pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlogCarousel;
