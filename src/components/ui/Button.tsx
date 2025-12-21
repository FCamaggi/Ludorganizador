/**
 * @file Componente Button reutilizable
 * @module components/ui/Button
 */

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

/**
 * Botón reutilizable con diferentes variantes y soporte para tema oscuro
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');

  const baseStyles =
    'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#FC2F00] text-white hover:bg-[#D42800] focus:ring-[#FC2F00] shadow-md hover:shadow-lg disabled:hover:bg-[#FC2F00]',
    secondary:
      'bg-[#EC7D10] text-white hover:bg-[#D47010] focus:ring-[#EC7D10] shadow-sm disabled:hover:bg-[#EC7D10]',
    outline:
      'border-2 border-[#FFBC0A] hover:border-[#FC2F00] hover:text-[#FC2F00] disabled:hover:border-[#FFBC0A]',
    danger:
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 disabled:hover:bg-red-500',
  };

  // Estilos inline para outline que respetan el tema
  const outlineStyle =
    variant === 'outline'
      ? {
          color: theme.text.primary,
          backgroundColor: 'transparent',
        }
      : {};

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      style={outlineStyle}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
