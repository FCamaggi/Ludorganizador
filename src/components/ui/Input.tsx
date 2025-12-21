/**
 * @file Componente Input reutilizable con soporte de tema
 * @module components/ui/Input
 */

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme, COLORS } from '../../constants';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * Input reutilizable con soporte para tema oscuro
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
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
      <div className="relative">
        {icon && (
          <div 
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: theme.text.tertiary }}
          >
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00] outline-none transition-all ${className}`}
          style={{
            backgroundColor: theme.bg.primary,
            borderColor: error ? COLORS.accent.DEFAULT : theme.border.medium,
            color: theme.text.primary,
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm mt-1" style={{ color: COLORS.accent.DEFAULT }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
