
import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';

const Industries: React.FC = () => {
  const { industries } = useData();
  
  return (
    <section className="py-20 bg-emerald-900 overflow-hidden border-y border-emerald-800">
      <div className="flex whitespace-nowrap">
        <motion.div 
          className="flex gap-20"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {[...industries, ...industries, ...industries].map((industry, i) => (
            <div key={i} className="flex items-center gap-4">
               <span className="text-4xl md:text-6xl font-display font-bold text-emerald-300 opacity-50 uppercase">{industry}</span>
               <div className="w-4 h-4 bg-emerald-500 rounded-full" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Industries;
