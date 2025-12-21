import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import { ArrowRight, ShieldAlert, Cpu, Lock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import WhatsAppFloatButton from '../WhatsAppFloatButton';

// --- 3D Components ---

const DebrisField = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-emerald-500/10 border border-emerald-500/20"
          style={{
            width: Math.random() * 50 + 10,
            height: Math.random() * 50 + 10,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

interface TiltCardProps {
  children: React.ReactNode;
  index: number;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 100, rotateX: 45 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full perspective-[1000px]"
    >
      {children}
    </motion.div>
  );
};

// Helper para convertir URLs de YouTube/Vimeo a formato embed
const getVideoEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&loop=1&mute=1&playlist=${youtubeMatch[1]}&controls=0&modestbranding=1`;
  }
  
  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&loop=1&muted=1&controls=0`;
  }
  
  // Si es una URL directa de video, devolverla tal cual
  if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
    return url;
  }
  
  return null;
};

const ProductsNarrative: React.FC = () => {
  const { products } = useData();
  const { scrollY } = useScroll();
  
  // Separar productos por tipo
  const timelineProducts = products.filter(p => p.type === 'timeline' || !p.type).slice(0, 3);
  const developmentProducts = products.filter(p => p.type === 'development');

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20 overflow-hidden relative">
      <DebrisField />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[60vw] h-[100vh] bg-gradient-to-l from-emerald-900/10 to-transparent" />
         <motion.div 
            style={{ y: useTransform(scrollY, [0, 1000], [0, 300]), opacity: useTransform(scrollY, [0, 500], [0.1, 0]) }}
            className="absolute top-20 left-10 text-[20vw] font-display font-bold text-white/5 leading-none select-none"
         >
            ARSENAL
         </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Narrative Header */}
        <div className="max-w-4xl mb-32 pt-12 relative">
            <motion.div 
                initial={{ width: 0 }} animate={{ width: "100px" }} transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-emerald-500 mb-6"
            />
            <motion.h1 
                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                className="font-display text-5xl md:text-8xl text-white mb-8"
            >
                THE INFRASTRUCTURE<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-800">EVOLUTION</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="font-mono text-gray-400 text-lg md:text-xl border-l-2 border-emerald-500/50 pl-6 leading-relaxed backdrop-blur-sm bg-black/30 p-4"
            >
                We don't sell tools. We deploy capability.
                The current AI landscape is littered with fragile prototypes. 
                Our suite is engineered for the hostility of regulated production environments.
            </motion.p>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
            {/* Center Line with Scroll Draw */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-800 md:-translate-x-1/2 overflow-hidden">
                <motion.div 
                    style={{ height: useTransform(scrollY, [0, 2000], ["0%", "100%"]) }}
                    className="w-full bg-emerald-500 shadow-[0_0_15px_#10b981]" 
                />
            </div>

            <div className="space-y-40">
                {timelineProducts.map((product, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <div key={product.id} className={`flex flex-col md:flex-row gap-12 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}>
                            
                            {/* Graphic Side */}
                            <div className="w-full md:w-1/2 flex justify-center relative perspective-[1000px] z-10">
                                <TiltCard index={index}>
                                    <div className="w-full max-w-md aspect-square bg-[#0a0a0a] border border-white/10 relative overflow-hidden flex flex-col justify-between group transition-colors duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] transform-style-3d">
                                        
                                        {/* Media Area (Image or Video) */}
                                        {product.media_url ? (
                                            <div className="absolute inset-0">
                                                {product.media_type === 'video' ? (
                                                    getVideoEmbedUrl(product.media_url) ? (
                                                        <iframe
                                                            src={getVideoEmbedUrl(product.media_url) || ''}
                                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                                                            allow="autoplay; encrypted-media"
                                                            allowFullScreen
                                                            style={{ border: 'none' }}
                                                        />
                                                    ) : (
                                                        <video
                                                            src={product.media_url}
                                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                                                            autoPlay
                                                            loop
                                                            muted
                                                            playsInline
                                                        />
                                                    )
                                                ) : (
                                                    <img 
                                                        src={product.media_url} 
                                                        alt={product.title}
                                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/80 to-[#0a0a0a]/40" />
                                            </div>
                                        ) : (
                                            <>
                                                {/* Holographic Grid on Card */}
                                                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            </>
                                        )}
                                        
                                        <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                                            <div className="flex justify-between items-start translate-z-10">
                                                <div className="font-mono text-xs text-emerald-500 tracking-widest uppercase bg-emerald-900/20 px-2 py-1 rounded">MK-{index + 1} // {product.id.toUpperCase()}</div>
                                                <div className="text-white/20 group-hover:text-emerald-400 transition-colors transform group-hover:scale-110 duration-300">
                                                    {(() => {
                                                        if (product.icon_name && (LucideIcons as any)[product.icon_name]) {
                                                            const IconComponent = (LucideIcons as any)[product.icon_name];
                                                            return React.createElement(IconComponent, { size: 40 });
                                                        }
                                                        // Fallback a iconos por defecto
                                                        return index === 0 ? <ShieldAlert size={40} /> : index === 1 ? <Cpu size={40} /> : <Lock size={40} />;
                                                    })()}
                                                </div>
                                            </div>
                                        
                                            <div className="space-y-3 translate-z-20">
                                                {product.features.slice(0, 3).map((_f, i) => (
                                                    <div key={i} className="group/bar">
                                                        <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1">
                                                            <span>PARAM_{i}</span>
                                                            <span>{(Math.random() * 100).toFixed(0)}%</span>
                                                        </div>
                                                        <div className="h-1 bg-gray-800 rounded overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${Math.random() * 60 + 40}%` }}
                                                                transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                                                                className="h-full bg-emerald-500 group-hover/bar:bg-white transition-colors" 
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Shadow */}
                                    <div className="absolute -bottom-10 left-10 right-10 h-10 bg-emerald-500/20 blur-[40px] opacity-50 transform translate-z-[-50px]" />
                                </TiltCard>
                            </div>

                            {/* Content Side */}
                            <motion.div 
                                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="w-full md:w-1/2 pl-8 md:pl-0 md:px-16"
                            >
                                <div className="font-display text-4xl md:text-5xl text-white mb-4 leading-none">{product.title}</div>
                                <div className="font-mono text-emerald-500 text-sm mb-6 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    {product.price}
                                </div>
                                <p className="text-gray-400 font-mono text-sm leading-relaxed mb-8 border-l border-white/10 pl-4">
                                    {product.description}
                                </p>
                                <button 
                                    onClick={() => {
                                        const url = product.calendly_url || 'https://calendly.com'; // TODO: Configurar link por defecto
                                        window.open(url, '_blank');
                                    }}
                                    className="group flex items-center gap-4 text-white hover:text-emerald-500 transition-colors font-bold tracking-widest uppercase text-sm border border-white/20 px-6 py-3 hover:bg-emerald-900/20 hover:border-emerald-500/50"
                                >
                                    Reservar Consulta <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform"/>
                                </button>
                            </motion.div>

                        </div>
                    );
                })}
            </div>
        </div>

        {/* Footer Statement */}
        <div className="mt-40 text-center border-t border-white/10 pt-20 pb-20">
            <motion.h3 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="font-display text-3xl md:text-5xl text-gray-500"
            >
                TOTAL CAPABILITY ASSURANCE
            </motion.h3>
        </div>

        {/* Development Products Section */}
        {developmentProducts.length > 0 && (
          <div className="mt-40 relative">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-32 text-center"
            >
              <motion.div 
                initial={{ width: 0 }} 
                whileInView={{ width: "100px" }} 
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-emerald-500 mx-auto mb-6"
              />
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-display text-4xl md:text-6xl text-white mb-6"
              >
                NUESTROS DESARROLLOS
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="font-mono text-gray-400 text-lg max-w-2xl mx-auto"
              >
                Soluciones personalizadas construidas para entornos de producción críticos
              </motion.p>
            </motion.div>

            {/* Development Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {developmentProducts.map((product, index) => (
                <TiltCard key={product.id} index={index}>
                  <div className="w-full aspect-square bg-[#0a0a0a] border border-white/10 relative overflow-hidden flex flex-col justify-between group transition-colors duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] transform-style-3d hover:border-emerald-500/50">
                    
                    {/* Media Area (Image or Video) - Para desarrollos también */}
                    {product.media_url ? (
                      <div className="absolute inset-0">
                        {product.media_type === 'video' ? (
                          getVideoEmbedUrl(product.media_url) ? (
                            <iframe
                              src={getVideoEmbedUrl(product.media_url) || ''}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                              style={{ border: 'none' }}
                            />
                          ) : (
                            <video
                              src={product.media_url}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                          )
                        ) : (
                          <img 
                            src={product.media_url} 
                            alt={product.title}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/80 to-[#0a0a0a]/40" />
                      </div>
                    ) : product.image_url ? (
                      <div className="absolute inset-0">
                        <img 
                          src={product.image_url} 
                          alt={product.title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/80 to-[#0a0a0a]/40" />
                      </div>
                    ) : (
                      <>
                        {/* Holographic Grid on Card */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    )}
                    
                    <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start translate-z-10">
                        <div className="font-mono text-xs text-emerald-500 tracking-widest uppercase bg-emerald-900/20 px-2 py-1 rounded">
                          DEV-{index + 1}
                        </div>
                        <div className="text-white/20 group-hover:text-emerald-400 transition-colors transform group-hover:scale-110 duration-300">
                          {(() => {
                            if (product.icon_name && (LucideIcons as any)[product.icon_name]) {
                              const IconComponent = (LucideIcons as any)[product.icon_name];
                              return React.createElement(IconComponent, { size: 40 });
                            }
                            // Fallback a Cpu por defecto
                            return <Cpu size={40} />;
                          })()}
                        </div>
                      </div>
                    
                    <div className="space-y-4 translate-z-20">
                      <div>
                        <h3 className="font-display text-2xl text-white mb-2 group-hover:text-emerald-400 transition-colors">
                          {product.title}
                        </h3>
                        <div className="font-mono text-xs text-emerald-500 mb-4">
                          {product.price}
                        </div>
                        <p className="text-gray-400 font-mono text-sm leading-relaxed mb-4">
                          {product.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        {product.features.slice(0, 3).map((_f, i) => (
                          <div key={i} className="group/bar">
                            <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1">
                              <span>FEATURE_{i + 1}</span>
                              <span>{(Math.random() * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1 bg-gray-800 rounded overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${Math.random() * 60 + 40}%` }}
                                transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                                className="h-full bg-emerald-500 group-hover/bar:bg-white transition-colors" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => {
                          const url = product.calendly_url || 'https://calendly.com'; // TODO: Configurar link por defecto
                          window.open(url, '_blank');
                        }}
                        className="group flex items-center gap-2 text-white hover:text-emerald-500 transition-colors font-bold tracking-widest uppercase text-xs border border-white/20 px-4 py-2 hover:bg-emerald-900/20 hover:border-emerald-500/50 mt-4"
                      >
                        Reservar Consulta <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform"/>
                      </button>
                    </div>
                    </div>
                  </div>
                  {/* Shadow */}
                  <div className="absolute -bottom-10 left-10 right-10 h-10 bg-emerald-500/20 blur-[40px] opacity-50 transform translate-z-[-50px]" />
                </TiltCard>
              ))}
            </div>
          </div>
        )}

      </div>
      
      {/* WhatsApp Float Button */}
      <WhatsAppFloatButton />
    </div>
  );
};

export default ProductsNarrative;