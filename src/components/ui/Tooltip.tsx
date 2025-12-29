import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

interface TooltipProps {
  content: string;
  className?: string;
}

/**
 * Componente de tooltip para mostrar información de ayuda
 */
const Tooltip: React.FC<TooltipProps> = ({ content, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center justify-center transition-colors focus:outline-none"
        style={{ color: theme.text.tertiary }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = theme.text.secondary;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = theme.text.tertiary;
        }}
        aria-label="Ayuda"
      >
        <HelpCircle size={18} />
      </button>

      {isVisible && (
        <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-64">
          <div className="text-sm rounded-lg p-3 shadow-xl" style={{ backgroundColor: theme.bg.elevated, color: theme.text.primary, border: `1px solid ${theme.border.light}` }}>
            {content}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1">
              <div className="border-8 border-transparent" style={{ borderBottomColor: theme.bg.elevated }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
