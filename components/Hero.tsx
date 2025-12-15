
import React, { useRef, useMemo, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue, AnimatePresence } from 'framer-motion';
import { ArrowDownRight, Crosshair, Cpu } from 'lucide-react';

const Particle = ({ top, left, size, duration, delay, depth, mouseX, mouseY }: {
    top: number; left: number; size: number; duration: number; delay: number; depth: number; mouseX: MotionValue<number>; mouseY: MotionValue<number>;
}) => {
    const x = useTransform(mouseX, [-0.5, 0.5], [depth, -depth]);
    const y = useTransform(mouseY, [-0.5, 0.5], [depth, -depth]);

    return (
        <motion.div
            style={{ 
                top: `${top}%`, 
                left: `${left}%`, 
                width: size, 
                height: size, 
                x, 
                y 
            }}
            animate={{ 
                opacity: [0, 0.8, 0],
                y: [0, -40, 0],
            }}
            transition={{ 
                duration: duration, 
                repeat: Infinity, 
                delay: delay,
                ease: "linear" 
            }}
            className="absolute bg-emerald-500 rounded-full blur-[1px]"
        />
    );
};

// Universe Particle Component with Parallax
const UniverseParticle = ({ 
  top, 
  left, 
  size, 
  depth, 
  mouseX, 
  mouseY,
  twinkleSpeed 
}: {
  top: number; 
  left: number; 
  size: number; 
  depth: number; 
  mouseX: MotionValue<number>; 
  mouseY: MotionValue<number>;
  twinkleSpeed: number;
}) => {
  // Parallax effect based on depth - deeper particles move more
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [depth * 0.4, -depth * 0.4]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [depth * 0.4, -depth * 0.4]);

  return (
    <motion.div
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: size,
        height: size,
        x: parallaxX,
        y: parallaxY,
      }}
      animate={{
        opacity: [0.3, 1, 0.3],
        scale: [0.8, 1.3, 0.8],
      }}
      transition={{
        duration: twinkleSpeed,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute bg-white rounded-full"
    >
      {/* Glow effect for star-like appearance */}
      <div className="absolute inset-0 bg-white rounded-full blur-[2px] opacity-60" />
      <div className="absolute inset-0 bg-emerald-400 rounded-full blur-[1px] opacity-40" />
      {/* Core bright point */}
      <div className="absolute inset-0 bg-white rounded-full" />
    </motion.div>
  );
};

