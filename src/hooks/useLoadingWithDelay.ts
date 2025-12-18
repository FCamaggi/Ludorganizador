import { useState, useEffect } from 'react';

/**
 * Hook para detectar cuando una carga tarda más de lo esperado
 * Útil para mostrar mensajes de "cold start" en servicios como Render
 */
export const useLoadingWithDelay = (isLoading: boolean, delay: number = 3000) => {
  const [showDelayedMessage, setShowDelayedMessage] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowDelayedMessage(false);
      return;
    }

    const timer = setTimeout(() => {
      if (isLoading) {
        setShowDelayedMessage(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return showDelayedMessage;
};

export default useLoadingWithDelay;
