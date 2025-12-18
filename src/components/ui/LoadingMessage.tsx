/**
 * @file Componente para mensajes de carga prolongada
 * @module components/ui/LoadingMessage
 */

import React from 'react';

interface LoadingMessageProps {
  isLoading: boolean;
}

/**
 * Mensaje que se muestra cuando la carga tarda más de lo esperado
 * Útil para informar al usuario sobre cold starts en servicios como Render
 */
const LoadingMessage: React.FC<LoadingMessageProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-300 text-blue-800 px-6 py-3 rounded-lg shadow-lg max-w-md text-center z-50 animate-in fade-in slide-in-from-bottom-4">
      <p className="font-medium mb-1">Cargando datos...</p>
      <p className="text-sm text-blue-600">
        El servidor está iniciando. Esto puede tomar unos segundos.
      </p>
    </div>
  );
};

export default LoadingMessage;
