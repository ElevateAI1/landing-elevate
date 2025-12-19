import React, { useEffect, useRef } from 'react';
import { ConstellationPartner } from './ConstellationCanvas';

interface ConnectionLinesProps {
  partners: ConstellationPartner[];
  hoveredPartnerId: string | null;
  centerX: number;
  centerY: number;
  getPartnerPosition: (partnerId: string) => { x: number; y: number } | null;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  partners,
  hoveredPartnerId,
  centerX,
  centerY,
  getPartnerPosition
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [lineProgress, setLineProgress] = React.useState<Record<string, number>>({});

  useEffect(() => {
    if (!hoveredPartnerId) {
      setLineProgress({});
      return;
    }

    const hoveredPartner = partners.find(p => p.id === hoveredPartnerId);
    if (!hoveredPartner) return;

    // Animar líneas de conexión
    const connections = hoveredPartner.connections || [];
    const animateLines = () => {
      connections.forEach((connectionId, index) => {
        setTimeout(() => {
          setLineProgress(prev => ({
            ...prev,
            [connectionId]: 0
          }));
          
          let progress = 0;
          const animate = () => {
            if (progress < 1) {
              progress += 0.05;
              setLineProgress(prev => ({
                ...prev,
                [connectionId]: progress
              }));
              requestAnimationFrame(animate);
            } else {
              setLineProgress(prev => ({
                ...prev,
                [connectionId]: 1
              }));
            }
          };
          animate();
        }, index * 100);
      });
    };

    animateLines();
  }, [hoveredPartnerId, partners]);

  if (!hoveredPartnerId) return null;

  const hoveredPartner = partners.find(p => p.id === hoveredPartnerId);
  if (!hoveredPartner) return null;

  const connections = hoveredPartner.connections || [];
  const hoveredPos = getPartnerPosition(hoveredPartnerId);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ zIndex: 2 }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {connections.map((connectionId) => {
        const connectionPos = getPartnerPosition(connectionId);
        if (!hoveredPos || !connectionPos) return null;

        const progress = lineProgress[connectionId] || 0;
        const dx = connectionPos.x - hoveredPos.x;
        const dy = connectionPos.y - hoveredPos.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const currentLength = length * progress;

        return (
          <g key={connectionId}>
            {/* Línea base (siempre visible, tenue) */}
            <line
              x1={hoveredPos.x}
              y1={hoveredPos.y}
              x2={connectionPos.x}
              y2={connectionPos.y}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.2"
            />
            {/* Línea animada */}
            <line
              x1={hoveredPos.x}
              y1={hoveredPos.y}
              x2={hoveredPos.x + (dx / length) * currentLength}
              y2={hoveredPos.y + (dy / length) * currentLength}
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity={progress}
              style={{
                filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.4))'
              }}
            />
          </g>
        );
      })}
      {/* Línea al centro (Elevate AI) */}
      {hoveredPos && (
        <line
          x1={centerX}
          y1={centerY}
          x2={hoveredPos.x}
          y2={hoveredPos.y}
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.5"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))'
          }}
        />
      )}
    </svg>
  );
};

export default ConnectionLines;

