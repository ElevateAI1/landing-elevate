
import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { FileText, X, Eye, Share2, ScanLine } from 'lucide-react';

const DigitalRain = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#000_100%)] z-10" />
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute top-[-100%] w-[1px] bg-gradient-to-b from-transparent via-emerald-500 to-transparent"
                    style={{
                        left: `${i * 7}%`,
                        height: Math.random() * 300 + 200,
                    }}
                    animate={{
                        top: ['0%', '100%'],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: Math.random() * 2 + 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 2
                    }}
                />
            ))}
        </div>
    )
}

const IntelligenceNarrative: React.FC = () => {
  const { blogs } = useData();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedPost = blogs.find(b => b.id === selectedId);

  // Mouse tilt for the background grid
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set((e.clientX / window.innerWidth) - 0.5);
    mouseY.set((e.clientY / window.innerHeight) - 0.5);
  };

  const springConfig = { damping: 40, stiffness: 200 };
  const rotateX = useTransform(useSpring(mouseY, springConfig), [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(useSpring(mouseX, springConfig), [-0.5, 0.5], [-5, 5]);

  return (
    <div 
        className="min-h-screen bg-[#080808] pt-24 pb-12 relative overflow-hidden perspective-[2000px]"
        onMouseMove={handleMouseMove}
    >
       <DigitalRain />

       {/* 3D Moving Grid Background */}
       <motion.div 
            style={{ rotateX, rotateY }}
            className="fixed inset-[-10%] bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none transform-style-3d origin-center opacity-30" 
       />
       
       <div className="container mx-auto px-6 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-emerald-900/50 pb-8 backdrop-blur-sm">
            <div>
                <motion.div 
                    initial={{ width: 0 }} animate={{ width: "100%" }} 
                    className="h-[2px] bg-emerald-500 mb-2 w-20" 
                />
                <h1 className="font-display text-6xl md:text-8xl text-emerald-500/90 mix-blend-screen drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">DECRYPTED<br/>FILES</h1>
                <p className="font-mono text-gray-500 mt-4 max-w-lg">
                    WARNING: The following materials contain advanced operational protocols. 
                    Dissemination is monitored.
                </p>
            </div>
            <div className="hidden md:block text-right font-mono text-xs text-emerald-800 border border-emerald-900/30 p-4 bg-emerald-900/5">
                CLEARANCE: LEVEL 5<br/>
                ENCRYPTION: AES-256-GCM<br/>
                STATUS: UNLOCKED
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post, i) => (
                <motion.div 
                    layoutId={`card-${post.id}`}
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    onClick={() => setSelectedId(post.id)}
                    whileHover={{ y: -10, z: 20, transition: { duration: 0.3 } }}
                    className="group relative bg-[#0a0a0a] border border-gray-800 hover:border-emerald-500 cursor-pointer overflow-hidden aspect-[4/5] flex flex-col transition-all duration-300 shadow-2xl preserve-3d"
                >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {/* Image Layer */}
                    <div className="relative h-1/2 overflow-hidden">
                        <motion.img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover opacity-60 filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,#000_3px)] bg-[size:100%_4px] opacity-30 pointer-events-none" />
                        
                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur border border-emerald-900 px-2 py-1">
                            <span className="font-mono text-[10px] text-emerald-500 uppercase flex items-center gap-2">
                                <ScanLine size={10} className="animate-pulse" />
                                {post.category}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-grow relative bg-[#0a0a0a]">
                         {/* "Top Secret" Stamp Effect */}
                         <div className="absolute top-[-20px] right-6 text-6xl font-display font-bold text-white/5 rotate-12 pointer-events-none group-hover:text-emerald-500/10 transition-colors">CONFIDENTIAL</div>
                         
                         <div>
                            <div className="font-mono text-xs text-gray-600 mb-2 border-b border-gray-800 pb-2">{post.date} // {post.readTime}</div>
                            <h3 className="font-display text-xl text-gray-200 leading-tight mb-4 group-hover:text-emerald-400 transition-colors">
                                {post.title}
                            </h3>
                            <p className="font-mono text-xs text-gray-500 line-clamp-3">
                                {post.excerpt}
                            </p>
                         </div>
                         
                         <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-900">
                             <div className="text-[10px] font-mono text-gray-700 group-hover:text-emerald-500/50">{post.slug.toUpperCase()}</div>
                             <div className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                <FileText size={14} />
                             </div>
                         </div>
                    </div>
                </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selectedId && selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 perspective-[1000px]">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedId(null)}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        layoutId={`card-${selectedId}`}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)] flex flex-col md:flex-row"
                    >
                        <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                            className="absolute top-4 right-4 z-20 bg-black border border-white/20 p-2 rounded-full hover:bg-red-900/50 hover:border-red-500 transition-colors"
                        >
                            <X size={20} className="text-white" />
                        </button>

                         <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                             <img src={selectedPost.image} className="w-full h-full object-cover grayscale mix-blend-luminosity" />
                             <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay" />
                             {/* Scanning Line Animation */}
                             <motion.div 
                                className="absolute top-0 left-0 w-full h-[5px] bg-emerald-500 box-shadow-[0_0_20px_#10b981]"
                                animate={{ top: ["0%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                             />
                         </div>
                         
                         <div className="p-8 md:p-12 w-full md:w-1/2 relative">
                             {/* Decorative Background Text */}
                             <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
                                <div className="font-mono text-[8px] leading-3 p-4 text-emerald-500 break-all">
                                    {Array(2000).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join('')}
                                </div>
                             </div>

                             <div className="relative z-10">
                                <div className="font-mono text-emerald-500 text-xs tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                    ACCESSING FILE: {selectedPost.id}
                                </div>
                                <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
                                    {selectedPost.title}
                                </h2>
                                <div className="font-mono text-gray-400 text-sm leading-relaxed space-y-4">
                                    <p className="first-letter:text-3xl first-letter:text-emerald-500 first-letter:float-left first-letter:mr-2 font-bold">{selectedPost.excerpt}</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    <div className="p-4 bg-emerald-900/10 border-l-2 border-emerald-500 my-8 italic text-emerald-200/80">
                                         "Critical infrastructure requires absolute certainty in output generation."
                                    </div>
                                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button className="flex-1 bg-white text-black font-display font-bold py-3 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 group">
                                        <Eye size={16} className="group-hover:animate-pulse" /> READ FULL LOG
                                    </button>
                                    <button className="px-6 border border-white/20 hover:border-white transition-colors">
                                        <Share2 size={16} className="text-white" />
                                    </button>
                                </div>
                             </div>
                         </div>
                    </motion.div>
                </div>
            )}
          </AnimatePresence>

       </div>
    </div>
  );
};

export default IntelligenceNarrative;
