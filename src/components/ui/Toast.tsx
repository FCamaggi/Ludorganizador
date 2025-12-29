import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const successColor = '#10B981';
  const errorColor = '#EF4444';
  const infoColor = '#3B82F6';

  const icons = {
    success: <CheckCircle style={{ color: successColor }} size={20} />,
    error: <XCircle style={{ color: errorColor }} size={20} />,
    info: <AlertCircle style={{ color: infoColor }} size={20} />,
  };

  const bgColors = {
    success: successColor,
    error: errorColor,
    info: infoColor,
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-bottom-4"
      style={{
        backgroundColor: theme.bg.elevated,
        borderColor: bgColors[type],
        borderWidth: '2px',
      }}
    >
      {icons[type]}
      <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{message}</p>
      <button
        onClick={onClose}
        className="ml-2 transition-colors"
        style={{ color: theme.text.tertiary }}
        onMouseEnter={(e) => e.currentTarget.style.color = theme.text.secondary}
        onMouseLeave={(e) => e.currentTarget.style.color = theme.text.tertiary}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
