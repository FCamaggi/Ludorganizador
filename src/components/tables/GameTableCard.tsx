/**
 * @file Componente de tarjeta para mesas de juego
 * @module components/tables/GameTableCard
 */

import React from 'react';
import { Trash2, Award } from 'lucide-react';
import { GameTable, AuthUser } from '../../types';
import Button from '../ui/Button';

interface GameTableCardProps {
  table: GameTable;
  currentUser: AuthUser;
  onJoin: () => void;
  onLeave: () => void;
  onDelete: () => void;
}

/**
 * Tarjeta que muestra información de una mesa de juego
 */
const GameTableCard: React.FC<GameTableCardProps> = ({
  table,
  currentUser,
  onJoin,
  onLeave,
  onDelete,
}) => {
  const isJoined = table.registeredPlayers.some((p) => p.id === currentUser.id);
  const isHost = table.hostId === currentUser.id;
  const isAdmin = currentUser.role === 'admin';
  const canDelete = isHost || isAdmin;
  const isFull = table.registeredPlayers.length >= table.maxPlayers;
  const spotsLeft = table.maxPlayers - table.registeredPlayers.length;

  const badgeConfig: Record<string, { label: string; color: string }> = {
    veterano: { label: 'Veterano', color: 'bg-purple-100 text-purple-800' },
    vip: { label: 'VIP', color: 'bg-yellow-100 text-yellow-800' },
    organizador: { label: 'Organizador', color: 'bg-blue-100 text-blue-800' },
    fundador: { label: 'Fundador', color: 'bg-green-100 text-green-800' },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg truncate pr-2">{table.gameName}</h3>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full whitespace-nowrap">
            {table.minPlayers}-{table.maxPlayers} Jug.
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-indigo-100 text-xs">Host: {table.hostName}</p>
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

      <div className="p-4 flex-grow flex flex-col">
        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3 italic">
          "{table.description}"
        </p>

        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
            <span>
              Jugadores ({table.registeredPlayers.length}/{table.maxPlayers})
            </span>
            {isFull && !isJoined && (
              <span className="text-red-500">Mesa Llena</span>
            )}
          </h4>
          <div className="space-y-1">
            {table.registeredPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                {player.name}{' '}
                {player.id === table.hostId && (
                  <span className="text-xs text-indigo-500 font-bold">
                    (Host)
                  </span>
                )}
              </div>
            ))}
            {Array.from({ length: Math.max(0, spotsLeft) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-2 text-sm text-gray-300 px-2 py-1 border border-dashed border-gray-200 rounded"
              >
                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                Libre
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-2 space-y-2">
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
