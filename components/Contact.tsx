
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue } from 'framer-motion';

// 3D Vector Component for Space Background
const SpaceVector3D = ({ 
  progress, 
  mouseX, 
  mouseY, 
  index 
}: { 
  progress: MotionValue<number>; 
  mouseX: MotionValue<number>; 
  mouseY: MotionValue<number>; 
  index: number;
}) => {
  const baseX = useTransform(progress, [0, 1], [10 + (index % 8) * 12, 90 - (index % 8) * 12]);
  const baseY = useTransform(progress, [0, 1], [20 + (index % 6) * 15, 80 - (index % 6) * 15]);
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [index * -40, index * 40]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [index * -30, index * 30]);
  const rotateZ = useTransform(progress, [0, 1], [index * 30, index * 30 + 360]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [index * -15, index * 15]);
  const scale = useTransform(progress, [0.2, 0.5, 0.8], [0.6, 1.2, 0.6]);
  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 0.4, 0.4, 0]);

  const x = useTransform([baseX, parallaxX], ([bx, px]) => (bx as number) + (px as number));
  const y = useTransform([baseY, parallaxY], ([by, py]) => (by as number) + (py as number));

  const gradId = `space-grad-${index}`;

  return (
    <motion.div
      style={{
        x: useTransform(x, (val) => `${val}%`),
        y: useTransform(y, (val) => `${val}%`),
        rotateZ,
        rotateY,
        scale,
        opacity,
        transformStyle: "preserve-3d",
      }}
      className="absolute pointer-events-none"
    >
      <svg width="150" height="150" viewBox="0 0 150 150" className="opacity-30">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <g transform="translate(75, 75)">
          {/* 3D Wireframe Sphere/Cube */}
          <circle cx="0" cy="0" r="30" fill="none" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.4" />
          <circle cx="0" cy="0" r="20" fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="10" fill="none" stroke={`url(#${gradId})`} strokeWidth="2" />
          {/* Connecting lines for 3D effect */}
          <line x1="-30" y1="0" x2="-20" y2="0" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.5" />
          <line x1="30" y1="0" x2="20" y2="0" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="-30" x2="0" y2="-20" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="30" x2="0" y2="20" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.5" />
        </g>
      </svg>
    </motion.div>
  );
};

// Floating Particle for Space
const SpaceParticle = ({ 
  progress, 
  mouseX, 
  mouseY, 
  index,
  startX,
  startY,
  endX,
  endY
}: { 
  progress: MotionValue<number>; 
  mouseX: MotionValue<number>; 
  mouseY: MotionValue<number>; 
  index: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}) => {
  // Base position in percentage
  const baseX = useTransform(progress, [0, 1], [startX, endX]);
  const baseY = useTransform(progress, [0, 1], [startY, endY]);
  
  // Parallax offset in pixels (subtle movement)
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [index * -15, index * 15]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [index * -10, index * 10]);
  
  const scale = useTransform(progress, [0, 0.5, 1], [0, 1, 0]);
  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 0.8, 0.8, 0]);

  return (
    <motion.div
      style={{
        left: useTransform(baseX, (val) => `${val}%`),
        top: useTransform(baseY, (val) => `${val}%`),
        x: parallaxX,
        y: parallaxY,
        scale,
        opacity,
      }}
      className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full blur-[1px]"
    />
  );
};

