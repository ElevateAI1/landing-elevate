
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { Users, Sparkles, Target, Code, Shield, Zap } from 'lucide-react';

// 3D Vector Component for Background
const AboutVector3D = ({ 
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
  const baseX = useTransform(progress, [0, 1], [15 + (index % 6) * 15, 85 - (index % 6) * 15]);
  const baseY = useTransform(progress, [0, 1], [25 + (index % 5) * 20, 75 - (index % 5) * 20]);
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [index * -35, index * 35]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [index * -25, index * 25]);
  const rotateZ = useTransform(progress, [0, 1], [index * 35, index * 35 + 360]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [index * -18, index * 18]);
  const scale = useTransform(progress, [0.2, 0.5, 0.8], [0.7, 1.3, 0.7]);
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 0.5, 0.5, 0]);

  const x = useTransform([baseX, parallaxX], ([bx, px]) => (bx as number) + (px as number));
  const y = useTransform([baseY, parallaxY], ([by, py]) => (by as number) + (py as number));

  const gradId = `about-grad-${index}`;

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
      <svg width="160" height="160" viewBox="0 0 160 160" className="opacity-25">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <g transform="translate(80, 80)">
          {/* 3D Pyramid Shape */}
          <polygon points="0,-35 30,-10 0,35 -30,-10" fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" />
          <polygon points="0,-20 15,-5 0,20 -15,-5" fill="none" stroke={`url(#${gradId})`} strokeWidth="2" />
          {/* Connecting lines for depth */}
          <line x1="0" y1="-35" x2="0" y2="-20" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.6" />
          <line x1="30" y1="-10" x2="15" y2="-5" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.6" />
          <line x1="0" y1="35" x2="0" y2="20" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.6" />
          <line x1="-30" y1="-10" x2="-15" y2="-5" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.6" />
        </g>
      </svg>
    </motion.div>
  );
};