// Galaxy Particles Effect - Lightweight and Beautiful
const GalaxyParticles = ({ isActive }: { isActive: boolean }) => {
  const particles = useMemo(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const height = typeof window !== 'undefined' ? window.innerHeight : 1080;
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      startX: Math.random() * width,
      startY: Math.random() * height,
      endX: Math.random() * width,
      endY: Math.random() * height,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 0.3,
      duration: Math.random() * 1.5 + 1.5,
    }));
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                left: p.startX,
                top: p.startY,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                left: p.endX,
                top: p.endY,
                opacity: [0, 1, 1, 0.6, 0],
                scale: [0, 1, 1.3, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeOut",
              }}
              className="absolute rounded-full"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(16, 185, 129, 0.8) 50%, transparent 100%)',
                boxShadow: '0 0 8px rgba(16, 185, 129, 1), 0 0 16px rgba(255, 255, 255, 0.6), 0 0 24px rgba(16, 185, 129, 0.4)',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [isWarpActive, setIsWarpActive] = useState(false);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse movement - stiffer for UI, looser for background
  const springConfig = { damping: 40, stiffness: 300 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // --- PARALLAX LAYERS (Deconstructed) ---
  
  // 1. Background Grid (Deepest)
  const xGrid = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
  const yGrid = useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]);

  // 2. "ORDER" Text (Back Left)
  const xOrder = useTransform(mouseXSpring, [-0.5, 0.5], [40, -40]);
  const yOrder = useTransform(mouseYSpring, [-0.5, 0.5], [40, -40]);
  const yScrollOrder = useTransform(scrollY, [0, 500], [0, -100]);

  // 3. Statue (Middle Center)
  const xStatue = useTransform(mouseXSpring, [-0.5, 0.5], [-20, 20]); // Moves opposite to text
  const yStatue = useTransform(mouseYSpring, [-0.5, 0.5], [-20, 20]);
  const rotateYStatue = useTransform(mouseXSpring, [-0.5, 0.5], [-5, 5]);

  // 4. "CHAOS" Text (Front Right)
  const xChaos = useTransform(mouseXSpring, [-0.5, 0.5], [80, -80]);
  const yChaos = useTransform(mouseYSpring, [-0.5, 0.5], [80, -80]);
  const yScrollChaos = useTransform(scrollY, [0, 500], [0, 150]);

  // 5. Floating UI Elements (Front)
  const xUI = useTransform(mouseXSpring, [-0.5, 0.5], [15, -15]);
  const yUI = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 5,
      depth: (Math.random() - 0.5) * 100 
  })), []);

  // Universe particles with different depths for parallax
  const universeParticles = useMemo(() => Array.from({ length: 80 }).map((_, i) => ({
      id: `universe-${i}`,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 0.5,
      depth: Math.random() * 200 - 100, // Range from -100 to 100 for parallax depth
      twinkleSpeed: Math.random() * 3 + 2, // 2-5 seconds
  })), []);

  return (
    <div 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden bg-[#030303] flex items-center justify-center perspective-[2000px]"
      onMouseMove={handleMouseMove}
    >
      {/* --- LAYER 0: THE STATUE (One Layer Above Background) --- */}
      <motion.div 
        style={{ 
            x: xStatue, 
            y: yStatue, 
            rotateY: rotateYStatue,
            opacity: useTransform(scrollY, [0, 400], [1, 0])
        }}
        className="absolute z-[1] pointer-events-none w-full h-full flex items-center justify-center"
      >
         <div className="relative w-[80vh] h-[80vh] md:w-[60vw] md:h-[90vh] transform-style-3d">
             {/* Halo Ring */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-emerald-500/20 rounded-full animate-[spin_60s_linear_infinite]" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] border border-white/5 rounded-full border-dashed animate-[spin_40s_linear_infinite_reverse]" />
             
             {/* 3D Clone Layer 1 - Back Shadow/Depth */}
             <motion.div
               style={{
                 rotateY: useTransform(rotateYStatue, (val) => val * 1.5),
                 rotateX: useTransform(mouseYSpring, [-0.5, 0.5], [3, -3]),
                 z: -50,
                 scale: 1.05,
               }}
               className="absolute inset-0 transform-style-3d"
             >
               <img 
                  src="/atena.png" 
                  alt="Athena Clone Back"
                  className="w-full h-full object-contain filter grayscale contrast-150 brightness-70 blur-[4px] opacity-15"
               />
             </motion.div>

             {/* 3D Clone Layer 2 - Side Reflection */}
             <motion.div
               style={{
                 rotateY: useTransform(rotateYStatue, (val) => val * -0.8),
                 rotateX: useTransform(mouseYSpring, [-0.5, 0.5], [-2, 2]),
                 x: useTransform(mouseXSpring, [-0.5, 0.5], [-30, 30]),
                 z: -30,
                 scale: 0.98,
               }}
               className="absolute inset-0 transform-style-3d"
             >
               <img 
                  src="/atena.png" 
                  alt="Athena Clone Side"
                  className="w-full h-full object-contain filter grayscale contrast-130 brightness-80 blur-[3px] opacity-20"
               />
             </motion.div>
             
             {/* Main Image - Front Layer */}
             <motion.div
               style={{
                 rotateY: rotateYStatue,
                 rotateX: useTransform(mouseYSpring, [-0.5, 0.5], [-1, 1]),
                 z: 0,
               }}
               className="relative w-full h-full transform-style-3d"
             >
               <img 
                  src="/atena.png" 
                  alt="Athena"
                  className="w-full h-full object-contain filter grayscale contrast-125 brightness-90 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] blur-[2px] opacity-30"
               />
             </motion.div>

             {/* 3D Clone Layer 3 - Front Glow */}
             <motion.div
               style={{
                 rotateY: useTransform(rotateYStatue, (val) => val * 0.5),
                 z: 20,
                 scale: 1.02,
               }}
               className="absolute inset-0 transform-style-3d pointer-events-none"
             >
               <img 
                  src="/atena.png" 
                  alt="Athena Clone Front"
                  className="w-full h-full object-contain filter grayscale contrast-110 brightness-95 blur-[1px] opacity-10"
               />
             </motion.div>
             
             {/* Gradient Overlay for blending */}
             <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#030303] to-transparent z-10" />
         </div>
      </motion.div>

      {/* --- LAYER 1: ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-[#030303] to-[#030303]" />
         <motion.div 
            style={{ x: xGrid, y: yGrid }}
            className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:100px_100px] mask-image-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" 
         />
      </div>

      {/* --- LAYER 2: TYPOGRAPHY 'ORDER' (Top Left) --- */}
      <motion.div 
        style={{ x: xOrder, y: yOrder, translateY: yScrollOrder }}
        className="absolute top-[10%] left-[-5%] md:left-[5%] z-10 pointer-events-none mix-blend-difference"
      >
        <h1 className="font-display font-bold text-[8rem] md:text-[14rem] lg:text-[18rem] leading-[0.8] text-white/5 tracking-tighter select-none">
          CREA<br/>MOS
        </h1>
      </motion.div>

      {/* --- LAYER 3: TYPOGRAPHY 'CHAOS' (Bottom Right) --- */}
      <motion.div 
        style={{ x: xChaos, y: yChaos, translateY: yScrollChaos }}
        className="absolute bottom-[5%] right-[-5%] md:right-[2%] z-20 pointer-events-none"
      >
        <h1 className="font-display font-bold text-[8rem] md:text-[14rem] lg:text-[18rem] leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-t from-emerald-900 to-white/80 select-none opacity-80 text-right">
          CA<br/>OS
        </h1>
        {/* Glitch Shadow */}
        <div className="absolute inset-0 text-[8rem] md:text-[14rem] lg:text-[18rem] leading-[0.8] tracking-tighter text-emerald-500/30 blur-sm translate-x-2 translate-y-2 -z-10 text-right">
            CA<br/>OS
        </div>
      </motion.div>

      {/* --- LAYER 4: CONNECTOR TEXT --- */}
      <motion.div
        style={{ x: xUI, y: yUI }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 mix-blend-difference pointer-events-none"
      >
          <div className="font-mono text-sm md:text-base tracking-[1em] text-emerald-500 uppercase bg-black/50 backdrop-blur-sm px-4 py-1 border border-emerald-500/30">
              ORDEN DESDE EL
          </div>
      </motion.div>

      {/* --- LAYER 5: INTERFACE ELEMENTS (HUD) --- */}

      {/* Top Left: System Status */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-24 left-6 md:left-12 z-40"
      >
          <div className="flex items-center gap-3 mb-2">
            <Cpu size={16} className="text-emerald-500 animate-pulse" />
            <span className="font-mono text-xs text-emerald-500 tracking-widest">TU MOMENTO ES AHORA</span>
          </div>
          <div className="h-[1px] w-32 bg-gradient-to-r from-emerald-500 to-transparent" />
          <div className="font-mono text-[10px] text-gray-500 mt-2">
            COORD: 34.6037° S, 58.3816° W<br/>
            UPTIME: 99.999%
          </div>
      </motion.div>

      {/* Top Right: Description (Unconventional Placement) */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute top-24 right-6 md:right-12 z-40 max-w-xs text-right"
      >
          <p className="font-mono text-xs md:text-sm text-gray-300 leading-relaxed border-r-2 border-emerald-500 pr-4">
              Diseñamos infraestructura de IA de alto cumplimiento para organizaciones que no pueden permitirse fallar.
          </p>
          <div className="flex justify-end mt-2 gap-1">
             <div className="w-2 h-2 bg-gray-700" />
             <div className="w-2 h-2 bg-gray-700" />
             <div className="w-2 h-2 bg-emerald-500" />
          </div>
      </motion.div>

      {/* Bottom Left: CTA (Primary Action) */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-12 left-6 md:left-12 z-40"
      >
         <button 
           onClick={() => {
             if (!isWarpActive) {
               setIsWarpActive(true);
               // Trigger galaxy particles and navigate to about-us
               setTimeout(() => {
                 // Navigate to /about-us using SPA navigation
                 window.history.pushState({}, '', '/about-us');
                 window.dispatchEvent(new PopStateEvent('popstate'));
                 // Reset particles after navigation
                 setTimeout(() => {
                   setIsWarpActive(false);
                 }, 3000);
               }, 100);
             }
           }}
           disabled={isWarpActive}
           className="group relative pl-12 pr-6 py-4 bg-transparent overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
         >
             {/* Button Background */}
             <div className="absolute inset-0 bg-white/5 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500 transition-all duration-300 transform skew-x-[-12deg]" />
             
             {/* Content */}
             <div className="relative flex items-center gap-4">
                <div className="absolute left-0 w-8 h-[1px] bg-emerald-500 group-hover:w-12 transition-all" />
                <span className="font-display font-bold text-lg text-white uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    Desplegar Estrategia
                </span>
                <ArrowDownRight size={18} className="text-emerald-500 group-hover:rotate-[-45deg] transition-transform duration-300" />
             </div>
         </button>
      </motion.div>

      {/* Galaxy Particles Effect */}
      <GalaxyParticles isActive={isWarpActive} />

      {/* Bottom Center: Scroll Indicator */}
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1.2 }}
         className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
      >
         <Crosshair size={20} className="text-emerald-500/50 animate-[spin_10s_linear_infinite]" />
         <span className="font-mono text-[10px] text-gray-500 tracking-[0.3em] uppercase">Desplazar</span>
      </motion.div>

      {/* Universe Particles with Parallax */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {universeParticles.map((p) => (
          <UniverseParticle 
            key={p.id} 
            top={p.top}
            left={p.left}
            size={p.size}
            depth={p.depth}
            mouseX={mouseXSpring}
            mouseY={mouseYSpring}
            twinkleSpeed={p.twinkleSpeed}
          />
        ))}
      </div>

      {/* Particles */}
      <div className="absolute inset-0 z-35 pointer-events-none">
        {particles.map((p) => (
           <Particle key={p.id} {...p} mouseX={mouseXSpring} mouseY={mouseYSpring} />
        ))}
      </div>
      
    </div>
  );
};

export default Hero;
