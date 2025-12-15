
import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue } from 'framer-motion';

const METHODOLOGY_STEPS = [
  {
    num: '01',
    title: 'Auditoría Estratégica',
    subtitle: 'El Bootcamp (6H)',
    desc: 'Mapeamos el abismo. Un análisis profundo de sus riesgos, preparación de datos y restricciones regulatorias. Entregamos una hoja de ruta, no diapositivas.',
    color: '#10b981', // emerald
  },
  {
    num: '02',
    title: 'Despliegue Embebido',
    subtitle: 'Despliegue Avanzado',
    desc: 'Nuestros ingenieros se integran directamente en sus operaciones. Construimos arquitectura personalizada que se asienta en su hardware, en su nube, de forma segura.',
    color: '#ffffff', // white
  },
  {
    num: '03',
    title: 'Gobernanza y Escala',
    subtitle: 'Cumplimiento por Diseño',
    desc: 'El trabajo no termina en el despliegue. Instalamos marcos de gobernanza automatizados para asegurar que su IA se comporte conforme evolucionan las regulaciones.',
    color: '#10b981', // emerald
  }
];

// 3D Vector Component
const Vector3D = ({ 
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
  const baseX = useTransform(progress, [0, 1], [20 + index * 20, 80 - index * 20]);
  const baseY = useTransform(progress, [0, 1], [30 + index * 15, 70 - index * 15]);
  // Enhanced parallax - MORE MOVEMENT
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [index * -50, index * 50]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [index * -35, index * 35]);
  const rotateZ = useTransform(progress, [0, 1], [index * 45, index * 45 + 720]);
  const scale = useTransform(progress, [0.2, 0.5, 0.8], [0.7, 1.3, 0.7]);
  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 0.7, 0.7, 0]);

  const x = useTransform([baseX, parallaxX], ([bx, px]) => (bx as number) + (px as number));
  const y = useTransform([baseY, parallaxY], ([by, py]) => (by as number) + (py as number));

  const gradId = `grad-${index}`;

  return (
    <motion.div
      style={{
        x: useTransform(x, (val) => `${val}%`),
        y: useTransform(y, (val) => `${val}%`),
        rotateZ,
        scale,
        opacity,
      }}
      className="absolute pointer-events-none"
    >
      <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-30">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <g transform="translate(100, 100)">
          <polygon points="-40,-40 40,-40 40,40 -40,40" fill="none" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.3" />
          <polygon points="-20,-20 20,-20 20,20 -20,20" fill="none" stroke={`url(#${gradId})`} strokeWidth="2" />
          <line x1="-40" y1="-40" x2="-20" y2="-20" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.5" />
          <line x1="40" y1="-40" x2="20" y2="-20" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.5" />
          <line x1="40" y1="40" x2="20" y2="20" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.5" />
          <line x1="-40" y1="40" x2="-20" y2="20" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.5" />
        </g>
      </svg>
    </motion.div>
  );
};

// Floating Particle
const Particle = ({ 
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
  const x = useTransform(progress, [0, 1], [startX, endX]);
  const y = useTransform(progress, [0, 1], [startY, endY]);
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [index * -15, index * 15]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [index * -10, index * 10]);
  const scale = useTransform(progress, [0, 0.5, 1], [0, 1, 0]);
  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const finalX = useTransform([x, parallaxX], ([xVal, px]) => (xVal as number) + (px as number));
  const finalY = useTransform([y, parallaxY], ([yVal, py]) => (yVal as number) + (py as number));

  return (
    <motion.div
      style={{
        x: useTransform(finalX, (val) => `${val}%`),
        y: useTransform(finalY, (val) => `${val}%`),
        scale,
        opacity,
      }}
      className="absolute w-2 h-2 bg-emerald-500 rounded-full blur-[2px]"
    />
  );
};

