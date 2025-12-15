
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useData } from '../../contexts/DataContext';

const StarField = () => {
    return (
        <div className="absolute inset-0 pointer-events-none">
             {[...Array(50)].map((_, i) => (
                 <motion.div
                    key={i}
                    className="absolute bg-white rounded-full"
                    style={{
                        width: Math.random() * 2 + 1,
                        height: Math.random() * 2 + 1,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0.5]
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                 />
             ))}
        </div>
    )
}

const NetworkNarrative: React.FC = () => {
  const { partners } = useData();
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Orbital Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) - 0.5);
      mouseY.set((e.clientY / window.innerHeight) - 0.5);
  };

  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Rotate the entire constellation container based on mouse
  const rotateX = useTransform(springY, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-20, 20]);

  return (
    <div 
        className="min-h-screen bg-black pt-32 pb-20 overflow-hidden relative flex flex-col perspective-[1500px]"
        onMouseMove={handleMouseMove}
        ref={containerRef}
    >
      <StarField />
      
      {/* Dynamic Network Background Grid */}
      <div className="absolute inset-0 opacity-20 transform-style-3d pointer-events-none">
         <motion.div 
            style={{ rotateX: 60, y: "50%" }}
            className="absolute inset-[-50%] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" 
         />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex-grow flex flex-col justify-center items-center">
         
         <div className="text-center mb-12 relative z-20">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-block border border-emerald-500/30 px-4 py-1 rounded-full bg-emerald-900/10 backdrop-blur text-emerald-500 font-mono text-xs mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
               ECOSYSTEM_STATUS: ONLINE
            </motion.div>
            <h1 className="font-display text-5xl md:text-9xl text-white mb-6 drop-shadow-2xl">THE CONSTELLATION</h1>
         </div>

         {/* 3D ORBITAL SYSTEM */}
         <motion.div 
            style={{ rotateX, rotateY }}
            className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px] transform-style-3d flex items-center justify-center"
         >
            {/* Center Core */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute w-40 h-40 md:w-60 md:h-60 rounded-full border border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)] flex items-center justify-center bg-black z-20"
                style={{ transformStyle: 'preserve-3d' }}
            >
                 <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-spin-slow" />
                 <div className="w-20 h-20 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
                 <span className="font-display font-bold text-2xl text-white z-10">CORE</span>
            </motion.div>
            
            {/* Orbiting Satellites (Partners) */}
            {partners.map((partner, index) => {
               const count = partners.length;
               const angle = (index / count) * 360;
               const radius = 300; // Base orbital radius
               // Creating 3D coordinates based on angle
               const x = Math.cos(angle * (Math.PI / 180)) * radius;
               const z = Math.sin(angle * (Math.PI / 180)) * radius;
               
               return (
                  <motion.div 
                     key={partner.id}
                     className="absolute flex items-center justify-center"
                     style={{ 
                         x, z,
                         transformStyle: 'preserve-3d'
                     }}
                  >
                     {/* Connection Line to Center */}
                     <motion.div 
                        className="absolute h-[1px] bg-gradient-to-r from-emerald-500/50 to-transparent origin-left"
                        style={{ 
                            width: radius, 
                            rotate: angle + 180, // Point back to center
                            x: -radius / 2, // Offset adjustment calculation roughly
                            z: -z/2 // simplified line drawing in 3d space is tricky without canvas, relying on parent rotation
                        }}
                     />
                     
                     {/* Using SVG lines would be better for perfect 3D lines, but for this effect, let's pulse rings */}
                     
                     <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group cursor-pointer"
                        // Counter-rotate the node so text stays readable (billboard effect)
                        style={{ rotateY: useTransform(rotateY, (v) => -v), rotateX: useTransform(rotateX, (v) => -v) }}
                     >
                        <div className="relative w-24 h-24 flex flex-col items-center justify-center text-center p-2 bg-black/80 backdrop-blur border border-white/10 rounded-full hover:border-emerald-500 transition-all z-30 shadow-lg group-hover:scale-125 duration-300">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full mb-1 animate-pulse" />
                           <span className="font-display font-bold text-white text-[10px] tracking-tighter">{partner.name}</span>
                        </div>
                        
                        {/* Orbital Ring visualization per node */}
                        <div className="absolute inset-[-20px] border border-white/5 rounded-full animate-ping opacity-20" />
                     </motion.div>

                  </motion.div>
               );
            })}
         </motion.div>

      </div>

      <div className="text-center font-mono text-xs text-gray-600 mt-20 relative z-20">
         TOTAL NODES ACTIVE: {partners.length} // LATENCY: 12ms // ENCRYPTION: QUANTUM-SAFE
      </div>
    </div>
  );
};

export default NetworkNarrative;
