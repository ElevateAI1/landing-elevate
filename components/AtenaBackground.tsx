
import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useScroll } from 'framer-motion';

const AtenaBackground: React.FC = () => {
  // Scroll-based parallax
  const { scrollYProgress } = useScroll();

  // Mouse position tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 400 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Parallax transforms for atena.png background layer (deepest layer, moves slowest)
  // Mouse parallax - very subtle movement for depth
  const atenaX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const atenaY = useTransform(springY, [-0.5, 0.5], [-30, 30]);
  // Scroll parallax - slow vertical movement
  const atenaScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  // Scale effect on scroll for depth
  const atenaScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) - 0.5);
      mouseY.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x: atenaX,
        y: atenaY,
        translateY: atenaScrollY,
        scale: atenaScale,
        zIndex: -1,
      }}
      className="fixed inset-0 pointer-events-none"
    >
      <img 
        src="/atena.png" 
        alt="Atena Background" 
        className="w-full h-full object-cover opacity-[0.08] mix-blend-overlay"
        style={{
          filter: 'grayscale(100%) brightness(0.3) contrast(1.2)',
          imageRendering: 'crisp-edges', // Vector-like effect
        }}
      />
    </motion.div>
  );
};

export default AtenaBackground;