const Contact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Mouse tracking for parallax
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

  // Multi-layer Parallax Transforms
  // Deep Space Grid (slowest)
  const bgGridX = useTransform(mouseXSpring, [-0.5, 0.5], [-60, 60]);
  const bgGridY = useTransform(mouseYSpring, [-0.5, 0.5], [-60, 60]);
  const bgGridScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const bgGridRotate = useTransform(mouseXSpring, [-0.5, 0.5], [-3, 3]);

  // Vector Lines (medium speed)
  const vectorLineY1 = useTransform(scrollYProgress, [0, 1], ["-30%", "130%"]);
  const vectorLineY2 = useTransform(scrollYProgress, [0, 1], ["130%", "-30%"]);
  const vectorLineX = useTransform(mouseXSpring, [-0.5, 0.5], [-40, 40]);

  // Floating Geometry (faster)
  const geometryRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const geometryScale = useTransform(scrollYProgress, [0.2, 0.8], [0.5, 1.5]);
  const geometryX = useTransform(mouseXSpring, [-0.5, 0.5], [-60, 60]);
  const geometryY = useTransform(mouseYSpring, [-0.5, 0.5], [-60, 60]);

  // Generate vectors and particles - INCREASED
  const vectors = Array.from({ length: 28 }).map((_, i) => i);
  const particles = Array.from({ length: 55 }).map((_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    endX: Math.random() * 100,
    endY: Math.random() * 100,
  }));

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="min-h-screen bg-neutral-950 flex items-center justify-center relative overflow-hidden pt-32 pb-20"
      onMouseMove={handleMouseMove}
    >
      {/* LAYER 0: Deep Space Grid (Slowest Parallax) */}
      <motion.div
        style={{
          x: bgGridX,
          y: bgGridY,
          translateY: bgGridScrollY,
          rotate: bgGridRotate,
        }}
        className="absolute inset-0 z-0 opacity-8"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:100px_100px] [transform:perspective(1200px)_rotateX(80deg)_scale(2)] origin-center" />
        {/* Additional depth layer */}
        <motion.div
          style={{
            x: useTransform(mouseXSpring, [-0.5, 0.5], [-20, 20]),
            y: useTransform(mouseYSpring, [-0.5, 0.5], [-20, 20]),
          }}
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:150px_150px] [transform:perspective(1200px)_rotateX(80deg)_scale(2.2)] origin-center opacity-50"
        />
      </motion.div>

      {/* LAYER 1: Vector Lines (Medium Parallax) */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <motion.div
          style={{ y: vectorLineY1, x: vectorLineX }}
          className="absolute left-[15%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent"
        />
        <motion.div
          style={{ y: vectorLineY2, x: useTransform(mouseXSpring, [-0.5, 0.5], [40, -40]) }}
          className="absolute right-[15%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/25 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["60%", "-40%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [-30, 30]) }}
          className="absolute left-1/2 top-0 w-[1px] h-[150%] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["-40%", "140%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [25, -25]) }}
          className="absolute left-[8%] top-0 w-[1px] h-[180%] bg-gradient-to-b from-transparent via-emerald-500/15 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["140%", "-40%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [-25, 25]) }}
          className="absolute right-[8%] top-0 w-[1px] h-[180%] bg-gradient-to-b from-transparent via-emerald-500/15 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["-30%", "130%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]) }}
          className="absolute left-[25%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["130%", "-30%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [-20, 20]) }}
          className="absolute right-[25%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["-20%", "120%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [15, -15]) }}
          className="absolute left-[40%] top-0 w-[1px] h-[190%] bg-gradient-to-b from-transparent via-emerald-500/18 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["120%", "-20%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]) }}
          className="absolute right-[40%] top-0 w-[1px] h-[190%] bg-gradient-to-b from-transparent via-emerald-500/18 to-transparent"
        />
      </div>

      {/* LAYER 2: 3D Vectors (Floating Geometry) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {vectors.map((i) => {
          const vectorX = useTransform(scrollYProgress, [0, 1], [10 + (i % 8) * 12, 90 - (i % 8) * 12]);
          const vectorY = useTransform(scrollYProgress, [0, 1], [20 + (i % 6) * 15, 80 - (i % 6) * 15]);
          const finalX = useTransform([geometryX, vectorX], ([gx, vx]) => (gx as number) + (vx as number));
          const finalY = useTransform([geometryY, vectorY], ([gy, vy]) => (gy as number) + (vy as number));
          
          return (
            <motion.div
              key={i}
              style={{
                x: useTransform(finalX, (val) => `${val}%`),
                y: useTransform(finalY, (val) => `${val}%`),
                rotate: geometryRotate,
                scale: geometryScale,
                opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.5, 0.5, 0]),
                transformStyle: "preserve-3d",
              }}
              className="absolute"
            >
              <SpaceVector3D progress={scrollYProgress} mouseX={mouseXSpring} mouseY={mouseYSpring} index={i} />
            </motion.div>
          );
        })}
      </div>

      {/* LAYER 3: Floating Particles */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        {particles.map((p) => (
          <SpaceParticle 
            key={p.id} 
            progress={scrollYProgress} 
            mouseX={mouseXSpring} 
            mouseY={mouseYSpring} 
            index={p.id}
            startX={p.startX}
            startY={p.startY}
            endX={p.endX}
            endY={p.endY}
          />
        ))}
      </div>

      {/* LAYER 4: Ambient Light Effects */}
      <motion.div
        style={{
          x: useTransform(mouseXSpring, [-0.5, 0.5], [-120, 120]),
          y: useTransform(mouseYSpring, [-0.5, 0.5], [-120, 120]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.4, 0.2]),
        }}
        className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none z-5"
      />
      <motion.div
        style={{
          x: useTransform(mouseXSpring, [-0.5, 0.5], [120, -120]),
          y: useTransform(mouseYSpring, [-0.5, 0.5], [120, -120]),
          opacity: useTransform(scrollYProgress, [0.3, 0.7], [0.15, 0.3]),
        }}
        className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none z-5"
      />

      {/* LAYER 5: Main Content with Parallax */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [30, -30]),
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 1]),
        }}
        className="container mx-auto px-6 z-20 w-full max-w-4xl relative"
      >
        <motion.div
          style={{
            x: useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]),
            y: useTransform(mouseYSpring, [-0.5, 0.5], [-10, 10]),
          }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl text-white mb-6"
          >
            INICIAR SECUENCIA
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-mono text-gray-400 text-lg"
          >
            ¿Está listo para planificar su infraestructura para 2026?
          </motion.p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block font-mono text-xs text-emerald-500 mb-2 uppercase tracking-widest">Identifíquese</label>
              <input 
                type="text" 
                placeholder="Nombre" 
                className="w-full bg-transparent border-b border-gray-700 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600 font-display backdrop-blur-sm" 
              />
            </motion.div>
            <motion.div 
              className="group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block font-mono text-xs text-emerald-500 mb-2 uppercase tracking-widest">Organización</label>
              <input 
                type="text" 
                placeholder="Nombre de Empresa" 
                className="w-full bg-transparent border-b border-gray-700 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600 font-display backdrop-blur-sm" 
              />
            </motion.div>
          </div>

          <motion.div 
            className="group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="block font-mono text-xs text-emerald-500 mb-2 uppercase tracking-widest">Canal de Comunicación</label>
            <input 
              type="email" 
              placeholder="Email Corporativo" 
              className="w-full bg-transparent border-b border-gray-700 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600 font-display backdrop-blur-sm" 
            />
          </motion.div>

          <motion.div 
            className="group"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label className="block font-mono text-xs text-emerald-500 mb-2 uppercase tracking-widest">Parámetros de Misión</label>
            <textarea 
              rows={4} 
              placeholder="Breve contexto operativo..." 
              className="w-full bg-transparent border-b border-gray-700 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-600 font-mono backdrop-blur-sm resize-none"
            />
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-black font-display font-bold py-6 text-xl hover:bg-emerald-500 hover:text-white transition-all duration-300 mt-8 uppercase tracking-tighter relative overflow-hidden"
          >
            <span className="relative z-10 block">Solicitar Enlace</span>
          </motion.button>
        </motion.form>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex justify-between items-end border-t border-gray-800 pt-8 relative z-10"
        >
           <div className="font-mono text-xs text-gray-500">
             BASADO EN BUENOS AIRES<br/>OPERANDO GLOBALMENTE
           </div>
           <div className="font-mono text-xs text-gray-500 text-right">
             ELEVATE AI © 2025<br/>INFRAESTRUCTURA SEGURA
           </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
