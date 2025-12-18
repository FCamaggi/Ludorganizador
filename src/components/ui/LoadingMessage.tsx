import React, { useEffect, useState } from 'react';
import { Coffee, Server } from 'lucide-react';

interface LoadingMessageProps {
  isLoading: boolean;
  delay?: number; // milliseconds before showing the message
  message?: string;
}

export const LoadingMessage: React.FC<LoadingMessageProps> = ({
  isLoading,
  delay = 3000,
  message = 'El servidor está despertando...',
}) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowMessage(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowMessage(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  if (!isLoading || !showMessage) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Server size={48} className="text-indigo-600 animate-pulse" />
            <Coffee size={24} className="text-amber-600 absolute -top-2 -right-2 animate-bounce" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          {message}
        </h3>
        
        <p className="text-sm text-gray-600 text-center mb-4">
          El servidor estaba en modo de ahorro de energía y está iniciándose. 
          Esto puede tomar entre 30-60 segundos la primera vez.
        </p>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <p className="text-xs text-indigo-700 text-center">
            <strong>💡 Tip:</strong> Las siguientes acciones serán mucho más rápidas
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
