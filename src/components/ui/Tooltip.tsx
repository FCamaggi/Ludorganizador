import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  className?: string;
}

/**
 * Componente de tooltip para mostrar información de ayuda
 */
const Tooltip: React.FC<TooltipProps> = ({ content, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
        aria-label="Ayuda"
      >
        <HelpCircle size={18} />
      </button>

      {isVisible && (
        <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-64">
          <div className="bg-gray-900 text-white text-sm rounded-lg p-3 shadow-xl">
            {content}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1">
              <div className="border-8 border-transparent border-b-gray-900" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
