
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import SceneDirector from './components/SceneDirector';
import AtenaBackground from './components/AtenaBackground';
import AudioPlayer from './components/AudioPlayer';
import { ViewState } from './types';
import { DataProvider } from './contexts/DataContext';

// --- Page Imports ---
import Hero from './components/Hero';
import Methodology from './components/Methodology';
import Services from './components/Services';
import Industries from './components/Industries';
import BlogCarousel from './components/BlogCarousel';
import Testimonials from './components/Testimonials';
import Partners from './components/Partners';
import Contact from './components/Contact';
import SectionTransition from './components/SectionTransition';
import VectorTransition from './components/VectorTransition';
import ProblemStatement from './components/ProblemStatement';

// --- New Narrative & Admin Imports ---
import ProductsNarrative from './components/pages/ProductsNarrative';
import IntelligenceNarrative from './components/pages/IntelligenceNarrative';
import NetworkNarrative from './components/pages/NetworkNarrative';
import AboutUsNarrative from './components/pages/AboutUsNarrative';
import AdminDashboard from './components/admin/AdminDashboard';

// --- Transition Effects ---

const hyperJumpVariants: Variants = {
    initial: { 
        opacity: 0, 
        scale: 2, 
        z: 1000, 
        rotateX: 15,
        filter: "blur(20px) brightness(200%)"
    },
    animate: { 
        opacity: 1, 
        scale: 1, 
        z: 0, 
        rotateX: 0,
        filter: "blur(0px) brightness(100%)",
        transition: { 
            duration: 1.5, 
            ease: [0.16, 1, 0.3, 1] 
        }
    },
    exit: { 
        opacity: 0, 
        scale: 0, 
        z: -3000, 
        rotateX: -30,
        filter: "blur(20px) brightness(0%)",
        transition: { 
            duration: 1, 
            ease: [0.7, 0, 0.84, 0] 
        }
    }
};

interface PageTransitionProps {
    children: React.ReactNode;
    view: ViewState;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, view }) => {
    return (
        <motion.div
            key={view}
            variants={hyperJumpVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen perspective-[2000px] transform-style-3d origin-center"
        >
            {children}
        </motion.div>
    );
};

// --- View Components ---

const HomeView = () => {
    return (
        <div className="pt-0">
             <Hero />
            <VectorTransition />
            <ProblemStatement />
            <SectionTransition variant="scan" height="h-[30vh]" />
            <BlogCarousel />
            <SectionTransition variant="shards" height="h-[40vh]" />
            <Methodology />
            <SectionTransition variant="tunnel" height="h-[40vh]" />
            <Services />
            <Partners />
            <Industries />
            <Testimonials />
            <Contact />
        </div>
    );
};

// --- Main App Wrapper ---

const MainContent: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  
  // Basic routing check on mount and on popstate
  useEffect(() => {
    const updateView = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setView('admin');
      } else if (path === '/about-us') {
        setView('about-us');
      } else if (path === '/products') {
        setView('products');
      } else if (path === '/intelligence') {
        setView('intelligence');
      } else if (path === '/network') {
        setView('network');
      } else if (path === '/contact') {
        setView('contact');
      } else {
        setView('home');
      }
    };

    updateView();
    window.addEventListener('popstate', updateView);
    return () => window.removeEventListener('popstate', updateView);
  }, []);

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-50 selection:bg-emerald-500 selection:text-white overflow-x-hidden perspective-[2000px]">
      {/* Deepest Background Layer - Atena Image (behind everything) */}
      <AtenaBackground />
      
      <CustomCursor />
      
      {/* Hide Navigation on Admin Page */}
      {view !== 'admin' && <Navigation currentView={view} onChangeView={setView} />}
      
      {/* Audio Player - Available on all pages */}
      <AudioPlayer />
      
      {/* Background Layer - Hidden on Narrative/Admin pages for clean slate */}
      {view === 'home' && <SceneDirector currentView={view} />}
      
      {/* Viewport for Pages */}
      <main className="relative z-10 w-full min-h-screen transform-style-3d overflow-hidden">
        <AnimatePresence mode="wait">
            
            {/* ORIGINAL HOME */}
            {view === 'home' && (
                <PageTransition view="home">
                    <HomeView />
                </PageTransition>
            )}

            {/* NEW NARRATIVE PAGES */}
            {view === 'products' && (
                <PageTransition view="products">
                    <ProductsNarrative />
                </PageTransition>
            )}
            {view === 'intelligence' && (
                <PageTransition view="intelligence">
                    <IntelligenceNarrative />
                </PageTransition>
            )}
            {view === 'network' && (
                <PageTransition view="network">
                    <NetworkNarrative />
                </PageTransition>
            )}
            {view === 'about-us' && (
                <PageTransition view="about-us">
                    <AboutUsNarrative />
                </PageTransition>
            )}

            {/* SHARED PAGES */}
            {view === 'contact' && (
                <PageTransition view="contact">
                    <div className="pt-20"><Contact /></div>
                </PageTransition>
            )}

            {/* ADMIN PANEL */}
            {view === 'admin' && (
                <motion.div key="admin" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    <AdminDashboard />
                </motion.div>
            )}

        </AnimatePresence>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <MainContent />
    </DataProvider>
  );
};

export default App;
