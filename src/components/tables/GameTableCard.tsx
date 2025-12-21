/**
 * @file Componente de tarjeta para mesas de juego
 * @module components/tables/GameTableCard
 */

import React from 'react';
import { Trash2, Award } from 'lucide-react';
import { GameTable, AuthUser } from '../../types';
import Button from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

interface GameTableCardProps {
  table: GameTable;
  currentUser: AuthUser;
  onJoin: () => void;
  onLeave: () => void;
  onDelete: () => void;
}

/**
 * Tarjeta que muestra información de una mesa de juego
 * Usa la paleta: Tiger Orange (header) con acentos en Razzmatazz (interaction)
 */
const GameTableCard: React.FC<GameTableCardProps> = ({
  table,
  currentUser,
  onJoin,
  onLeave,
  onDelete,
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');

  const isJoined = table.registeredPlayers.some((p) => p.id === currentUser.id);
  const isHost = table.hostId === currentUser.id;
  const isAdmin = currentUser.role === 'admin';
  const canDelete = isHost || isAdmin;
  const isFull = table.registeredPlayers.length >= table.maxPlayers;
  const spotsLeft = table.maxPlayers - table.registeredPlayers.length;

  // Badges usando la paleta - cada tipo de badge usa un color de la paleta
  const badgeConfig: Record<
    string,
    { label: string; color: string; darkColor: string }
  > = {
    veterano: {
      label: 'Veterano',
      color: 'bg-[#C200FB]/20 text-[#C200FB]',
      darkColor: 'dark:bg-[#C200FB]/30 dark:text-[#C200FB]',
    },
    vip: {
      label: 'VIP',
      color: 'bg-[#FFBC0A]/20 text-[#FFBC0A]',
      darkColor: 'dark:bg-[#FFBC0A]/30 dark:text-[#FFBC0A]',
    },
    organizador: {
      label: 'Organizador',
      color: 'bg-[#EC7D10]/20 text-[#EC7D10]',
      darkColor: 'dark:bg-[#EC7D10]/30 dark:text-[#EC7D10]',
    },
    fundador: {
      label: 'Fundador',
      color: 'bg-[#EC0868]/20 text-[#EC0868]',
      darkColor: 'dark:bg-[#EC0868]/30 dark:text-[#EC0868]',
    },
  };

  return (
    <div
      className="rounded-xl shadow-sm border overflow-hidden flex flex-col h-[400px]"
      style={{
        backgroundColor: theme.bg.elevated,
        borderColor: theme.border.light,
      }}
    >
      {/* Header con Tiger Orange (secondary) */}
      <div
        className="p-4 text-white flex-shrink-0"
        style={{
          background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.interaction} 100%)`,
        }}
      >
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg truncate pr-2">{table.gameName}</h3>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full whitespace-nowrap">
            {table.minPlayers}-{table.maxPlayers} Jug.
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-white/90 text-xs">Host: {table.hostName}</p>
          {table.hostRole === 'admin' && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-white/30 text-white flex items-center gap-1">
              <Award size={10} />
              Admin
            </span>
          )}
          {table.hostBadges && table.hostBadges.length > 0 && (
            <div className="flex gap-1">
              {table.hostBadges.map((badge) => {
                const config = badgeConfig[badge] || {
                  label: badge,
                  color: 'bg-white/30 text-white',
                  darkColor: 'dark:bg-white/30 dark:text-white',
                };
                return (
                  <span
                    key={badge}
                    className="text-xs px-1.5 py-0.5 rounded bg-white/30 text-white flex items-center gap-1"
                  >
                    <Award size={10} />
                    {config.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col overflow-hidden">
        <p
          className="text-sm mb-4 line-clamp-2 italic flex-shrink-0"
          style={{ color: theme.text.secondary }}
        >
          "{table.description}"
        </p>

        <div className="flex-grow overflow-hidden flex flex-col">
          <h4
            className="text-xs font-semibold uppercase tracking-wider mb-2 flex justify-between flex-shrink-0"
            style={{ color: theme.text.tertiary }}
          >
            <span>
              Jugadores ({table.registeredPlayers.length}/{table.maxPlayers})
            </span>
            {isFull && !isJoined && (
              <span style={{ color: theme.action }}>Mesa Llena</span>
            )}
          </h4>
          <div className="space-y-1 overflow-y-auto pr-1 custom-scrollbar">
            {table.registeredPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-2 text-sm px-2 py-1 rounded"
                style={{
                  color: theme.text.primary,
                  backgroundColor: theme.bg.tertiary,
                }}
              >
                {/* Dot con Razzmatazz (interaction) */}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: theme.interaction }}
                ></div>
                <span className="truncate">{player.name}</span>
                {player.id === table.hostId && (
                  <span
                    className="text-xs font-bold flex-shrink-0"
                    style={{ color: theme.secondary }}
                  >
                    (Host)
                  </span>
                )}
              </div>
            ))}
            {Array.from({ length: Math.max(0, spotsLeft) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-2 text-sm px-2 py-1 border border-dashed rounded"
                style={{
                  color: theme.text.tertiary,
                  borderColor: theme.border.light,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: theme.border.medium }}
                ></div>
                <span>Libre</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-2 space-y-2 flex-shrink-0">
          {isJoined ? (
            <Button
              variant="outline"
              className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:border-red-500"
              onClick={onLeave}
            >
              Salir de la mesa
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full"
              disabled={isFull}
              onClick={onJoin}
            >
              {isFull ? 'Completo' : 'Inscribirse'}
            </Button>
          )}
          {canDelete && (
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-300 hover:bg-red-50"
              onClick={onDelete}
            >
              <Trash2 size={16} />
              <span className="ml-1">Eliminar Mesa</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameTableCard;
