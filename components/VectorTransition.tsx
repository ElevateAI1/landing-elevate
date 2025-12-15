import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

const VectorTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth out the scroll value for fluidity
  const smoothScroll = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  // --- TRANSFORMS ---

  // 1. Expansion: Pulls the two halves apart
  const leftX = useTransform(smoothScroll, [0.2, 0.8], ["0%", "-15%"]);
  const rightX = useTransform(smoothScroll, [0.2, 0.8], ["0%", "15%"]);

  // 2. Color Morph: Emerald (Hero) -> Red (Problem)
  const strokeColor = useTransform(smoothScroll, [0.2, 0.6], ["#10b981", "#ef4444"]);
  const fillColor = useTransform(smoothScroll, [0.2, 0.6], ["rgba(16,185,129,0.05)", "rgba(239,68,68,0.1)"]);
  
  // 3. Central Chaos Line (The Glitch)
  // We compress the amplitude scale to make it "flatline" at edges and chaotic in middle
  const amplitude = useTransform(smoothScroll, [0, 0.5, 1], [0, 50, 0]); 
  
  return (
    <div 
        ref={containerRef}
        className="relative h-[60vh] w-full bg-neutral-950 overflow-hidden flex items-center justify-center z-20"
    >
      {/* Background Grid that distorts */}
      <motion.div 
        style={{ opacity: useTransform(smoothScroll, [0, 0.5, 1], [0.1, 0.3, 0.1]) }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px]"
      />

      <div className="relative w-full max-w-[1920px] h-full flex items-center justify-center">
        
        {/* LEFT PLATE */}
        <motion.div 
            style={{ x: leftX }}
            className="absolute left-0 top-0 bottom-0 w-[55%] z-10"
        >
            <svg className="w-full h-full" preserveAspectRatio="none">
                <motion.path 
                    d="M0,0 L1000,0 L900,100 L950,200 L850,300 L950,400 L850,500 L950,600 L900,700 L1000,800 L1000,1200 L0,1200 Z"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
                {/* Circuit lines on the plate */}
                <motion.path d="M0,100 L850,100" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.3" />
                <motion.path d="M0,300 L800,300" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.3" />
                <motion.path d="M0,500 L800,500" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.3" />
            </svg>
        </motion.div>

        {/* RIGHT PLATE */}
        <motion.div 
            style={{ x: rightX }}
            className="absolute right-0 top-0 bottom-0 w-[55%] z-10"
        >
             <svg className="w-full h-full" preserveAspectRatio="none">
                {/* Inverted jagged path */}
                <motion.path 
                    d="M1000,0 L0,0 L100,100 L50,200 L150,300 L50,400 L150,500 L50,600 L100,700 L0,800 L0,1200 L1000,1200 Z"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
                 {/* Circuit lines on the plate */}
                <motion.path d="M150,200 L1000,200" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.3" />
                <motion.path d="M200,400 L1000,400" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.3" />
                <motion.path d="M150,600 L1000,600" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.3" />
            </svg>
        </motion.div>

        {/* CENTER BREACH (The Glitch Line) */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
             <ChaosLine strokeColor={strokeColor} amplitude={amplitude} />
        </div>

        {/* Floating Particles in the gap */}
        <motion.div className="absolute inset-0 flex items-center justify-center z-0">
            {[...Array(5)].map((_, i) => (
                <Particle key={i} scrollY={smoothScroll} index={i} color={strokeColor} />
            ))}
        </motion.div>

      </div>
      
      {/* Vignette Overlay to blend top/bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950 pointer-events-none z-20" />
    </div>
  );
};

interface ChaosLineProps {
    strokeColor: MotionValue<string>;
    amplitude: MotionValue<number>;
}

// Sub-component for the frantic center line
const ChaosLine: React.FC<ChaosLineProps> = ({ strokeColor, amplitude }) => {
    // Default path values to prevent undefined errors
    const defaultPath1 = "M0,50 Q10,40 20,50 T40,50 T60,50 T80,50 T100,50 T120,50 T140,50 T160,50 T180,50 T200,50";
    const defaultPath2 = "M0,50 L100,50";
    
    const pathVariants1 = [
        "M0,50 L10,20 L20,80 L30,50 L40,10 L50,90 L60,50 L70,30 L80,70 L90,50 L100,50",
        "M0,50 L10,80 L20,20 L30,50 L40,90 L50,10 L60,50 L70,70 L80,30 L90,50 L100,50",
        "M0,50 L10,50 L20,50 L30,50 L40,50 L50,50 L60,50 L70,50 L80,50 L90,50 L100,50"
    ];
    
    const pathVariants2 = [
        "M0,50 L20,30 L40,70 L60,30 L80,70 L100,50",
        "M0,50 L20,70 L40,30 L60,70 L80,30 L100,50"
    ];
    
    return (
        <svg className="w-full h-full opacity-80" preserveAspectRatio="none">
            <motion.path
                initial={{ d: defaultPath1 }}
                animate={{ d: pathVariants1 }}
                style={{
                    scaleY: amplitude,
                    stroke: strokeColor,
                    strokeWidth: 2,
                    fill: "none",
                    vectorEffect: "non-scaling-stroke"
                }}
                transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
            />
             {/* Secondary Ghost Line */}
             <motion.path
                initial={{ d: defaultPath2 }}
                animate={{ d: pathVariants2 }}
                style={{
                    scaleY: useTransform(amplitude, (v) => v * 0.5),
                    stroke: strokeColor,
                    opacity: 0.5,
                    strokeWidth: 1,
                    fill: "none"
                }}
                transition={{ duration: 0.15, repeat: Infinity }}
            />
        </svg>
    )
}

interface ParticleProps {
    scrollY: MotionValue<number>;
    index: number;
    color: MotionValue<string>;
}

const Particle: React.FC<ParticleProps> = ({ scrollY, index, color }) => {
    // Parallax particles that fly out of the breach
    const yStart = (index * 20) + "%";
    const xMove = useTransform(scrollY, [0.3, 0.7], [0, (index % 2 === 0 ? 100 : -100) * (index + 1)]);
    const opacity = useTransform(scrollY, [0.3, 0.5, 0.7], [0, 1, 0]);
    
    return (
        <motion.div 
            style={{ 
                top: yStart, 
                x: xMove, 
                opacity,
                backgroundColor: color 
            }}
            className="absolute w-2 h-2 rounded-full blur-[1px]"
        />
    )
}

export default VectorTransition;
