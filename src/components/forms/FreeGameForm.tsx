import React, { useState } from 'react';
import { Box, MessageSquare, Plus, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import { CreateFreeGameData } from '../../types';
import { isValidTitle } from '../../utils/validators';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';
import { COLORS } from '../../constants/colors';

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
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');
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
          <label
            className="block text-sm font-medium"
            style={{ color: theme.text.primary }}
          >
            <Box size={16} className="inline mr-1" />
            Mis Juegos
          </label>
          <button
            type="button"
            onClick={addGame}
            className="flex items-center gap-1 text-sm transition-colors"
            style={{ color: COLORS.accent.DEFAULT }}
          >
            <Plus size={16} />
            Añadir otro juego
          </button>
        </div>

        {errors.games && (
          <p className="text-sm" style={{ color: COLORS.accent.DEFAULT }}>
            {errors.games}
          </p>
        )}

        {games.map((game, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: theme.bg.elevated,
              borderColor: theme.border.light,
            }}
          >
            <div className="flex items-start gap-2 mb-2">
              <div className="flex-1">
                <Input
                  value={game.name}
                  onChange={(e) => updateGame(index, 'name', e.target.value)}
                  placeholder={`Nombre del juego ${index + 1}`}
                  error={errors[`game_${index}`]}
                />
              </div>
              {games.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGame(index)}
                  className="p-2 rounded transition-colors mt-1"
                  style={{ color: COLORS.accent.DEFAULT }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${COLORS.accent.DEFAULT}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Eliminar juego"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <TextArea
              value={game.note}
              onChange={(e) => updateGame(index, 'note', e.target.value)}
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
