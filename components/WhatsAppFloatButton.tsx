import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloatButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // TODO: Configurar el link exacto de WhatsApp
  const whatsappUrl = 'https://wa.me/1234567890'; // Reemplazar con el número real

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative block"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glassmorphism Background */}
        <div className="relative w-16 h-16 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg overflow-hidden">
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20"
            animate={{
              background: isHovered
                ? [
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3))',
                    'linear-gradient(135deg, rgba(5, 150, 105, 0.3), rgba(16, 185, 129, 0.3))',
                  ]
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
            }}
            transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
          />
          
          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: isHovered ? ['-100%', '200%'] : '-100%',
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            }}
          />

          {/* Icon */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <MessageCircle 
              size={28} 
              className="text-emerald-400 drop-shadow-lg"
            />
          </div>

          {/* Pulse Animation */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald-400/50"
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.8 }}
              className="absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap backdrop-blur-md bg-black/80 border border-white/20 rounded-lg px-4 py-2 shadow-xl"
            >
              <span className="text-white text-sm font-mono">Contáctanos</span>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-white/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.a>
    </motion.div>
  );
};

export default WhatsAppFloatButton;

