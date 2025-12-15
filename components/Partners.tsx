
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Cloud, Database, Network, Shield, Code, Server, Box } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const ICONS: Record<string, React.ReactNode> = {
  'NVIDIA INCEPTION': <Cpu size={20} />,
  'GOOGLE CLOUD': <Cloud size={20} />,
  'AWS PARTNER': <Server size={20} />,
  'MICROSOFT AZURE': <Shield size={20} />,
  'DATABRICKS': <Database size={20} />,
  'HUGGING FACE': <Box size={20} />, // Using Box as generic container, stylized face not avail in lucide
  'PINECONE': <Network size={20} />,
  'LANGCHAIN': <Code size={20} />
};

const Partners: React.FC = () => {
  const { partners } = useData();
  
  return (
    <section className="bg-neutral-950 border-y border-white/5 py-12 relative overflow-hidden">
        {/* Background Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49%,rgba(0,0,0,0.8)_50%,transparent_51%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-20"></div>

        <div className="container mx-auto px-6 mb-8 flex items-center gap-4">
             <div className="h-[1px] w-12 bg-emerald-500"></div>
             <span className="font-mono text-xs text-emerald-500 tracking-[0.3em] uppercase">SOCIOS</span>
        </div>

        <div className="relative flex overflow-x-hidden group">
            <motion.div 
                className="flex items-center gap-16 md:gap-32 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            >
                {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
                    <div 
                        key={`${partner.id}-${index}`} 
                        className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-default"
                    >
                        <span className="text-emerald-500">
                             {ICONS[partner.name] || <Cpu size={20} />}
                        </span>
                        <span className="font-display font-bold text-lg md:text-xl text-white tracking-tight">
                            {partner.name}
                        </span>
                        
                        {/* Decorative separator */}
                        <div className="h-4 w-[1px] bg-white/20 ml-16 md:ml-32 rotate-12"></div>
                    </div>
                ))}
            </motion.div>
            
            {/* Fade Edges */}
            <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-neutral-950 to-transparent z-20"></div>
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-neutral-950 to-transparent z-20"></div>
        </div>
    </section>
  );
};

export default Partners;
