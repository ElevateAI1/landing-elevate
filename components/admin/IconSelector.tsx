import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconSelectorProps {
  currentIcon?: string;
  onIconChange: (iconName: string) => void;
  label?: string;
}

// Lista de iconos populares disponibles
const AVAILABLE_ICONS = [
  'ShieldAlert', 'Cpu', 'Lock', 'Server', 'Database', 'Cloud', 'Network', 
  'Code', 'Box', 'Zap', 'Settings', 'Activity', 'BarChart', 'Briefcase',
  'Building', 'CheckCircle', 'ChevronRight', 'Circle', 'Clock', 'Command',
  'FileText', 'Filter', 'Folder', 'Globe', 'Home', 'Info', 'Key', 'Layers',
  'Link', 'Mail', 'MessageSquare', 'Monitor', 'Package', 'Play', 'Search',
  'Shield', 'Star', 'Target', 'TrendingUp', 'Users', 'Wifi', 'X'
];

export const IconSelector: React.FC<IconSelectorProps> = ({
  currentIcon,
  onIconChange,
  label = 'Icono'
}) => {
  const IconComponent = currentIcon ? (LucideIcons as any)[currentIcon] : null;

  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-500 uppercase">{label}</label>
      <div className="flex items-center gap-4">
        {IconComponent ? (
          <div className="w-16 h-16 border border-emerald-500/30 bg-black/50 flex items-center justify-center">
            {React.createElement(IconComponent, { size: 32, className: "text-emerald-400" })}
          </div>
        ) : (
          <div className="w-16 h-16 border border-dashed border-gray-700 flex items-center justify-center bg-black/20">
            <span className="text-gray-600 text-xs">Sin icono</span>
          </div>
        )}
        
        <div className="flex-1">
          <select
            value={currentIcon || ''}
            onChange={(e) => onIconChange(e.target.value)}
            className="w-full bg-transparent border border-gray-700 p-2 text-white focus:border-emerald-500 outline-none"
          >
            <option value="">Seleccionar icono</option>
            {AVAILABLE_ICONS.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName];
              return (
                <option key={iconName} value={iconName}>
                  {iconName}
                </option>
              );
            })}
          </select>
          <p className="text-xs text-gray-500 mt-1">Elige un icono de Lucide React</p>
        </div>
      </div>
    </div>
  );
};

