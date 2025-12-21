import React, { useState } from 'react';
import { Dice6, Users } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import { CreateTableData } from '../../types';
import {
  isValidTitle,
  isValidDescription,
  isValidPlayerRange,
} from '../../utils/validators';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

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
  isLoading = false,
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');
  const [gameName, setGameName] = useState('');
  const [description, setDescription] = useState('');
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!isValidTitle(gameName)) {
      newErrors.gameName =
        'El nombre del juego debe tener al menos 3 caracteres';
    }

    if (!isValidDescription(description)) {
      newErrors.description =
        'La descripción debe tener al menos 10 caracteres';
    }

    if (!isValidPlayerRange(minPlayers, maxPlayers)) {
      newErrors.players =
        'El rango de jugadores debe ser válido (min >= 2, max >= min)';
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
      <Input
        label="Nombre del Juego *"
        icon={<Dice6 size={16} />}
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        placeholder="ej. Catan, Wingspan, Terraforming Mars..."
        error={errors.gameName}
        required
      />

      <TextArea
        label="Descripción *"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe el juego, nivel de experiencia requerido, etc..."
        rows={3}
        error={errors.description}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Jugadores Mín. *"
          icon={<Users size={16} />}
          type="number"
          value={minPlayers.toString()}
          onChange={(e) => setMinPlayers(Number(e.target.value) || 2)}
          min="2"
          max={maxPlayers.toString()}
          required
        />

        <Input
          label="Jugadores Máx. *"
          icon={<Users size={16} />}
          type="number"
          value={maxPlayers.toString()}
          onChange={(e) => setMaxPlayers(Number(e.target.value) || 4)}
          min={minPlayers.toString()}
          max="20"
          required
        />
      </div>
      {errors.players && (
        <p className="text-sm mt-1" style={{ color: theme.state.error }}>
          {errors.players}
        </p>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Creando...' : 'Crear Mesa'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default TableForm;
