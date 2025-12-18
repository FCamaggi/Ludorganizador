import React from 'react';
import {
  Calendar,
  MapPin,
  Lock,
  Plus,
  Box,
  Trash2,
  Archive,
  Award,
  Edit3,
} from 'lucide-react';
import { GameEvent, GameTable, FreeGame, AuthUser } from '../../types';
import GameTableCard from '../tables/GameTableCard';
import Button from '../ui/Button';
import { formatEventDate } from '../../utils/dateUtils';

interface EventDetailViewProps {
  event: GameEvent;
  tables: GameTable[];
  freeGames: FreeGame[];
  currentUser: AuthUser;
  activeTab: 'tables' | 'free';
  onTabChange: (tab: 'tables' | 'free') => void;
  onBack: () => void;
  onCreateTable: () => void;
  onJoinTable: (table: GameTable) => void;
  onLeaveTable: (table: GameTable) => void;
  onDeleteTable: (table: GameTable) => void;
  onAddFreeGame: () => void;
  onDeleteFreeGame: (game: FreeGame) => void;
  onDeleteEvent: (event: GameEvent) => void;
  onArchiveEvent: (event: GameEvent) => void;
  isLoading?: boolean;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  tables,
  freeGames,
  currentUser,
  activeTab,
  onTabChange,
  onBack,
  onCreateTable,
  onJoinTable,
  onLeaveTable,
  onDeleteTable,
  onAddFreeGame,
  onDeleteFreeGame,
  onDeleteEvent,
  onArchiveEvent,
  isLoading = false,
}) => {
  const isAdmin = currentUser.role === 'admin';
  const canDeleteEvent =
    isAdmin || (event.creatorId && event.creatorId === currentUser.id);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      {/* Breadcrumb / Back */}
      <button
        onClick={onBack}
        className="mb-6 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
      >
        &larr; Volver a Eventos
      </button>

      {/* Event Details Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            {event.description && (
              <p className="text-indigo-100 mb-4">{event.description}</p>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatEventDate(event.date)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {event.password && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <Lock size={20} />
              </div>
            )}
            {canDeleteEvent && (
              <>
                <button
                  onClick={() => onArchiveEvent(event)}
                  className="bg-yellow-500/20 hover:bg-yellow-500/30 backdrop-blur-sm rounded-lg px-3 py-2 transition-colors"
                  title="Archivar evento"
                >
                  <Archive size={20} />
                </button>
                <button
                  onClick={() => onDeleteEvent(event)}
                  className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-lg px-3 py-2 transition-colors"
                  title="Eliminar evento"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mapa embebido */}
      {event.location && event.showMap !== false && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <iframe
            title={`Mapa de ${event.location}`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
              event.location
            )}`}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => onTabChange('tables')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'tables'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Mesas ({tables.length})
        </button>
        <button
          onClick={() => onTabChange('free')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'free'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Juegos Libres ({freeGames.length})
        </button>
      </div>

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mesas de Juego</h2>
            <Button onClick={onCreateTable} disabled={isLoading}>
              <Plus size={20} />
              <span className="hidden sm:inline">Nueva Mesa</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <GameTableCard
                key={table.id}
                table={table}
                currentUser={currentUser}
                onJoin={() => onJoinTable(table)}
                onLeave={() => onLeaveTable(table)}
                onDelete={() => onDeleteTable(table)}
              />
            ))}

            {tables.length === 0 && !isLoading && (
              <div className="col-span-full py-16 text-center text-gray-400">
                <Box size={48} className="mx-auto mb-4 opacity-20" />
                <p>No hay mesas creadas aún.</p>
                <p className="text-sm mt-2">¡Sé el primero en crear una!</p>
              </div>
            )}

            {isLoading && (
              <div className="col-span-full py-16 text-center text-gray-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p>Cargando mesas...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Free Games Tab */}
      {activeTab === 'free' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Juegos Libres
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Juegos sin mesa asignada para partidas espontáneas
              </p>
            </div>
            <Button onClick={onAddFreeGame} disabled={isLoading}>
              <Plus size={20} />
              <span className="hidden sm:inline">Agregar mis Juegos</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {freeGames.map((gameList) => {
              const canEdit = gameList.ownerId === currentUser.id || isAdmin;

              return (
                <div
                  key={gameList.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Box size={20} className="text-indigo-500" />
                      <h3 className="font-bold text-gray-800">
                        {gameList.ownerName}
                      </h3>
                      {gameList.ownerRole === 'admin' && (
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 flex items-center gap-1">
                          <Award size={12} />
                          Admin
                        </span>
                      )}
                      {gameList.ownerBadges &&
                        gameList.ownerBadges.length > 0 && (
                          <div className="flex gap-1">
                            {gameList.ownerBadges.map((badge) => {
                              const badgeConfig: Record<
                                string,
                                { label: string; color: string }
                              > = {
                                veterano: {
                                  label: 'Veterano',
                                  color: 'bg-purple-100 text-purple-800',
                                },
                                vip: {
                                  label: 'VIP',
                                  color: 'bg-yellow-100 text-yellow-800',
                                },
                                organizador: {
                                  label: 'Organizador',
                                  color: 'bg-blue-100 text-blue-800',
                                },
                                fundador: {
                                  label: 'Fundador',
                                  color: 'bg-green-100 text-green-800',
                                },
                              };
                              const config = badgeConfig[badge] || {
                                label: badge,
                                color: 'bg-gray-100 text-gray-800',
                              };
                              return (
                                <span
                                  key={badge}
                                  className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${config.color}`}
                                >
                                  <Award size={12} />
                                  {config.label}
                                </span>
                              );
                            })}
                          </div>
                        )}
                    </div>
                    {canEdit && (
                      <button
                        onClick={() => onDeleteFreeGame(gameList)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Eliminar lista de juegos"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {gameList.games.map((game, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded p-3 border border-gray-100"
                      >
                        <p className="font-medium text-gray-900">{game.name}</p>
                        {game.note && (
                          <p className="text-sm text-gray-600 italic mt-1">
                            "{game.note}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    {gameList.games.length} juego
                    {gameList.games.length !== 1 ? 's' : ''} disponible
                    {gameList.games.length !== 1 ? 's' : ''}
                  </p>
                </div>
              );
            })}

            {freeGames.length === 0 && !isLoading && (
              <div className="col-span-full py-16 text-center text-gray-400">
                <Box size={48} className="mx-auto mb-4 opacity-20" />
                <p>No hay juegos libres agregados aún.</p>
                <p className="text-sm mt-2">¡Agrega el primero!</p>
              </div>
            )}

            {isLoading && (
              <div className="col-span-full py-16 text-center text-gray-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p>Cargando juegos...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailView;
