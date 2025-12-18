import React, { useState } from 'react';
import { Dice6, Users } from 'lucide-react';
import Button from '../ui/Button';
import { CreateTableData } from '../../types';
import { isValidTitle, isValidDescription, isValidPlayerRange } from '../../utils/validators';

interface TableFormProps {
  eventId: string;
  onSubmit: (data: CreateTableData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TableForm: React.FC<TableFormProps> = ({ 
  eventId, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [gameName, setGameName] = useState('');
  const [description, setDescription] = useState('');
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!isValidTitle(gameName)) {
      newErrors.gameName = 'El nombre del juego debe tener al menos 3 caracteres';
    }

    if (!isValidDescription(description)) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!isValidPlayerRange(minPlayers, maxPlayers)) {
      newErrors.players = 'El rango de jugadores debe ser válido (min >= 2, max >= min)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const tableData: CreateTableData = {
      eventId,
      gameName: gameName.trim(),
      description: description.trim(),
      minPlayers,
      maxPlayers,
    };

    onSubmit(tableData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Dice6 size={16} className="inline mr-1" />
          Nombre del Juego *
        </label>
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.gameName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="ej. Catan, Wingspan, Terraforming Mars..."
          required
        />
        {errors.gameName && <p className="text-red-500 text-sm mt-1">{errors.gameName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe el juego, nivel de experiencia requerido, etc..."
          rows={3}
          required
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users size={16} className="inline mr-1" />
            Jugadores Mín. *
          </label>
          <input
            type="number"
            value={minPlayers}
            onChange={(e) => setMinPlayers(parseInt(e.target.value) || 2)}
            min="2"
            max={maxPlayers}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users size={16} className="inline mr-1" />
            Jugadores Máx. *
          </label>
          <input
            type="number"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(parseInt(e.target.value) || 4)}
            min={minPlayers}
            max="20"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      {errors.players && <p className="text-red-500 text-sm mt-1">{errors.players}</p>}

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear Mesa'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default TableForm;
