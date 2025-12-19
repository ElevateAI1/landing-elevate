import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ConstellationPartner {
  id: string;
  name: string;
  category?: string;
  logo_url?: string;
  description?: string;
  tags?: string[];
  connections?: string[]; // IDs de partners relacionados
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
  speed: number;
}

interface PartnerStar extends ConstellationPartner {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
  pattern: 'circle' | 'spiral' | 'cluster';
  appearProgress: number; // 0 a 1 para animación de aparición
  isVisible: boolean;
  logoImage?: HTMLImageElement; // Imagen cargada del logo
  logoLoaded: boolean;
}

interface ConstellationCanvasProps {
  partners: ConstellationPartner[];
  centerX?: number;
  centerY?: number;
  onPartnerHover?: (partner: ConstellationPartner | null) => void;
  onPartnerClick?: (partner: ConstellationPartner) => void;
  mouseX?: number;
  mouseY?: number;
  onPartnerPositionUpdate?: (partnerId: string, position: { x: number; y: number }) => void;
}

// Generar posiciones según patrones
const generatePartnerPosition = (
  index: number,
  total: number,
  pattern: 'circle' | 'spiral' | 'cluster',
  category?: string,
  centerX?: number,
  centerY?: number
): { x: number; y: number; z: number } => {
  const cx = centerX || (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const cy = centerY || (typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const maxRadius = Math.min(window.innerWidth || 1920, window.innerHeight || 1080) * 0.35;
  
  // Área protegida alrededor del nodo central (radio del nodo + padding)
  // El nodo central tiene aproximadamente 60px de radio (w-60 h-60 = 240px / 2 = 120px)
  const nodeRadius = 120; // Radio del nodo central
  const minRadius = nodeRadius + 80; // Radio mínimo para evitar partners dentro del área del nodo
  
  // Función para verificar si una posición está dentro del área protegida
  const isInProtectedArea = (x: number, y: number): boolean => {
    const distance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
    return distance < minRadius;
  };
  
  // Almacenar posiciones generadas para evitar colisiones
  const generatedPositions: { x: number; y: number }[] = [];
  const minDistanceBetweenNodes = 100; // Distancia mínima entre nodos
  
  // Función para verificar colisiones con otros nodos
  const hasCollision = (x: number, y: number, existingPositions: { x: number; y: number }[]): boolean => {
    for (const pos of existingPositions) {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < minDistanceBetweenNodes) {
        return true;
      }
    }
    return false;
  };
  
  // Función para generar posición y verificar que no esté en área protegida ni colisione
  const generateSafePosition = (
    baseX: number,
    baseY: number,
    existingPositions: { x: number; y: number }[],
    maxAttempts: number = 20
  ): { x: number; y: number; z: number } => {
    let x = baseX;
    let y = baseY;
    let attempts = 0;
    
    // Si está en área protegida, moverlo hacia afuera
    if (isInProtectedArea(x, y)) {
      const angle = Math.atan2(y - cy, x - cx);
      // Moverlo justo fuera del área protegida
      x = cx + Math.cos(angle) * minRadius;
      y = cy + Math.sin(angle) * minRadius;
    }
    
    // Verificar colisiones y ajustar si es necesario
    while (hasCollision(x, y, existingPositions) && attempts < maxAttempts) {
      const angle = Math.atan2(y - cy, x - cx);
      const currentDistance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
      // Moverlo un poco más lejos
      const newDistance = currentDistance + minDistanceBetweenNodes * 0.5;
      x = cx + Math.cos(angle) * newDistance;
      y = cy + Math.sin(angle) * newDistance;
      attempts++;
    }
    
    // Si aún hay colisión después de los intentos, usar posición aleatoria
    if (hasCollision(x, y, existingPositions)) {
      const randomAngle = Math.random() * Math.PI * 2;
      const randomRadius = minRadius + Math.random() * (maxRadius - minRadius);
      x = cx + Math.cos(randomAngle) * randomRadius;
      y = cy + Math.sin(randomAngle) * randomRadius;
      
      // Verificar una vez más
      let finalAttempts = 0;
      while (hasCollision(x, y, existingPositions) && finalAttempts < 10) {
        const angle = Math.random() * Math.PI * 2;
        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        x = cx + Math.cos(angle) * radius;
        y = cy + Math.sin(angle) * radius;
        finalAttempts++;
      }
    }
    
    return { x, y, z: Math.random() * 200 };
  };
  
  // Esta función ahora se maneja dentro del useEffect donde se inicializan los partners
  // para poder acceder a las posiciones ya generadas
  return { x: cx, y: cy, z: 0 }; // Placeholder, se reemplazará en el useEffect
};

const ConstellationCanvas: React.FC<ConstellationCanvasProps> = ({
  partners,
  centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  onPartnerHover,
  onPartnerClick,
  mouseX = 0,
  mouseY = 0,
  onPartnerPositionUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const partnerStarsRef = useRef<PartnerStar[]>([]);
  const animationFrameRef = useRef<number>();
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const hoveredPartnerIdRef = useRef<string | null>(null);
  // Guardar posiciones generadas por partner ID para mantenerlas estables
  const partnerPositionsCache = useRef<Map<string, { x: number; y: number; z: number }>>(new Map());
  const [hoveredPartner, setHoveredPartner] = useState<ConstellationPartner | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const backgroundOpacityRef = useRef(1);
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);

  // Actualizar referencias del mouse
  useEffect(() => {
    mouseXRef.current = mouseX;
    mouseYRef.current = mouseY;
  }, [mouseX, mouseY]);

  // Inicializar canvas y estrellas de fondo (solo cuando cambia el tamaño)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      // El canvas debe cubrir toda la sección de constelación
      const constellationSection = canvas.parentElement;
      if (constellationSection) {
        // Obtener el tamaño completo de la sección (incluyendo lo que está fuera del viewport)
        const scrollHeight = Math.max(
          window.innerHeight,
          constellationSection.scrollHeight || window.innerHeight,
          constellationSection.offsetHeight || window.innerHeight
        );
        
        const newWidth = window.innerWidth;
        const newHeight = scrollHeight;
        
        // Solo redimensionar si realmente cambió (evitar redimensionar en cada scroll)
        if (canvas.width !== newWidth || Math.abs(canvas.height - newHeight) > 5) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          canvas.style.width = '100%';
          canvas.style.height = `${newHeight}px`;
        }
      } else {
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
      }
    };
    resizeCanvas();
    
    // Actualizar tamaño del canvas solo en resize, NO en scroll
    window.addEventListener('resize', resizeCanvas);

    // Crear estrellas de fondo solo si no existen
    if (starsRef.current.length === 0) {
      const starCount = 200;
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        size: Math.random() * 1.5 + 0.5,
        brightness: Math.random() * 0.4 + 0.3,
        speed: Math.random() * 0.3 + 0.1
      }));
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); // Solo ejecutar una vez al montar

  // Inicializar/actualizar partners (solo cuando cambian los partners)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Inicializar partner stars - mantener posiciones existentes, solo agregar nuevas
    const minDistanceBetweenNodes = 100;
    
    // Calcular centro relativo al canvas
    // centerX y centerY vienen como coordenadas absolutas del viewport
    // Necesitamos convertirlas a coordenadas relativas al canvas
    const canvasRect = canvas.getBoundingClientRect();
    let cx: number;
    let cy: number;
    
    if (centerX && centerY && centerX > 0 && centerY > 0) {
      // Convertir coordenadas absolutas del viewport a relativas al canvas
      cx = centerX - canvasRect.left;
      cy = centerY - canvasRect.top;
      
      // Asegurarse de que estén dentro de los límites del canvas
      // Dejar un margen para que los nodos no se corten
      const centerMargin = 150;
      cx = Math.max(centerMargin, Math.min(cx, canvas.width - centerMargin));
      cy = Math.max(centerMargin, Math.min(cy, canvas.height - centerMargin));
    } else {
      // Fallback: usar el centro del canvas
      cx = canvas.width / 2;
      cy = canvas.height / 2;
    }
    
    // Calcular maxRadius basado en el tamaño del canvas y el centro
    // Asegurarse de que los nodos no se vayan fuera de la pantalla
    const margin = 100;
    const maxRadiusX = Math.min(cx - margin, canvas.width - cx - margin);
    const maxRadiusY = Math.min(cy - margin, canvas.height - cy - margin);
    const maxRadius = Math.min(maxRadiusX, maxRadiusY, Math.min(canvas.width, canvas.height) * 0.35);
    const nodeRadius = 120;
    const minRadius = nodeRadius + 80;
    
    // Obtener posiciones existentes de partners que ya están cargados
    const existingPositions: { x: number; y: number }[] = [];
    const existingPartnerStars = new Map<string, PartnerStar>();
    
    // Primero, preservar partners existentes que aún están en la lista
    partnerStarsRef.current.forEach(existingStar => {
      if (partners.find(p => p.id === existingStar.id)) {
        existingPartnerStars.set(existingStar.id, existingStar);
        existingPositions.push({ x: existingStar.x, y: existingStar.y });
        // Mantener la posición en el cache
        partnerPositionsCache.current.set(existingStar.id, {
          x: existingStar.x,
          y: existingStar.y,
          z: existingStar.z
        });
      }
    });
    
    // Obtener todas las posiciones existentes (de cache y de partners actuales)
    const allExistingPositions = Array.from(partnerPositionsCache.current.values()).map(p => ({ x: p.x, y: p.y }));
    
    const hasCollision = (x: number, y: number, existingPositions: { x: number; y: number }[]): boolean => {
      for (const pos of existingPositions) {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        if (distance < minDistanceBetweenNodes) {
          return true;
        }
      }
      return false;
    };
    
    const isInProtectedArea = (x: number, y: number): boolean => {
      const distance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
      return distance < minRadius;
    };
    
    // Generar posiciones solo para partners nuevos
    const newPartners = partners.filter(p => !existingPartnerStars.has(p.id));
    const generatedPositionsForNew: { x: number; y: number }[] = [...allExistingPositions];
    
    partnerStarsRef.current = partners.map((partner, index) => {
      // Si el partner ya existe, usar su posición existente
      const existingStar = existingPartnerStars.get(partner.id);
      if (existingStar) {
        return existingStar;
      }
      
      // Si no existe, generar nueva posición (solo para partners nuevos)
      const newPartnerIndex = newPartners.findIndex(p => p.id === partner.id);
      // Generar nueva posición solo para este partner nuevo
      const patterns: ('circle' | 'spiral' | 'cluster')[] = ['circle', 'spiral', 'cluster'];
      const pattern = patterns[newPartnerIndex % patterns.length];
      
      // Generar posición base según patrón
      let baseX: number, baseY: number;
      
      switch (pattern) {
        case 'circle':
          const angle = (newPartnerIndex / newPartners.length) * Math.PI * 2;
          const radius = Math.max(minRadius, Math.min(maxRadius, 150 + (partners.length * 10)));
          baseX = cx + Math.cos(angle) * radius;
          baseY = cy + Math.sin(angle) * radius;
          break;
        case 'spiral':
          const spiralProgress = newPartnerIndex / newPartners.length;
          const spiralAngle = spiralProgress * Math.PI * 4;
          const spiralRadius = Math.max(minRadius, spiralProgress * maxRadius);
          baseX = cx + Math.cos(spiralAngle) * spiralRadius;
          baseY = cy + Math.sin(spiralAngle) * spiralRadius;
          break;
        case 'cluster':
          const clusterOffset = partner.category ? 
            (partner.category.charCodeAt(0) % 3) * 200 - 200 : 0;
          const clusterIndex = newPartnerIndex % 8;
          const clusterAngle = (clusterIndex / 8) * Math.PI * 2;
          const clusterRadius = Math.max(minRadius, 120 + (Math.floor(newPartnerIndex / 8) * 100));
          baseX = cx + Math.cos(clusterAngle) * clusterRadius + clusterOffset;
          baseY = cy + Math.sin(clusterAngle) * clusterRadius;
          break;
        default:
          const randomAngle = Math.random() * Math.PI * 2;
          const randomRadius = minRadius + Math.random() * (maxRadius - minRadius);
          baseX = cx + Math.cos(randomAngle) * randomRadius;
          baseY = cy + Math.sin(randomAngle) * randomRadius;
      }
      
      // Verificar área protegida
      if (isInProtectedArea(baseX, baseY)) {
        const angle = Math.atan2(baseY - cy, baseX - cx);
        baseX = cx + Math.cos(angle) * minRadius;
        baseY = cy + Math.sin(angle) * minRadius;
      }
      
      // Verificar colisiones y ajustar (usando todas las posiciones existentes)
      let x = baseX;
      let y = baseY;
      let attempts = 0;
      const maxAttempts = 20;
      
      // Asegurarse de que las posiciones estén dentro de los límites del canvas
      const margin = 50; // Margen desde los bordes del canvas
      const minX = margin;
      const maxX = canvas.width - margin;
      const minY = margin;
      const maxY = canvas.height - margin;
      
      while (hasCollision(x, y, generatedPositionsForNew) && attempts < maxAttempts) {
        const angle = Math.atan2(y - cy, x - cx);
        const currentDistance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        const newDistance = Math.min(maxRadius, currentDistance + minDistanceBetweenNodes * 0.5);
        x = cx + Math.cos(angle) * newDistance;
        y = cy + Math.sin(angle) * newDistance;
        
        // Asegurarse de que esté dentro de los límites
        x = Math.max(minX, Math.min(x, maxX));
        y = Math.max(minY, Math.min(y, maxY));
        
        attempts++;
      }
      
      // Si aún hay colisión, usar posición aleatoria
      if (hasCollision(x, y, generatedPositionsForNew)) {
        let finalAttempts = 0;
        while (finalAttempts < 10) {
          const randomAngle = Math.random() * Math.PI * 2;
          const randomRadius = minRadius + Math.random() * (maxRadius - minRadius);
          x = cx + Math.cos(randomAngle) * randomRadius;
          y = cy + Math.sin(randomAngle) * randomRadius;
          
          // Asegurarse de que esté dentro de los límites
          x = Math.max(minX, Math.min(x, maxX));
          y = Math.max(minY, Math.min(y, maxY));
          
          if (!hasCollision(x, y, generatedPositionsForNew) && !isInProtectedArea(x, y)) break;
          finalAttempts++;
        }
      }
      
      // Validación final: asegurarse de que esté dentro de los límites
      x = Math.max(minX, Math.min(x, maxX));
      y = Math.max(minY, Math.min(y, maxY));
      
      // Guardar posición en cache
      const pos = { x, y, z: Math.random() * 200 };
      partnerPositionsCache.current.set(partner.id, pos);
      generatedPositionsForNew.push({ x, y });
      
      const partnerStar: PartnerStar = {
        ...partner,
        ...pos,
        size: 40 + Math.random() * 20, // Tamaño para logos (40-60px)
        brightness: 0.8 + Math.random() * 0.2,
        pattern,
        appearProgress: 0, // Nuevos partners empiezan en 0
        isVisible: false,
        logoLoaded: false
      };

      // Cargar logo si existe
      if (partner.logo_url) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          partnerStar.logoImage = img;
          partnerStar.logoLoaded = true;
        };
        img.onerror = () => {
          partnerStar.logoLoaded = false;
        };
        img.src = partner.logo_url;
      }

      return partnerStar;
    });

    // Animar aparición progresiva solo para partners nuevos
    partnerStarsRef.current.forEach((partnerStar, index) => {
      // Si el partner ya estaba visible, mantener su estado
      if (partnerStar.isVisible && partnerStar.appearProgress >= 1) {
        return; // Ya está completamente visible, no animar de nuevo
      }
      
      // Solo animar si es un partner nuevo o si no está completamente visible
      setTimeout(() => {
        partnerStar.isVisible = true;
        const animateAppear = () => {
          if (partnerStar.appearProgress < 1) {
            partnerStar.appearProgress += 0.08;
            if (partnerStar.appearProgress > 1) partnerStar.appearProgress = 1;
            requestAnimationFrame(animateAppear);
          } else {
            partnerStar.appearProgress = 1;
          }
        };
        animateAppear();
      }, index * 200); // Delay progresivo más rápido
    });

    // Función de animación
    const animate = () => {
      // NO redimensionar el canvas en cada frame, solo dibujar
      // El canvas mantiene su tamaño y las posiciones son relativas a él
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.0001;
      const parallaxX = mouseXRef.current * 15;
      const parallaxY = mouseYRef.current * 15;

      // Actualizar opacidad del fondo con animación suave
      const targetOpacity = hoveredPartnerIdRef.current ? 0.3 : 1;
      const opacityDiff = targetOpacity - backgroundOpacityRef.current;
      if (Math.abs(opacityDiff) > 0.01) {
        // Interpolación suave con easing
        backgroundOpacityRef.current += opacityDiff * 0.08;
        // Actualizar state solo ocasionalmente para evitar re-renders excesivos
        if (Math.abs(opacityDiff) < 0.05 || Math.random() < 0.1) {
          setBackgroundOpacity(backgroundOpacityRef.current);
        }
      } else {
        backgroundOpacityRef.current = targetOpacity;
        setBackgroundOpacity(targetOpacity);
      }

      // Dibujar estrellas de fondo
      const currentBgOpacity = backgroundOpacityRef.current;
      
      starsRef.current.forEach((star) => {
        const depthFactor = star.z / 1000;
        const parallaxOffsetX = parallaxX * depthFactor;
        const parallaxOffsetY = parallaxY * depthFactor;
        
        const driftX = Math.sin(time + star.z * 0.01) * star.speed * 0.5;
        const driftY = Math.cos(time + star.z * 0.01) * star.speed * 0.5;

        let x = star.x + parallaxOffsetX + driftX;
        let y = star.y + parallaxOffsetY + driftY;

        if (x < 0) x += canvas.width;
        if (x > canvas.width) x -= canvas.width;
        if (y < 0) y += canvas.height;
        if (y > canvas.height) y -= canvas.height;

        star.x = x - parallaxOffsetX - driftX;
        star.y = y - parallaxOffsetY - driftY;

        const size = star.size * (1 - depthFactor * 0.5);
        const twinkle = Math.sin(time * 2 + star.z * 0.1) * 0.1 + 1;
        const alpha = star.brightness * twinkle * (1 - depthFactor * 0.3) * currentBgOpacity;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      // Dibujar partner stars con logos
      partnerStarsRef.current.forEach((partnerStar) => {
        if (!partnerStar.isVisible) return;

        const depthFactor = partnerStar.z / 1000;
        const parallaxOffsetX = parallaxX * depthFactor;
        const parallaxOffsetY = parallaxY * depthFactor;

        // Las coordenadas x, y ya están en coordenadas del canvas, no necesitan ajuste de scroll
        // porque el canvas está posicionado absolutamente dentro de la sección
        const x = partnerStar.x + parallaxOffsetX;
        const y = partnerStar.y + parallaxOffsetY;
        
        // Verificar que el nodo esté dentro del área visible del canvas
        const isVisible = x >= -100 && x <= canvas.width + 100 && y >= -100 && y <= canvas.height + 100;
        if (!isVisible) return;

        // Actualizar posición para ConnectionLines
        if (onPartnerPositionUpdate) {
          onPartnerPositionUpdate(partnerStar.id, { x, y });
        }

        // Calcular tamaño y opacidad con animación de aparición
        const appearScale = partnerStar.appearProgress;
        const logoSize = partnerStar.size * appearScale;
        const alpha = partnerStar.brightness * appearScale * (1 - depthFactor * 0.2);

        const isHovered = hoveredPartnerIdRef.current === partnerStar.id;
        const glowSize = isHovered ? logoSize * 2.5 : logoSize * 1.8;
        const glowIntensity = isHovered ? 0.6 : 0.3;

        // Glow exterior blanco suave para efecto estrella
        const glowLayers = isHovered ? 3 : 2;
        for (let layer = glowLayers; layer > 0; layer--) {
          const layerSize = glowSize * (layer / glowLayers);
          const layerAlpha = (glowIntensity * 0.4) * (1 / layer) * alpha; // Glow más suave
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, layerSize);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${layerAlpha})`);
          gradient.addColorStop(0.3, `rgba(255, 255, 255, ${layerAlpha * 0.6})`);
          gradient.addColorStop(0.6, `rgba(255, 255, 255, ${layerAlpha * 0.3})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.beginPath();
          ctx.arc(x, y, layerSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Dibujar logo si está cargado
        if (partnerStar.logoLoaded && partnerStar.logoImage) {
          ctx.save();
          
          // Aplicar opacidad
          ctx.globalAlpha = alpha;
          
          // Sombra/glow externo blanco suave
          ctx.shadowBlur = isHovered ? 30 : 15;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
          // Dibujar logo centrado - mantener aspect ratio
          const logoWidth = logoSize * 0.9; // 90% del tamaño para que quepa bien
          const logoHeight = logoSize * 0.9;
          
          // Intentar mantener aspect ratio del logo
          const imgAspect = partnerStar.logoImage.width / partnerStar.logoImage.height;
          let finalWidth = logoWidth;
          let finalHeight = logoHeight;
          
          if (imgAspect > 1) {
            // Logo más ancho que alto
            finalHeight = logoWidth / imgAspect;
          } else {
            // Logo más alto que ancho
            finalWidth = logoHeight * imgAspect;
          }
          
          ctx.drawImage(
            partnerStar.logoImage,
            x - finalWidth / 2,
            y - finalHeight / 2,
            finalWidth,
            finalHeight
          );
          
          ctx.restore();
          
          // Borde blanco suave alrededor del logo (opcional, más sutil)
          ctx.beginPath();
          ctx.arc(x, y, logoSize / 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
          ctx.lineWidth = isHovered ? 1.5 : 0.5;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.stroke();
        } else {
          // Fallback: dibujar círculo blanco brillante si no hay logo
          ctx.beginPath();
          ctx.arc(x, y, logoSize * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
          ctx.fill();
          
          // Borde del círculo
          ctx.beginPath();
          ctx.arc(x, y, logoSize * 0.3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Rayos blancos suaves para estrellas hovered
        if (isHovered) {
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const rayLength = logoSize * 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
              x + Math.cos(angle) * rayLength,
              y + Math.sin(angle) * rayLength
            );
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            ctx.stroke();
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Manejar clicks y hovers
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Verificar si se clickeó un partner (usar tamaño del logo)
      for (const partnerStar of partnerStarsRef.current) {
        if (!partnerStar.isVisible) continue;
        
        const logoSize = partnerStar.size * partnerStar.appearProgress;
        const distance = Math.sqrt(
          Math.pow(x - (partnerStar.x + (mouseXRef.current * 15 * (partnerStar.z / 1000))), 2) + 
          Math.pow(y - (partnerStar.y + (mouseYRef.current * 15 * (partnerStar.z / 1000))), 2)
        );
        if (distance < logoSize * 1.5) {
          onPartnerClick?.(partnerStar);
          break;
        }
      }
    };

    const handleCanvasMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let foundPartner: PartnerStar | null = null;
      let minDistance = Infinity;

      for (const partnerStar of partnerStarsRef.current) {
        if (!partnerStar.isVisible) continue;
        
        const depthFactor = partnerStar.z / 1000;
        const parallaxOffsetX = mouseXRef.current * 15 * depthFactor;
        const parallaxOffsetY = mouseYRef.current * 15 * depthFactor;
        
        const starX = partnerStar.x + parallaxOffsetX;
        const starY = partnerStar.y + parallaxOffsetY;
        const logoSize = partnerStar.size * partnerStar.appearProgress;
        
        const distance = Math.sqrt(
          Math.pow(x - starX, 2) + Math.pow(y - starY, 2)
        );
        
        if (distance < logoSize * 1.5 && distance < minDistance) {
          minDistance = distance;
          foundPartner = partnerStar;
        }
      }

      if (foundPartner && foundPartner.id !== hoveredPartnerIdRef.current) {
        hoveredPartnerIdRef.current = foundPartner.id;
        setHoveredPartner(foundPartner);
        
        // Calcular posición del tooltip desde el nodo (posición exacta del logo)
        const depthFactor = foundPartner.z / 1000;
        const parallaxOffsetX = mouseXRef.current * 15 * depthFactor;
        const parallaxOffsetY = mouseYRef.current * 15 * depthFactor;
        const starX = foundPartner.x + parallaxOffsetX;
        const starY = foundPartner.y + parallaxOffsetY;
        
        // Convertir coordenadas del canvas a coordenadas de la ventana
        const canvasRect = canvas.getBoundingClientRect();
        const tooltipX = canvasRect.left + starX;
        const tooltipY = canvasRect.top + starY;
        
        setTooltipPosition({ x: tooltipX, y: tooltipY });
        onPartnerHover?.(foundPartner);
        canvas.style.cursor = 'pointer';
      } else if (!foundPartner && hoveredPartnerIdRef.current) {
        hoveredPartnerIdRef.current = null;
        setHoveredPartner(null);
        onPartnerHover?.(null);
        canvas.style.cursor = 'default';
      }
    };

    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMove);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousemove', handleCanvasMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [partners, onPartnerHover, onPartnerClick, onPartnerPositionUpdate, centerX, centerY]);

  // Actualizar posición del tooltip cuando hay scroll o resize
  useEffect(() => {
    if (!hoveredPartner) return;
    
    const updateTooltipPosition = () => {
      if (hoveredPartner && canvasRef.current) {
        const canvas = canvasRef.current;
        const hoveredPartnerStar = partnerStarsRef.current.find(p => p.id === hoveredPartner.id);
        if (hoveredPartnerStar) {
          const depthFactor = hoveredPartnerStar.z / 1000;
          const parallaxOffsetX = mouseXRef.current * 15 * depthFactor;
          const parallaxOffsetY = mouseYRef.current * 15 * depthFactor;
          const starX = hoveredPartnerStar.x + parallaxOffsetX;
          const starY = hoveredPartnerStar.y + parallaxOffsetY;
          
          const canvasRect = canvas.getBoundingClientRect();
          const tooltipX = canvasRect.left + starX;
          const tooltipY = canvasRect.top + starY;
          
          setTooltipPosition({ x: tooltipX, y: tooltipY });
        }
      }
    };
    
    // Actualizar inmediatamente
    updateTooltipPosition();
    
    // Escuchar eventos
    window.addEventListener('scroll', updateTooltipPosition, true);
    window.addEventListener('resize', updateTooltipPosition);
    
    // Actualizar en cada frame mientras hay hover (para seguir el nodo en tiempo real)
    const rafId = requestAnimationFrame(function update() {
      updateTooltipPosition();
      if (hoveredPartner) {
        requestAnimationFrame(update);
      }
    });
    
    return () => {
      window.removeEventListener('scroll', updateTooltipPosition, true);
      window.removeEventListener('resize', updateTooltipPosition);
      cancelAnimationFrame(rafId);
    };
  }, [hoveredPartner]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-auto"
        style={{ 
          zIndex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          minHeight: '100vh'
        }}
      />
      <AnimatePresence mode="wait">
        {hoveredPartner && (
          <PartnerTooltip
            key={hoveredPartner.id}
            partner={hoveredPartner}
            position={tooltipPosition}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Componente Tooltip
interface PartnerTooltipProps {
  partner: ConstellationPartner;
  position: { x: number; y: number };
}

const PartnerTooltip: React.FC<PartnerTooltipProps> = ({ partner, position }) => {
  // Cuadro de diálogo simple que aparece cerca del nodo
  const offsetX = 20; // Offset desde el nodo
  const offsetY = 20;
  
  // Calcular posición para que no se salga de la pantalla
  const tooltipWidth = 280;
  const tooltipHeight = 200;
  const padding = 20;
  
  // Determinar mejor posición según espacio disponible
  const spaceTop = position.y;
  const spaceBottom = window.innerHeight - position.y;
  const spaceLeft = position.x;
  const spaceRight = window.innerWidth - position.x;
  
  let left: number;
  let top: number;
  let arrowPosition: { left: number | string; top: string; direction: 'up' | 'down' | 'left' | 'right' } | null = null;
  
  // Decidir posición basada en el espacio disponible
  if (spaceBottom >= tooltipHeight + padding) {
    // Espacio abajo - poner tooltip debajo del nodo
    left = position.x - tooltipWidth / 2;
    top = position.y + offsetY;
    arrowPosition = {
      left: tooltipWidth / 2,
      top: '-16px',
      direction: 'up'
    };
  } else if (spaceTop >= tooltipHeight + padding) {
    // Espacio arriba - poner tooltip arriba del nodo
    left = position.x - tooltipWidth / 2;
    top = position.y - tooltipHeight - offsetY;
    arrowPosition = {
      left: tooltipWidth / 2,
      top: '100%',
      direction: 'down'
    };
  } else if (spaceRight >= tooltipWidth + padding) {
    // Espacio a la derecha - poner tooltip a la derecha del nodo
    left = position.x + offsetX;
    top = position.y - tooltipHeight / 2;
    arrowPosition = {
      left: '-16px',
      top: '50%',
      direction: 'left'
    };
  } else {
    // Espacio a la izquierda - poner tooltip a la izquierda del nodo
    left = position.x - tooltipWidth - offsetX;
    top = position.y - tooltipHeight / 2;
    arrowPosition = {
      left: '100%',
      top: '50%',
      direction: 'right'
    };
  }
  
  // Ajustar si se sale de los bordes
  if (left + tooltipWidth + padding > window.innerWidth) {
    left = window.innerWidth - tooltipWidth - padding;
  }
  if (left < padding) {
    left = padding;
  }
  if (top + tooltipHeight + padding > window.innerHeight) {
    top = window.innerHeight - tooltipHeight - padding;
  }
  if (top < padding) {
    top = padding;
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        y: -10
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: 0
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8,
        y: -10
      }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      <div 
        className="bg-black/95 backdrop-blur-md border border-white/30 rounded-lg p-4 min-w-[240px] max-w-[300px] shadow-[0_8px_32px_rgba(0,240,255,0.3)]"
        style={{
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Flecha apuntando al nodo */}
        {arrowPosition && (
          <div 
            className="absolute w-0 h-0 border-8 border-transparent"
            style={{
              left: typeof arrowPosition.left === 'number' ? `${arrowPosition.left}px` : arrowPosition.left,
              top: arrowPosition.top,
              transform: arrowPosition.top === '50%' ? 'translateY(-50%)' : 'none',
              ...(arrowPosition.direction === 'up' && {
                borderBottomColor: 'rgba(255, 255, 255, 0.3)',
                filter: 'drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.3))'
              }),
              ...(arrowPosition.direction === 'down' && {
                borderTopColor: 'rgba(255, 255, 255, 0.3)',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
              }),
              ...(arrowPosition.direction === 'left' && {
                borderRightColor: 'rgba(255, 255, 255, 0.3)',
                filter: 'drop-shadow(2px 0 4px rgba(0, 0, 0, 0.3))'
              }),
              ...(arrowPosition.direction === 'right' && {
                borderLeftColor: 'rgba(255, 255, 255, 0.3)',
                filter: 'drop-shadow(-2px 0 4px rgba(0, 0, 0, 0.3))'
              })
            }}
          />
        )}
        
        <h3 className="font-display font-bold text-white text-lg mb-1">{partner.name}</h3>
        {partner.category && (
          <span className="text-xs text-cyan-400 font-mono mb-2 block opacity-80">{partner.category}</span>
        )}
        {partner.description && (
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">{partner.description}</p>
        )}
        {partner.tags && partner.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
            {partner.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 rounded text-cyan-300 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ConstellationCanvas;

