import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import ConstellationCanvas, { ConstellationPartner } from '../constellation/ConstellationCanvas';
import ConnectionLines from '../constellation/ConnectionLines';

// Mapear partners a ConstellationPartner con información extendida
const mapPartnersToConstellation = (partners: any[]): ConstellationPartner[] => {
  const partnerInfo: Record<string, { description: string; tags: string[]; category: string; connections?: string[] }> = {
    'DATABRICKS': {
      description: 'Plataforma unificada de datos y analítica. Nos permite procesar grandes volúmenes de información y construir pipelines robustos de machine learning.',
      tags: ['Data Analytics', 'ML Platform', 'Big Data'],
      category: 'Data Platform',
      connections: []
    },
    'HUGGING FACE': {
      description: 'El hub líder de modelos de IA open-source. Facilitamos el acceso y despliegue de modelos de lenguaje de última generación.',
      tags: ['LLM', 'Open Source', 'Model Hub'],
      category: 'AI Models',
      connections: []
    },
    'LANGCHAIN': {
      description: 'Framework para desarrollar aplicaciones potenciadas por LLMs. Construimos soluciones inteligentes y contextuales para nuestros clientes.',
      tags: ['AI Framework', 'Agent Building', 'RAG'],
      category: 'AI Framework',
      connections: []
    },
    'NVIDIA INCEPTION': {
      description: 'Programa que nos brinda acceso a tecnología GPU de vanguardia y expertise técnico para acelerar nuestras soluciones de IA.',
      tags: ['GPU Computing', 'AI Infrastructure', 'Deep Learning'],
      category: 'Infrastructure',
      connections: []
    }
  };

  return partners.map(partner => {
    const info = partnerInfo[partner.name.toUpperCase()] || {
      description: '',
      tags: [],
      category: 'Partner',
      connections: []
    };

    return {
      id: partner.id,
      name: partner.name,
      category: info.category,
      logo_url: partner.logo_url,
      description: info.description,
      tags: info.tags,
      connections: info.connections
    };
  });
};

const NetworkNarrative: React.FC = () => {
  const { partners } = useData();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPartner, setHoveredPartner] = useState<ConstellationPartner | null>(null);
  const partnerPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Convertir partners a formato ConstellationPartner
  const constellationPartners = useMemo(() => {
    return mapPartnersToConstellation(partners);
  }, [partners]);

  // Mouse tracking para parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mouseXValue, setMouseXValue] = useState(0);
  const [mouseYValue, setMouseYValue] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setMouseXValue(x);
    setMouseYValue(y);
  };

  const handlePartnerHover = useCallback((partner: ConstellationPartner | null) => {
    setHoveredPartner(partner);
  }, []);

  const handlePartnerClick = useCallback((partner: ConstellationPartner) => {
    console.log('Partner clicked:', partner);
    // Aquí puedes agregar lógica adicional al hacer click
  }, []);

  const getPartnerPosition = useCallback((partnerId: string) => {
    return partnerPositionsRef.current.get(partnerId) || null;
  }, []);

  const handlePartnerPositionUpdate = useCallback((partnerId: string, position: { x: number; y: number }) => {
    partnerPositionsRef.current.set(partnerId, position);
  }, []);

  // Calcular centro basado en el contenedor de constelación
  const [constellationCenter, setConstellationCenter] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const updateCenter = () => {
      // Calcular centro en la sección de constelación
      // El centro debe ser fijo dentro de la sección, no cambiar con scroll
      const constellationSection = document.getElementById('constellation-section');
      if (constellationSection) {
        // El centro debe estar en el medio de la sección
        // Usamos coordenadas absolutas del viewport para el canvas
        // pero el nodo central se posiciona con porcentajes
        const rect = constellationSection.getBoundingClientRect();
        setConstellationCenter({
          x: window.innerWidth / 2, // X siempre en el centro del viewport
          y: rect.top + (rect.height / 2) // Y en el centro de la sección
        });
      } else {
        const headerSection = document.querySelector('section:first-of-type');
        const headerHeight = headerSection ? headerSection.getBoundingClientRect().height : 300;
        setConstellationCenter({
          x: window.innerWidth / 2,
          y: headerHeight + (window.innerHeight / 2)
        });
      }
    };
    
    // Solo actualizar en resize, NO en scroll
    // El centro se calcula una vez al montar y solo se actualiza en resize
    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => {
      window.removeEventListener('resize', updateCenter);
    };
  }, []);

  return (
    <div 
        className="min-h-screen bg-black relative"
        onMouseMove={handleMouseMove}
        ref={containerRef}
    >
      {/* Sección Header con Título */}
      <section className="container mx-auto px-6 pt-32 pb-12 relative z-20">
         <div className="text-center">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-block border border-cyan-500/40 px-4 py-1 rounded-full bg-cyan-900/20 backdrop-blur text-cyan-400 font-mono text-xs mb-6 shadow-[0_0_30px_rgba(0,240,255,0.4)]"
            >
               ECOSYSTEM_STATUS: ONLINE
            </motion.div>
            <h1 className="font-display text-5xl md:text-9xl text-white mb-6 drop-shadow-2xl">
               THE CONSTELLATION
            </h1>
         </div>
      </section>

      {/* Sección de Constelación - Separada y scrollable */}
      <section className="relative min-h-[100vh] w-full" id="constellation-section">
        {/* Canvas con constelación */}
        <ConstellationCanvas
          partners={constellationPartners}
          centerX={constellationCenter.x}
          centerY={constellationCenter.y}
          onPartnerHover={handlePartnerHover}
          onPartnerClick={handlePartnerClick}
          mouseX={mouseXValue}
          mouseY={mouseYValue}
          onPartnerPositionUpdate={handlePartnerPositionUpdate}
        />

        {/* Líneas de conexión */}
        <ConnectionLines
          partners={constellationPartners}
          hoveredPartnerId={hoveredPartner?.id || null}
          centerX={constellationCenter.x}
          centerY={constellationCenter.y}
          getPartnerPosition={getPartnerPosition}
        />

        {/* Center Core (Elevate AI) - Glow Pulsante */}
                  <motion.div 
            className="absolute w-40 h-40 md:w-60 md:h-60 rounded-full border border-white/30 flex items-center justify-center bg-black/60 backdrop-blur z-30"
                     style={{ 
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${mouseXValue * 5}px, ${mouseYValue * 5}px)`
            }}
            animate={{
              boxShadow: [
                '0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(255, 255, 255, 0.2), 0 0 120px rgba(255, 255, 255, 0.1)',
                '0 0 60px rgba(255, 255, 255, 0.5), 0 0 120px rgba(255, 255, 255, 0.3), 0 0 180px rgba(255, 255, 255, 0.2)',
                '0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(255, 255, 255, 0.2), 0 0 120px rgba(255, 255, 255, 0.1)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
        >
           {/* Glow interior pulsante */}
                     <motion.div 
              className="absolute inset-0 rounded-full bg-white/10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
           />
           <span className="font-display font-bold text-2xl text-white z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
              ELEVATE AI
           </span>
                     </motion.div>
      </section>

      {/* Footer */}
      <section className="text-center font-mono text-xs text-cyan-400/70 py-8 relative z-20">
         TOTAL NODES ACTIVE: {constellationPartners.length} // LATENCY: 12ms // ENCRYPTION: QUANTUM-SAFE
      </section>
    </div>
  );
};

export default NetworkNarrative;
