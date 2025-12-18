/**
 * @file Hook para manejar carga con delay
 * @module hooks/useLoadingWithDelay
 */

import { useState, useEffect } from 'react';

/**
 * Hook que retorna true después de un delay si loading sigue siendo true
 * Útil para mostrar mensajes de "cargando..." solo después de un cierto tiempo
 */
export const useLoadingWithDelay = (loading: boolean, delay: number = 3000): boolean => {
  const [showDelayed, setShowDelayed] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowDelayed(false);
      return;
    }

    const timer = setTimeout(() => {
      if (loading) {
        setShowDelayed(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [loading, delay]);

  return showDelayed;
};
