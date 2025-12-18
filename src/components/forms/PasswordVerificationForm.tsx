import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import Button from '../ui/Button';

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
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Lock size={16} className="inline mr-1" />
          Contraseña del Evento
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Introduce la contraseña"
          autoFocus
          required
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

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