// Floating Particle
const AboutParticle = ({ 
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
  const baseX = useTransform(progress, [0, 1], [startX, endX]);
  const baseY = useTransform(progress, [0, 1], [startY, endY]);
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

// Team Member Card with 3D Effect
const TeamMemberCard = ({ 
  member, 
  index, 
  mouseX, 
  mouseY,
  scrollProgress 
}: { 
  member: any; 
  index: number; 
  mouseX: any; 
  mouseY: any;
  scrollProgress: any;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardRotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const cardRotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);
  const cardParallaxX = useTransform(mouseX, [-0.5, 0.5], [index * -12, index * 12]);
  const cardParallaxY = useTransform(mouseY, [-0.5, 0.5], [index * -8, index * 8]);
  
  const cardOpacity = useTransform(scrollProgress, 
    [index * 0.15, index * 0.15 + 0.2, index * 0.15 + 0.5], 
    [0, 1, 1]
  );
  const cardScale = useTransform(scrollProgress, 
    [index * 0.15, index * 0.15 + 0.2], 
    [0.9, 1]
  );

  return (
    <motion.div
      style={{
        rotateX: cardRotateX,
        rotateY: cardRotateY,
        x: cardParallaxX,
        y: cardParallaxY,
        opacity: cardOpacity,
        scale: cardScale,
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative perspective-[1000px]"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
    >
      <motion.div
        style={{
          boxShadow: isHovered ? '0 0 40px rgba(16, 185, 129, 0.4)' : '0 0 0px rgba(16, 185, 129, 0)',
        }}
        className="relative bg-neutral-900/70 backdrop-blur-xl border border-emerald-500/20 p-8 rounded-lg overflow-hidden group hover:border-emerald-500/60 transition-all duration-500 h-[480px] flex flex-col"
      >
        {/* Background Glow */}
        <motion.div
          style={{
            background: `radial-gradient(circle at center, rgba(16, 185, 129, ${isHovered ? 0.15 : 0.05}), transparent 70%)`,
          }}
          className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity"
        />

        {/* Founder Badge */}
        {member.isFounder && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full"
          >
            <span className="font-mono text-xs text-emerald-500 uppercase tracking-widest">FUNDADOR</span>
          </motion.div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col flex-1">
          {/* Avatar - Image or Initial */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 mb-6 rounded-full flex items-center justify-center font-mono text-emerald-100 font-bold text-2xl shadow-lg shadow-emerald-500/30 flex-shrink-0 overflow-hidden relative bg-gradient-to-br from-emerald-500 to-emerald-700"
          >
            {member.image_url && member.image_url.trim() !== '' ? (
              <>
                <img 
                  src={member.image_url} 
                  alt={member.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Si la imagen falla, ocultar la imagen y mostrar la inicial
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.avatar-fallback') as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <span className="avatar-fallback absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full" style={{ display: 'none' }}>
                  {member.name.charAt(0)}
                </span>
              </>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center">
                {member.name.charAt(0)}
              </span>
            )}
          </motion.div>

          <h3 className="font-display text-2xl md:text-3xl text-white mb-2 group-hover:text-emerald-400 transition-colors flex-shrink-0">
            {member.name}
          </h3>
          <div className="font-mono text-sm text-emerald-500 mb-4 uppercase tracking-widest flex-shrink-0">
            {member.role}
          </div>
          <p className="font-mono text-gray-400 text-sm md:text-base leading-relaxed flex-1 overflow-hidden pb-4">
            {member.bio}
          </p>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-3 right-3 w-12 h-12 border-t border-r border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 left-3 w-12 h-12 border-b border-l border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </motion.div>
  );
};

const AboutUsNarrative: React.FC = () => {
  const { teamMembers } = useData();
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
  const bgGridScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const bgGridRotate = useTransform(mouseXSpring, [-0.5, 0.5], [-2, 2]);

  const vectorLineY1 = useTransform(scrollYProgress, [0, 1], ["-25%", "125%"]);
  const vectorLineY2 = useTransform(scrollYProgress, [0, 1], ["125%", "-25%"]);
  const vectorLineX = useTransform(mouseXSpring, [-0.5, 0.5], [-35, 35]);

  const geometryRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const geometryScale = useTransform(scrollYProgress, [0.2, 0.8], [0.6, 1.4]);
  const geometryX = useTransform(mouseXSpring, [-0.5, 0.5], [-50, 50]);
  const geometryY = useTransform(mouseYSpring, [-0.5, 0.5], [-50, 50]);

  // Generate vectors and particles
  const vectors = Array.from({ length: 20 }).map((_, i) => i);
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    endX: Math.random() * 100,
    endY: Math.random() * 100,
  }));

  const founders = teamMembers.filter(m => m.isFounder);
  const team = teamMembers.filter(m => !m.isFounder);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-neutral-950 pt-24 pb-20 relative overflow-hidden"
      onMouseMove={handleMouseMove}
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
      </div>

      {/* LAYER 2: 3D Vectors */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {vectors.map((i) => {
          const vectorX = useTransform(scrollYProgress, [0, 1], [15 + (i % 6) * 15, 85 - (i % 6) * 15]);
          const vectorY = useTransform(scrollYProgress, [0, 1], [25 + (i % 5) * 20, 75 - (i % 5) * 20]);
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
              <AboutVector3D progress={scrollYProgress} mouseX={mouseXSpring} mouseY={mouseYSpring} index={i} />
            </motion.div>
          );
        })}
      </div>

      {/* LAYER 3: Floating Particles */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        {particles.map((p) => (
          <AboutParticle 
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
          className="text-center mb-20 pt-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <Users className="w-6 h-6 text-emerald-500" />
            <span className="font-mono text-xs text-emerald-500 tracking-widest uppercase">QUIÉNES SOMOS</span>
          </motion.div>
          
          <h1 className="font-display text-5xl md:text-7xl text-white mb-6 leading-none">
            NUESTRA HISTORIA
          </h1>
          <p className="font-mono text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Construimos infraestructura de IA para organizaciones que no pueden permitirse fallar. 
            Nacimos de la necesidad de cerrar la brecha entre la promesa de la IA y la realidad del cumplimiento regulatorio.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-32 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'MISIÓN', desc: 'Democratizar IA segura y regulada para sectores críticos.' },
              { icon: Shield, title: 'VISIÓN', desc: 'Ser el estándar de infraestructura de IA de cumplimiento.' },
              { icon: Zap, title: 'VALORES', desc: 'Transparencia, seguridad y excelencia operativa.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className="p-6 border border-emerald-500/20 bg-neutral-900/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all"
              >
                <item.icon className="w-8 h-8 text-emerald-500 mb-4" />
                <h3 className="font-display text-xl text-white mb-2">{item.title}</h3>
                <p className="font-mono text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Founders Section */}
        {founders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-32"
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <Sparkles className="w-6 h-6 text-emerald-500" />
                <span className="font-mono text-xs text-emerald-500 tracking-widest uppercase">FUNDADORES</span>
              </motion.div>
              <h2 className="font-display text-4xl md:text-6xl text-white mb-4">
                LOS ARQUITECTOS
              </h2>
              <p className="font-mono text-gray-400 text-lg max-w-2xl mx-auto">
                Visionarios que transformaron la experiencia en infraestructura.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {founders.map((founder, index) => (
                <TeamMemberCard
                  key={founder.id}
                  member={founder}
                  index={index}
                  mouseX={mouseXSpring}
                  mouseY={mouseYSpring}
                  scrollProgress={scrollYProgress}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Team Section */}
        {team.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <Code className="w-6 h-6 text-emerald-500" />
                <span className="font-mono text-xs text-emerald-500 tracking-widest uppercase">EQUIPO</span>
              </motion.div>
              <h2 className="font-display text-4xl md:text-6xl text-white mb-4">
                EL EQUIPO
              </h2>
              <p className="font-mono text-gray-400 text-lg max-w-2xl mx-auto">
                Ingenieros, investigadores y estrategas dedicados a la excelencia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {team.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  index={founders.length + index}
                  mouseX={mouseXSpring}
                  mouseY={mouseYSpring}
                  scrollProgress={scrollYProgress}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AboutUsNarrative;