const Methodology: React.FC = () => {
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

  // Multi-layer Parallax Transforms - ENHANCED
  // Layer 1: Deep Background Grid (slowest - increased parallax)
  const bgGridX = useTransform(mouseXSpring, [-0.5, 0.5], [-80, 80]);
  const bgGridY = useTransform(mouseYSpring, [-0.5, 0.5], [-80, 80]);
  const bgGridScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const bgGridRotate = useTransform(mouseXSpring, [-0.5, 0.5], [-5, 5]);

  // Layer 2: Vector Lines (medium speed - more lines, more parallax)
  const vectorLineY1 = useTransform(scrollYProgress, [0, 1], ["-20%", "120%"]);
  const vectorLineY2 = useTransform(scrollYProgress, [0, 1], ["120%", "-20%"]);
  const vectorLineY3 = useTransform(scrollYProgress, [0, 1], ["-10%", "110%"]);
  const vectorLineX = useTransform(mouseXSpring, [-0.5, 0.5], [-50, 50]);

  // Layer 3: Floating Geometry (faster - increased parallax)
  const geometryRotate = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const geometryScale = useTransform(scrollYProgress, [0.2, 0.8], [0.5, 1.6]);
  const geometryX = useTransform(mouseXSpring, [-0.5, 0.5], [-80, 80]);
  const geometryY = useTransform(mouseYSpring, [-0.5, 0.5], [-80, 80]);
  const geometryRotateX = useTransform(mouseYSpring, [-0.5, 0.5], [-15, 15]);
  const geometryRotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]);


  // Generate vectors and particles with random positions - MORE VECTORS
  const vectors = useMemo(() => Array.from({ length: 18 }).map((_, i) => i), []);
  const particles = useMemo(() => 
    Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      endX: Math.random() * 100,
      endY: Math.random() * 100,
    })), 
    []
  );

  return (
    <section 
      ref={containerRef} 
      id="methodology" 
      className="relative min-h-[200vh] py-40 bg-neutral-950 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* LAYER 0: Deep Background Grid (Slowest Parallax - ENHANCED) */}
      <motion.div
        style={{
          x: bgGridX,
          y: bgGridY,
          translateY: bgGridScrollY,
          rotate: bgGridRotate,
        }}
        className="absolute inset-0 z-0 opacity-10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:80px_80px] [transform:perspective(1000px)_rotateX(75deg)_scale(1.5)] origin-center" />
        {/* Additional grid layer for depth */}
        <motion.div
          style={{
            x: useTransform(mouseXSpring, [-0.5, 0.5], [-30, 30]),
            y: useTransform(mouseYSpring, [-0.5, 0.5], [-30, 30]),
          }}
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:120px_120px] [transform:perspective(1000px)_rotateX(75deg)_scale(1.8)] origin-center opacity-50"
        />
      </motion.div>

      {/* LAYER 1: Vector Lines (Medium Parallax - MORE LINES) */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <motion.div
          style={{ y: vectorLineY1, x: vectorLineX }}
          className="absolute left-[15%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent"
        />
        <motion.div
          style={{ y: vectorLineY2, x: useTransform(mouseXSpring, [-0.5, 0.5], [50, -50]) }}
          className="absolute right-[15%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent"
        />
        <motion.div
          style={{ y: vectorLineY3, x: useTransform(mouseXSpring, [-0.5, 0.5], [-40, 40]) }}
          className="absolute left-[35%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/25 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["120%", "-20%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [30, -30]) }}
          className="absolute right-[35%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/25 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [-30, 30]) }}
          className="absolute left-1/2 top-0 w-[1px] h-[150%] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["-30%", "130%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [25, -25]) }}
          className="absolute left-[5%] top-0 w-[1px] h-[180%] bg-gradient-to-b from-transparent via-emerald-500/15 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["130%", "-30%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [-25, 25]) }}
          className="absolute right-[5%] top-0 w-[1px] h-[180%] bg-gradient-to-b from-transparent via-emerald-500/15 to-transparent"
        />
      </div>

      {/* LAYER 2: 3D Vectors (Floating Geometry - MORE VECTORS, MORE PARALLAX) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {vectors.map((i) => {
          const vectorX = useTransform(scrollYProgress, [0, 1], [10 + (i % 6) * 15, 90 - (i % 6) * 15]);
          const vectorY = useTransform(scrollYProgress, [0, 1], [20 + (i % 5) * 12, 80 - (i % 5) * 12]);
          const finalX = useTransform([geometryX, vectorX], ([gx, vx]) => (gx as number) + (vx as number));
          const finalY = useTransform([geometryY, vectorY], ([gy, vy]) => (gy as number) + (vy as number));
          const vectorParallaxX = useTransform(mouseXSpring, [-0.5, 0.5], [i * -25, i * 25]);
          const vectorParallaxY = useTransform(mouseYSpring, [-0.5, 0.5], [i * -18, i * 18]);
          const finalXWithParallax = useTransform([finalX, vectorParallaxX], ([fx, px]) => (fx as number) + (px as number));
          const finalYWithParallax = useTransform([finalY, vectorParallaxY], ([fy, py]) => (fy as number) + (py as number));
          
          return (
            <motion.div
              key={i}
              style={{
                x: useTransform(finalXWithParallax, (val) => `${val}%`),
                y: useTransform(finalYWithParallax, (val) => `${val}%`),
                rotate: geometryRotate,
                rotateX: geometryRotateX,
                rotateY: geometryRotateY,
                scale: geometryScale,
                opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.5, 0.5, 0]),
                transformStyle: "preserve-3d",
              }}
              className="absolute"
            >
              <Vector3D progress={scrollYProgress} mouseX={mouseXSpring} mouseY={mouseYSpring} index={i} />
            </motion.div>
          );
        })}
      </div>

      {/* LAYER 3: Floating Particles */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        {particles.map((p) => (
          <Particle 
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

      {/* LAYER 4: Main Content */}
      <div className="container mx-auto px-6 relative z-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-emerald-500 rounded-full"
            />
            <span className="font-mono text-xs text-emerald-500 tracking-widest uppercase">PROTOCOLO ACTIVADO</span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-none">
            EL PROTOCOLO
          </h2>
          <p className="font-mono text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Tres pasos para transformar riesgo en infraestructura.
          </p>
        </motion.div>

        {/* Steps Cards with 3D Effects - Reduced spacing */}
        <div className="space-y-20 md:space-y-24">
          {METHODOLOGY_STEPS.map((step, index) => {
            const cardProgress = useTransform(scrollYProgress, 
              [index * 0.25, (index + 1) * 0.25], 
              [0, 1]
            );
            
            // Enhanced parallax for cards - MORE MOVEMENT
            const cardRotateX = useTransform(mouseYSpring, [-0.5, 0.5], [8, -8]);
            const cardRotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-8, 8]);
            const cardZ = useTransform(cardProgress, [0, 1], [-150, 0]);
            const cardOpacity = useTransform(cardProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8]);
            const cardScale = useTransform(cardProgress, [0, 0.5, 1], [0.85, 1, 0.95]);
            // Additional parallax movement for cards
            const cardParallaxX = useTransform(mouseXSpring, [-0.5, 0.5], [index * -20, index * 20]);
            const cardParallaxY = useTransform(mouseYSpring, [-0.5, 0.5], [index * -15, index * 15]);

            return (
              <motion.div
                key={step.num}
                style={{
                  rotateX: cardRotateX,
                  rotateY: cardRotateY,
                  z: cardZ,
                  opacity: cardOpacity,
                  scale: cardScale,
                  x: cardParallaxX,
                  y: cardParallaxY,
                  transformStyle: "preserve-3d",
                }}
                className="relative perspective-[1000px] max-w-4xl mx-auto"
              >
                <div className="relative bg-neutral-900/60 backdrop-blur-xl border border-emerald-500/30 p-6 md:p-8 rounded-lg overflow-hidden group hover:border-emerald-500/60 transition-all duration-500">
                  {/* Card Background Glow */}
                  <motion.div
                    style={{
                      background: `radial-gradient(circle at center, ${step.color}15, transparent 70%)`,
                    }}
                    className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity"
                  />

                  {/* Animated Border */}
                  <motion.div
                    style={{
                      background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
                    }}
                    className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <motion.span
                        style={{
                          color: step.color,
                        }}
                        className="font-display text-6xl md:text-7xl font-bold opacity-20 group-hover:opacity-30 transition-opacity"
                      >
                        {step.num}
                      </motion.span>
                      <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest border border-gray-700 px-3 py-1.5 rounded-full bg-black/50">
                        {step.subtitle}
                      </div>
                    </div>

                    <h3 
                      className="font-display text-3xl md:text-4xl text-white mb-4 group-hover:text-emerald-400 transition-colors"
                      style={{ color: step.color === '#ffffff' ? '#ffffff' : undefined }}
                    >
                      {step.title}
                    </h3>
                    <p className="font-mono text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
                      {step.desc}
                    </p>

                    {/* Progress Indicator */}
                    <div className="mt-8 h-[2px] bg-gray-800 relative overflow-hidden">
                      <motion.div
                        style={{
                          background: step.color,
                          width: useTransform(cardProgress, [0, 1], ['0%', '100%']),
                        }}
                        className="absolute top-0 left-0 h-full"
                      />
                    </div>
                  </div>

                  {/* 3D Corner Accent - Smaller */}
                  <div className="absolute top-3 right-3 w-12 h-12 border-t border-r border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 w-12 h-12 border-b border-l border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* LAYER 5: Ambient Light Effects */}
      <motion.div
        style={{
          x: useTransform(mouseXSpring, [-0.5, 0.5], [-100, 100]),
          y: useTransform(mouseYSpring, [-0.5, 0.5], [-100, 100]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3]),
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-5"
      />
      <motion.div
        style={{
          x: useTransform(mouseXSpring, [-0.5, 0.5], [100, -100]),
          y: useTransform(mouseYSpring, [-0.5, 0.5], [100, -100]),
          opacity: useTransform(scrollYProgress, [0.3, 0.7], [0.2, 0.4]),
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-5"
      />
    </section>
  );
};

export default Methodology;
