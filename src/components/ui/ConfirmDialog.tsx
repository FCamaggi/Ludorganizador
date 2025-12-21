import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';
import { COLORS } from '../../constants/colors';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
  additionalInfo?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  additionalInfo,
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const warningBg =
    type === 'danger'
      ? `${COLORS.accent.DEFAULT}15`
      : `${COLORS.primary.DEFAULT}15`;

  const warningColor =
    type === 'danger' ? COLORS.accent.DEFAULT : COLORS.primary.DEFAULT;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div
          className="flex items-center gap-3 p-4 rounded-lg"
          style={{ backgroundColor: warningBg }}
        >
          <AlertTriangle style={{ color: warningColor }} size={24} />
          <p className="text-sm" style={{ color: theme.text.primary }}>
            Esta acción no se puede deshacer.
          </p>
        </div>

        <p style={{ color: theme.text.primary }}>{message}</p>

        {additionalInfo && (
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            {additionalInfo}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
