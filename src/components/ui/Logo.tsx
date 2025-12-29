import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 24, className = '' }) => {
  // Seleccionar la imagen adecuada según el tamaño
  const getLogoSrc = () => {
    if (size <= 16) return '/favicon-16x16.png';
    if (size <= 32) return '/favicon-32x32.png';
    if (size <= 192) return '/android-chrome-192x192.png';
    return '/android-chrome-512x512.png';
  };

  return (
    <img
      src={getLogoSrc()}
      alt="Ludorganizador Logo"
      width={size}
      height={size}
      className={className}
      style={{ display: 'block' }}
    />
  );
};
