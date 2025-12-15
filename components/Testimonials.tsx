
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Quote, CheckCircle2, Shield, TrendingUp } from 'lucide-react';

// 3D Vector Component for Background
const EvidenceVector3D = ({ 
  progress, 
  mouseX, 
  mouseY, 
  index 
}: { 
  progress: any; 
  mouseX: any; 
  mouseY: any; 
  index: number;
}) => {
  const baseX = useTransform(progress, [0, 1], [15 + (index % 7) * 12, 85 - (index % 7) * 12]);
  const baseY = useTransform(progress, [0, 1], [25 + (index % 5) * 18, 75 - (index % 5) * 18]);
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [index * -35, index * 35]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [index * -25, index * 25]);
  const rotateZ = useTransform(progress, [0, 1], [index * 40, index * 40 + 360]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [index * -20, index * 20]);
  const scale = useTransform(progress, [0.2, 0.5, 0.8], [0.7, 1.3, 0.7]);
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 0.5, 0.5, 0]);

  const x = useTransform([baseX, parallaxX], ([bx, px]) => (bx as number) + (px as number));
  const y = useTransform([baseY, parallaxY], ([by, py]) => (by as number) + (py as number));

  const gradId = `evidence-grad-${index}`;

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
      <svg width="180" height="180" viewBox="0 0 180 180" className="opacity-25">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <g transform="translate(90, 90)">
          {/* 3D Diamond/Hexagon Shape */}
          <polygon points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" />
          <polygon points="0,-25 20,-12 20,12 0,25 -20,12 -20,-12" fill="none" stroke={`url(#${gradId})`} strokeWidth="2" />
          {/* Connecting lines for depth */}
          <line x1="0" y1="-40" x2="0" y2="-25" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.6" />
          <line x1="35" y1="-20" x2="20" y2="-12" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.6" />
          <line x1="35" y1="20" x2="20" y2="12" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.6" />
          <line x1="0" y1="40" x2="0" y2="25" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.6" />
          <line x1="-35" y1="20" x2="-20" y2="12" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.6" />
          <line x1="-35" y1="-20" x2="-20" y2="-12" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.6" />
        </g>
      </svg>
    </motion.div>
  );
};

// Floating Particle
const EvidenceParticle = ({ 
  progress, 
  mouseX, 
  mouseY, 
  index,
  startX,
  startY,
  endX,
  endY
}: { 
  progress: any; 
  mouseX: any; 
  mouseY: any; 
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
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [index * -12, index * 12]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [index * -8, index * 8]);
  
  const scale = useTransform(progress, [0, 0.5, 1], [0, 1, 0]);
  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 0.9, 0.9, 0]);

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
      className="absolute w-2 h-2 bg-emerald-400 rounded-full blur-[1.5px]"
    />
  );
};

