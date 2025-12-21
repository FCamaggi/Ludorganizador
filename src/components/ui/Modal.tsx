/**
 * @file Componente Modal reutilizable
 * @module components/ui/Modal
 */

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Modal reutilizable con cierre por ESC, backdrop y soporte para tema oscuro
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ backgroundColor: theme.bg.elevated }}
      >
        <div
          className="flex items-center justify-between p-6 border-b sticky top-0 z-10"
          style={{
            backgroundColor: theme.bg.elevated,
            borderColor: theme.border.light,
          }}
        >
          <h2
            id="modal-title"
            className="text-xl font-bold"
            style={{ color: theme.text.primary }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full"
            aria-label="Cerrar modal"
            style={{
              color: theme.text.tertiary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.state.hover;
              e.currentTarget.style.color = theme.text.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.text.tertiary;
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
