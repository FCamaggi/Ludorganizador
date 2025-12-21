import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

interface PasswordVerificationFormProps {
  onSubmit: (password: string) => void;
  onCancel: () => void;
  error?: string;
  isLoading?: boolean;
}

export const PasswordVerificationForm: React.FC<PasswordVerificationFormProps> = ({ 
  onSubmit, 
  onCancel, 
  error,
  isLoading = false 
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Contraseña del Evento"
        icon={<Lock size={16} />}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Introduce la contraseña"
        error={error}
        autoFocus
        required
      />

      <div className="flex gap-3">
        <Button type="submit" variant="primary" className="flex-1" disabled={isLoading}>
          {isLoading ? 'Verificando...' : 'Acceder'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default PasswordVerificationForm;