// 3D Testimonial Card Component
const TestimonialCard3D = ({ 
  testimonial, 
  index, 
  mouseX, 
  mouseY,
  scrollProgress 
}: { 
  testimonial: any; 
  index: number; 
  mouseX: any; 
  mouseY: any;
  scrollProgress: any;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Effect
  const cardRotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const cardRotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const cardZ = useTransform(scrollProgress, [0, 1], [index * -50, index * 50]);
  
  // Parallax movement based on index
  const cardParallaxX = useTransform(mouseX, [-0.5, 0.5], [index * -15, index * 15]);
  const cardParallaxY = useTransform(mouseY, [-0.5, 0.5], [index * -10, index * 10]);
  
  // Scroll-based animation
  const cardOpacity = useTransform(scrollProgress, 
    [index * 0.2, index * 0.2 + 0.3, index * 0.2 + 0.6], 
    [0, 1, 1]
  );
  const cardScale = useTransform(scrollProgress, 
    [index * 0.2, index * 0.2 + 0.3], 
    [0.85, 1]
  );

  // Glow effect on hover
  const glowIntensity = useTransform(
    useMotionValue(isHovered ? 1 : 0),
    [0, 1],
    [0, 0.3]
  );

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX: cardRotateX,
        rotateY: cardRotateY,
        z: cardZ,
        x: cardParallaxX,
        y: cardParallaxY,
        opacity: cardOpacity,
        scale: cardScale,
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative perspective-[1000px]"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
    >
      <motion.div
        style={{
          boxShadow: useTransform(glowIntensity, (val) => 
            `0 0 ${60 * val}px rgba(16, 185, 129, ${val}), 0 0 ${100 * val}px rgba(16, 185, 129, ${val * 0.5})`
          ),
        }}
        className="relative bg-neutral-900/60 backdrop-blur-xl border border-emerald-500/20 p-8 md:p-10 rounded-lg overflow-hidden group hover:border-emerald-500/60 transition-all duration-500"
      >
        {/* Animated Background Gradient */}
        <motion.div
          style={{
            background: `radial-gradient(circle at ${useTransform(mouseX, [-0.5, 0.5], [30, 70])}% ${useTransform(mouseY, [-0.5, 0.5], [30, 70])}%, rgba(16, 185, 129, 0.1), transparent 70%)`,
          }}
          className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Animated Border Glow */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(135deg, transparent, rgba(16, 185, 129, 0.3), transparent)`,
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Quote Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
            className="mb-6"
          >
            <Quote className="w-12 h-12 text-emerald-500/30" />
          </motion.div>

          {/* Quote Text */}
          <motion.blockquote
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
            className="font-display text-2xl md:text-3xl text-white mb-8 leading-relaxed relative"
          >
            <span className="absolute -left-4 text-emerald-500/20 text-6xl font-bold leading-none">"</span>
            <span className="relative z-10">{testimonial.quote}</span>
            <span className="absolute -right-4 text-emerald-500/20 text-6xl font-bold leading-none">"</span>
          </motion.blockquote>

          {/* Author Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
            className="flex items-center gap-6 pt-6 border-t border-emerald-500/20"
          >
            {/* Avatar with 3D effect */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center font-mono text-emerald-100 font-bold text-xl shadow-lg shadow-emerald-500/30">
                {testimonial.author.charAt(0)}
              </div>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-emerald-500/50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            <div className="flex-1">
              <div className="text-white font-bold font-mono text-lg mb-1">{testimonial.author}</div>
              <div className="text-gray-400 text-sm font-mono mb-2">{testimonial.role} @ {testimonial.company}</div>
              {testimonial.industry && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500 text-xs font-mono uppercase">{testimonial.industry}</span>
                </div>
              )}
            </div>

            {/* Verification Badge */}
            <motion.div
              whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </motion.div>
          </motion.div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-4 right-4 w-16 h-16 border-t border-r border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b border-l border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </motion.div>
  );
};

const Testimonials: React.FC = () => {
  const { testimonials } = useData();
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
  const bgGridX = useTransform(mouseXSpring, [-0.5, 0.5], [-50, 50]);
  const bgGridY = useTransform(mouseYSpring, [-0.5, 0.5], [-50, 50]);
  const bgGridScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const bgGridRotate = useTransform(mouseXSpring, [-0.5, 0.5], [-2, 2]);

  const vectorLineY1 = useTransform(scrollYProgress, [0, 1], ["-25%", "125%"]);
  const vectorLineY2 = useTransform(scrollYProgress, [0, 1], ["125%", "-25%"]);
  const vectorLineX = useTransform(mouseXSpring, [-0.5, 0.5], [-35, 35]);

  const geometryRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const geometryScale = useTransform(scrollYProgress, [0.2, 0.8], [0.6, 1.4]);
  const geometryX = useTransform(mouseXSpring, [-0.5, 0.5], [-50, 50]);
  const geometryY = useTransform(mouseYSpring, [-0.5, 0.5], [-50, 50]);

  // Generate vectors and particles - INCREASED
  const vectors = Array.from({ length: 24 }).map((_, i) => i);
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    endX: Math.random() * 100,
    endY: Math.random() * 100,
  }));

  return (
    <section 
      ref={containerRef}
      className="min-h-screen py-40 bg-neutral-950 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      id="testimonials"
    >
      {/* LAYER 0: Deep Background Grid */}
      <motion.div
        style={{
          x: bgGridX,
          y: bgGridY,
          translateY: bgGridScrollY,
          rotate: bgGridRotate,
        }}
        className="absolute inset-0 z-0 opacity-8"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:90px_90px] [transform:perspective(1100px)_rotateX(78deg)_scale(1.8)] origin-center" />
      </motion.div>

      {/* LAYER 1: Vector Lines */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <motion.div
          style={{ y: vectorLineY1, x: vectorLineX }}
          className="absolute left-[18%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/25 to-transparent"
        />
        <motion.div
          style={{ y: vectorLineY2, x: useTransform(mouseXSpring, [-0.5, 0.5], [35, -35]) }}
          className="absolute right-[18%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/25 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["55%", "-45%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [-25, 25]) }}
          className="absolute left-1/2 top-0 w-[1px] h-[150%] bg-gradient-to-b from-transparent via-emerald-500/18 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["-30%", "130%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [22, -22]) }}
          className="absolute left-[10%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["130%", "-30%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [-22, 22]) }}
          className="absolute right-[10%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["-25%", "125%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [18, -18]) }}
          className="absolute left-[28%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/22 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["125%", "-25%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [-18, 18]) }}
          className="absolute right-[28%] top-0 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-emerald-500/22 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["-35%", "135%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [28, -28]) }}
          className="absolute left-[5%] top-0 w-[1px] h-[180%] bg-gradient-to-b from-transparent via-emerald-500/15 to-transparent"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["135%", "-35%"]), x: useTransform(mouseXSpring, [-0.5, 0.5], [-28, 28]) }}
          className="absolute right-[5%] top-0 w-[1px] h-[180%] bg-gradient-to-b from-transparent via-emerald-500/15 to-transparent"
        />
      </div>

      {/* LAYER 2: 3D Vectors */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {vectors.map((i) => {
          const vectorX = useTransform(scrollYProgress, [0, 1], [15 + (i % 7) * 12, 85 - (i % 7) * 12]);
          const vectorY = useTransform(scrollYProgress, [0, 1], [25 + (i % 5) * 18, 75 - (i % 5) * 18]);
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
                opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.4, 0.4, 0]),
                transformStyle: "preserve-3d",
              }}
              className="absolute"
            >
              <EvidenceVector3D progress={scrollYProgress} mouseX={mouseXSpring} mouseY={mouseYSpring} index={i} />
            </motion.div>
          );
        })}
         </div>
         
      {/* LAYER 3: Floating Particles */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        {particles.map((p) => (
          <EvidenceParticle 
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

      {/* LAYER 4: Ambient Lights */}
      <motion.div
        style={{
          x: useTransform(mouseXSpring, [-0.5, 0.5], [-100, 100]),
          y: useTransform(mouseYSpring, [-0.5, 0.5], [-100, 100]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.4, 0.2]),
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none z-5"
      />
      <motion.div
        style={{
          x: useTransform(mouseXSpring, [-0.5, 0.5], [100, -100]),
          y: useTransform(mouseYSpring, [-0.5, 0.5], [100, -100]),
          opacity: useTransform(scrollYProgress, [0.3, 0.7], [0.15, 0.3]),
        }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/6 rounded-full blur-[110px] pointer-events-none z-5"
      />

      {/* LAYER 5: Main Content */}
      <div className="container mx-auto px-6 relative z-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <Shield className="w-6 h-6 text-emerald-500" />
            <span className="font-mono text-xs text-emerald-500 tracking-widest uppercase">EVIDENCIA VERIFICADA</span>
          </motion.div>
          
          <h2 className="font-display text-5xl md:text-7xl text-white mb-6 leading-none">
            EVIDENCIA
          </h2>
          <p className="font-mono text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            La confianza no se da. Se audita. Resultados verificados de sectores regulados.
          </p>

          {/* Compliance Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-4 px-6 py-4 border border-emerald-500/30 bg-emerald-900/10 rounded-lg backdrop-blur-sm"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                   <div>
              <span className="font-mono text-emerald-500 text-xs block mb-1 uppercase tracking-widest">INSIGNIA DE CUMPLIMIENTO</span>
              <div className="text-white font-bold text-sm">Procesos Certificados ISO 27001</div>
                   </div>
          </motion.div>
        </motion.div>

        {/* Testimonials Grid - Spacious Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 max-w-7xl mx-auto">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard3D
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
                mouseX={mouseXSpring}
                mouseY={mouseYSpring}
                scrollProgress={scrollYProgress}
              />
            ))}
          </AnimatePresence>
         </div>
       </div>
    </section>
  );
};

export default Testimonials;
