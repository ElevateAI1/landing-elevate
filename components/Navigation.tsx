
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const NAV_ITEMS = [
  { label: 'Inicio', view: 'home' },
  { label: 'Productos', view: 'products' },
  { label: 'Inteligencia', view: 'intelligence' },
  { label: 'Red', view: 'network' },
  { label: 'Nosotros', view: 'about-us' },
  { label: 'Contacto', view: 'contact' },
];

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: string | ViewState) => {
    const viewState = view as ViewState;
    onChangeView(viewState);
    setIsOpen(false);
    // Update URL without page reload
    if (viewState === 'about-us') {
      window.history.pushState({}, '', '/about-us');
    } else if (viewState === 'home') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', `/${viewState}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-black/50 backdrop-blur-md border-b border-white/10' : 'py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button 
          onClick={() => handleNavClick('home')}
          className="text-2xl font-display font-bold tracking-tighter text-white mix-blend-difference hover:text-emerald-500 transition-colors"
        >
          ELEVATE<span className="text-emerald-500">.AI</span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item.label} 
              onClick={() => handleNavClick(item.view)}
              className={`font-mono text-sm transition-colors tracking-widest uppercase relative group ${currentView === item.view ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-emerald-500 transition-all duration-300 ${currentView === item.view ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </button>
          ))}

          <button className="px-6 py-2 bg-white text-black font-bold font-mono text-xs uppercase hover:bg-emerald-500 transition-colors">
            Auditoría
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
            <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-0 left-0 w-full bg-black flex flex-col items-center justify-center gap-8 md:hidden overflow-hidden z-40"
          >
             <button className="absolute top-8 right-6 text-white" onClick={() => setIsOpen(false)}>
                <X />
             </button>
             {NAV_ITEMS.map((item) => (
              <button 
                key={item.label} 
                onClick={() => handleNavClick(item.view)}
                className="font-display text-4xl text-white hover:text-emerald-500 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
