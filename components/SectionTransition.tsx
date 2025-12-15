
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

type TransitionVariant = 'construct' | 'shards' | 'tunnel' | 'scan';

interface SectionTransitionProps {
  variant: TransitionVariant;
  height?: string;
}

const SectionTransition: React.FC<SectionTransitionProps> = ({ variant, height = "h-[40vh]" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <div ref={containerRef} className={`relative w-full ${height} overflow-hidden bg-neutral-950 flex items-center justify-center perspective-[1000px] z-20`}>
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-neutral-950 z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 opacity-50" />
      </div>

      {variant === 'construct' && <ConstructVariant scrollY={scrollYProgress} />}
      {variant === 'shards' && <ShardsVariant scrollY={scrollYProgress} />}
      {variant === 'tunnel' && <TunnelVariant scrollY={scrollYProgress} />}
      {variant === 'scan' && <ScanVariant scrollY={scrollYProgress} />}
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950 z-20 pointer-events-none" />
    </div>
  );
};

// Variant 1: The Construct (Grid Planes)
const ConstructVariant = ({ scrollY }: { scrollY: MotionValue<number> }) => {
  const rotateX = useTransform(scrollY, [0, 1], [45, 80]);
  const yTop = useTransform(scrollY, [0, 1], ["-20%", "-100%"]);
  const yBottom = useTransform(scrollY, [0, 1], ["20%", "100%"]);
  const opacity = useTransform(scrollY, [0.2, 0.5, 0.8], [0, 1, 0]);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-[500px]">
      {/* Ceiling Plane */}
      <motion.div 
        style={{ rotateX: 60, y: yTop, opacity }}
        className="absolute w-[200vw] h-[200vh] top-[-50%] bg-[linear-gradient(to_bottom,transparent_49%,rgba(16,185,129,0.2)_50%,transparent_51%)] bg-[size:100%_100px]"
      />
       {/* Floor Plane */}
      <motion.div 
        style={{ rotateX: -60, y: yBottom, opacity }}
        className="absolute w-[200vw] h-[200vh] bottom-[-50%] bg-[linear-gradient(to_bottom,transparent_49%,rgba(16,185,129,0.2)_50%,transparent_51%)] bg-[size:100%_100px]"
      />
      
      {/* Vertical Connectors */}
      <motion.div 
         style={{ scaleY: useTransform(scrollY, [0, 0.5, 1], [0, 1.5, 0]) }}
         className="absolute w-full h-full flex justify-around opacity-20"
      >
         {[...Array(5)].map((_, i) => (
             <div key={i} className="w-[1px] h-full bg-emerald-500" />
         ))}
      </motion.div>
    </div>
  );
};

// Variant 2: Shards (Exploding Geometry)
const ShardsVariant = ({ scrollY }: { scrollY: MotionValue<number> }) => {
    const shards = [...Array(12)].map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        rotate: Math.random() * 360,
        scale: Math.random() * 1.5 + 0.5,
    }));

    return (
        <div className="relative w-full h-full perspective-[800px]">
            {shards.map((shard) => {
                // Different parallax speeds for each shard
                const z = useTransform(scrollY, [0, 1], [0, 500 + shard.id * 50]);
                const rotate = useTransform(scrollY, [0, 1], [shard.rotate, shard.rotate + 90]);
                const x = useTransform(scrollY, [0, 1], [`${shard.x}%`, `${shard.x * 2}%`]);
                const y = useTransform(scrollY, [0, 1], [`${shard.y}%`, `${shard.y * 2}%`]);
                const opacity = useTransform(scrollY, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

                return (
                    <motion.div
                        key={shard.id}
                        style={{ x, y, z, rotateX: rotate, rotateY: rotate, opacity }}
                        className="absolute top-1/2 left-1/2 w-20 h-20 border border-emerald-500/30 bg-emerald-900/10 backdrop-blur-sm"
                        initial={{ x: "-50%", y: "-50%" }}
                    />
                );
            })}
        </div>
    );
};

// Variant 3: Tunnel (Concentric Gates)
const TunnelVariant = ({ scrollY }: { scrollY: MotionValue<number> }) => {
    const gates = [1, 2, 3, 4, 5];
    
    return (
        <div className="relative w-full h-full flex items-center justify-center perspective-[500px]">
            {gates.map((gate, i) => {
                const scale = useTransform(scrollY, [0, 1], [0.2 + (i * 0.2), 2 + (i * 0.5)]);
                const opacity = useTransform(scrollY, [0, 0.5, 0.9], [0, 1, 0]);
                const rotate = useTransform(scrollY, [0, 1], [0, (i % 2 === 0 ? 45 : -45)]);
                
                return (
                    <motion.div
                        key={i}
                        style={{ scale, opacity, rotate }}
                        className="absolute w-[30vw] h-[30vw] border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                    />
                );
            })}
            
            {/* Center light */}
            <motion.div 
                style={{ scale: useTransform(scrollY, [0, 1], [0, 10]), opacity: useTransform(scrollY, [0, 0.8], [0, 1]) }}
                className="absolute w-2 h-2 bg-white rounded-full blur-[2px]" 
            />
        </div>
    );
};

// Variant 4: Scan (Laser Grid)
const ScanVariant = ({ scrollY }: { scrollY: MotionValue<number> }) => {
    const scanY = useTransform(scrollY, [0, 1], ["0%", "100%"]);
    const opacity = useTransform(scrollY, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <div className="relative w-full h-full overflow-hidden">
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
             
             {/* Scanning Bar */}
             <motion.div 
                style={{ top: scanY, opacity }}
                className="absolute left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-10"
             >
                 {/* Trailing fade */}
                 <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-emerald-500/20 to-transparent" />
             </motion.div>

             {/* Random highlighted cells */}
             {[...Array(10)].map((_, i) => (
                 <motion.div 
                    key={i}
                    style={{ 
                        top: `${Math.random() * 100}%`, 
                        left: `${Math.random() * 100}%`,
                        opacity: useTransform(scrollY, [0, 1], [0, 1])
                    }}
                    className="absolute w-[50px] h-[50px] bg-emerald-500/10 border border-emerald-500/30"
                 />
             ))}
        </div>
    );
};

export default SectionTransition;
