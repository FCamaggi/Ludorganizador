import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

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
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div
          className={`flex items-center gap-3 p-4 rounded-lg ${
            type === 'danger' ? 'bg-red-50' : 'bg-amber-50'
          }`}
        >
          <AlertTriangle
            className={type === 'danger' ? 'text-red-600' : 'text-amber-600'}
            size={24}
          />
          <p className="text-sm">Esta acción no se puede deshacer.</p>
        </div>

        <p className="text-gray-700">{message}</p>

        {additionalInfo && (
          <p className="text-sm text-gray-600">{additionalInfo}</p>
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
