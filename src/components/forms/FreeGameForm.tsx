import React, { useState } from 'react';
import { Box, MessageSquare, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { CreateFreeGameData } from '../../types';
import { isValidTitle } from '../../utils/validators';

interface FreeGameFormProps {
  eventId: string;
  onSubmit: (data: CreateFreeGameData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface GameEntry {
  name: string;
  note: string;
}

export const FreeGameForm: React.FC<FreeGameFormProps> = ({
  eventId,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [games, setGames] = useState<GameEntry[]>([{ name: '', note: '' }]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validar que haya al menos un juego con nombre
    const validGames = games.filter((g) => g.name.trim().length > 0);

    if (validGames.length === 0) {
      newErrors.games = 'Debes agregar al menos un juego';
    }

    // Validar cada juego con nombre
    games.forEach((game, index) => {
      if (game.name.trim().length > 0 && !isValidTitle(game.name)) {
        newErrors[`game_${index}`] =
          'El nombre debe tener al menos 3 caracteres';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Filtrar solo juegos con nombre
    const validGames = games
      .filter((g) => g.name.trim().length > 0)
      .map((g) => ({
        name: g.name.trim(),
        note: g.note.trim(),
      }));

    const gameData: CreateFreeGameData = {
      eventId,
      games: validGames,
    };

    onSubmit(gameData);
  };

  const addGame = () => {
    setGames([...games, { name: '', note: '' }]);
  };

  const removeGame = (index: number) => {
    if (games.length > 1) {
      setGames(games.filter((_, i) => i !== index));
    }
  };

  const updateGame = (index: number, field: 'name' | 'note', value: string) => {
    const newGames = [...games];
    newGames[index][field] = value;
    setGames(newGames);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            <Box size={16} className="inline mr-1" />
            Mis Juegos
          </label>
          <button
            type="button"
            onClick={addGame}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
          >
            <Plus size={16} />
            Añadir otro juego
          </button>
        </div>

        {errors.games && <p className="text-red-500 text-sm">{errors.games}</p>}

        {games.map((game, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-start gap-2 mb-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={game.name}
                  onChange={(e) => updateGame(index, 'name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors[`game_${index}`]
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder={`Nombre del juego ${index + 1}`}
                />
                {errors[`game_${index}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`game_${index}`]}
                  </p>
                )}
              </div>
              {games.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGame(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar juego"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <textarea
              value={game.note}
              onChange={(e) => updateGame(index, 'note', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              placeholder="Nota opcional (ej. expansiones, versión, etc.)"
              rows={2}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading
            ? 'Guardando...'
            : `Agregar ${games.filter((g) => g.name.trim()).length} juego(s)`}
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

export default FreeGameForm;
