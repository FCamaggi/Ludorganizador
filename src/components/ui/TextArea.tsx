/**
 * @file Componente TextArea reutilizable con soporte de tema
 * @module components/ui/TextArea
 */

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme, COLORS } from '../../constants';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

/**
 * TextArea reutilizable con soporte para tema oscuro
 */
const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');

  return (
    <div className="w-full">
      {label && (
        <label 
          className="block text-sm font-medium mb-1"
          style={{ color: theme.text.primary }}
        >
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00] outline-none transition-all resize-none ${className}`}
        style={{
          backgroundColor: theme.bg.primary,
          borderColor: error ? COLORS.accent.DEFAULT : theme.border.medium,
          color: theme.text.primary,
        }}
        {...props}
      />
      {error && (
        <p className="text-sm mt-1" style={{ color: COLORS.accent.DEFAULT }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;
