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
  RefreshCw,
  Share2,
} from 'lucide-react';
import { GameEvent, GameTable, FreeGame, AuthUser } from '../../types';
import GameTableCard from '../tables/GameTableCard';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import { formatEventDate } from '../../utils/dateUtils';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme, COLORS } from '../../constants';

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
  onEditTable: (table: GameTable) => void;
  onAddFreeGame: () => void;
  onDeleteFreeGame: (game: FreeGame) => void;
  onDeleteIndividualGame: (
    gameListId: string,
    gameIndex: number,
    gameName: string
  ) => void;
  onEditIndividualGame: (
    gameListId: string,
    gameIndex: number,
    gameName: string,
    gameNote: string
  ) => void;
  onDeleteEvent: (event: GameEvent) => void;
  onArchiveEvent: (event: GameEvent) => void;
  onRefreshTables: () => void;
  onRefreshFreeGames: () => void;
  onShareEvent: (event: GameEvent) => void;
  onShareTable: (table: GameTable, eventTitle: string) => void;
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
  onEditTable,
  onAddFreeGame,
  onDeleteFreeGame,
  onDeleteIndividualGame,
  onEditIndividualGame,
  onDeleteEvent,
  onArchiveEvent,
  onRefreshTables,
  onRefreshFreeGames,
  onShareEvent,
  onShareTable,
  isLoading = false,
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);
  const isAdmin = currentUser.role === 'admin';
  const canDeleteEvent =
    isAdmin || (event.creatorId && event.creatorId === currentUser.id);

  // Determinar si la descripción es larga (más de 200 caracteres o más de 3 líneas)
  const isLongDescription = event.description && event.description.length > 200;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      {/* Breadcrumb / Back */}
      <button
        onClick={onBack}
        className="mb-6 text-sm font-medium flex items-center gap-1"
        style={{ color: COLORS.accent.DEFAULT }}
      >
        &larr; Volver a Eventos
      </button>

      {/* Event Details Card */}
      <div 
        className="rounded-xl shadow-lg p-6 mb-8" 
        style={{
          background: 'linear-gradient(135deg, #EC7D10 0%, #FC2F00 100%)',
          color: '#FFFFFF',
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#FFFFFF' }}>{event.title}</h1>
            {event.description && (
              <div className="mb-4">
                <p 
                  className={`transition-all ${!isDescriptionExpanded && isLongDescription ? 'line-clamp-3' : ''}`}
                  style={{ opacity: 0.9, whiteSpace: 'pre-wrap', color: '#FFFFFF' }}
                >
                  {event.description}
                </p>
                {isLongDescription && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-sm mt-2 font-medium underline"
                    style={{ color: '#FFFFFF', opacity: 0.9 }}
                  >
                    {isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
            )}
            <div className="space-y-2" style={{ color: '#FFFFFF' }}>
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
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2" style={{ color: '#FFFFFF' }}>
                <Lock size={20} />
              </div>
            )}
            <button
              onClick={() => onShareEvent(event)}
              className="bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-sm rounded-lg px-3 py-2 transition-colors"
              style={{ color: '#FFFFFF' }}
              title="Compartir evento"
            >
              <Share2 size={20} />
            </button>
            {canDeleteEvent && (
              <>
                <button
                  onClick={() => onArchiveEvent(event)}
                  className="bg-yellow-500/20 hover:bg-yellow-500/30 backdrop-blur-sm rounded-lg px-3 py-2 transition-colors"
                  style={{ color: '#FFFFFF' }}
                  title="Archivar evento"
                >
                  <Archive size={20} />
                </button>
                <button
                  onClick={() => onDeleteEvent(event)}
                  className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-lg px-3 py-2 transition-colors"
                  style={{ color: '#FFFFFF' }}
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
      <div className="flex border-b mb-8" style={{ borderColor: theme.border.light }}>
        <button
          onClick={() => onTabChange('tables')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'tables'
              ? 'border-b-2'
              : ''
          }`}
          style={{
            color: activeTab === 'tables' ? COLORS.accent.DEFAULT : theme.text.secondary,
            borderColor: activeTab === 'tables' ? COLORS.accent.DEFAULT : 'transparent',
          }}
        >
          Mesas ({tables.length})
        </button>
        <button
          onClick={() => onTabChange('free')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'free'
              ? 'border-b-2'
              : ''
          }`}
          style={{
            color: activeTab === 'free' ? COLORS.accent.DEFAULT : theme.text.secondary,
            borderColor: activeTab === 'free' ? COLORS.accent.DEFAULT : 'transparent',
          }}
        >
          Juegos Libres ({freeGames.length})
        </button>
      </div>

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2
                className="text-2xl font-bold"
                style={{ color: theme.text.primary }}
              >
                Mesas de Juego
              </h2>
              <Tooltip content="Una mesa de juego es un espacio donde un anfitrión propone jugar un juego específico. Otros jugadores pueden unirse hasta completar los lugares disponibles." />
            </div>
            <div className="flex gap-2">
              <button
                onClick={onRefreshTables}
                disabled={isLoading}
                className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  color: theme.text.secondary,
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.color = COLORS.accent.DEFAULT;
                    e.currentTarget.style.backgroundColor = `${COLORS.accent.DEFAULT}10`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.text.secondary;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Actualizar mesas"
              >
                <RefreshCw
                  size={20}
                  className={isLoading ? 'animate-spin' : ''}
                />
              </button>
              <Button onClick={onCreateTable} disabled={isLoading}>
                <Plus size={20} />
                <span className="hidden sm:inline">Nueva Mesa</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...tables].sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateA - dateB; // Más antiguas primero
            }).map((table) => (
              <GameTableCard
                key={table.id}
                table={table}
                currentUser={currentUser}
                onJoin={() => onJoinTable(table)}
                onLeave={() => onLeaveTable(table)}
                onDelete={() => onDeleteTable(table)}
                onEdit={() => onEditTable(table)}
                onShare={() => onShareTable(table, event.title)}
              />
            ))}

            {tables.length === 0 && !isLoading && (
              <div className="col-span-full py-16 text-center" style={{ color: theme.text.tertiary }}>
                <Box size={48} className="mx-auto mb-4 opacity-20" />
                <p>No hay mesas creadas aún.</p>
                <p className="text-sm mt-2">¡Sé el primero en crear una!</p>
              </div>
            )}

            {isLoading && (
              <div className="col-span-full py-16 text-center" style={{ color: theme.text.tertiary }}>
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
              <div className="flex items-center gap-2">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: theme.text.primary }}
                >
                  Juegos Libres
                </h2>
                <Tooltip content="Una ludoteca o lista de juegos libres es una colección de juegos que traes al evento. No se asignan a una mesa específica, pero están disponibles para partidas espontáneas." />
              </div>
              <p
                className="text-sm mt-1"
                style={{ color: theme.text.secondary }}
              >
                Juegos sin mesa asignada para partidas espontáneas
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onRefreshFreeGames}
                disabled={isLoading}
                className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  color: theme.text.secondary,
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.color = COLORS.accent.DEFAULT;
                    e.currentTarget.style.backgroundColor = `${COLORS.accent.DEFAULT}10`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.text.secondary;
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Actualizar juegos libres"
              >
                <RefreshCw
                  size={20}
                  className={isLoading ? 'animate-spin' : ''}
                />
              </button>
              <Button onClick={onAddFreeGame} disabled={isLoading}>
                <Plus size={20} />
                <span className="hidden sm:inline">Agregar mis Juegos</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {freeGames.map((gameList) => {
              const canEdit = gameList.ownerId === currentUser.id || isAdmin;

              return (
                <div
                  key={gameList.id}
                  className="rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
                  style={{
                    backgroundColor: theme.bg.elevated,
                    borderColor: theme.border.light,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Box size={20} style={{ color: theme.secondary }} />
                      <h3
                        className="font-bold"
                        style={{ color: theme.text.primary }}
                      >
                        {gameList.ownerName}
                      </h3>
                      {gameList.ownerRole === 'admin' && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[#EC0868]/20 text-[#EC0868] flex items-center gap-1">
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
                                  color: 'bg-[#C200FB]/20 text-[#C200FB]',
                                },
                                vip: {
                                  label: 'VIP',
                                  color: 'bg-[#FFBC0A]/20 text-[#FFBC0A]',
                                },
                                organizador: {
                                  label: 'Organizador',
                                  color: 'bg-[#EC7D10]/20 text-[#EC7D10]',
                                },
                                fundador: {
                                  label: 'Fundador',
                                  color: 'bg-[#EC0868]/20 text-[#EC0868]',
                                },
                              };
                              const config = badgeConfig[badge] || {
                                label: badge,
                                color: 'bg-gray-500/20 text-gray-500',
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
                        className="transition-colors p-1"
                        style={{ color: theme.text.tertiary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = COLORS.accent.DEFAULT;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = theme.text.tertiary;
                        }}
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
                        className="rounded p-3 border group relative"
                        style={{
                          backgroundColor: theme.bg.tertiary,
                          borderColor: theme.border.light,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p
                              className="font-medium"
                              style={{ color: theme.text.primary }}
                            >
                              {game.name}
                            </p>
                            {game.note && (
                              <p
                                className="text-sm italic mt-1"
                                style={{ color: theme.text.secondary }}
                              >
                                "{game.note}"
                              </p>
                            )}
                          </div>
                          {canEdit && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  onEditIndividualGame(
                                    gameList.id,
                                    idx,
                                    game.name,
                                    game.note || ''
                                  )
                                }
                                className="p-1 rounded"
                                style={{
                                  color: theme.text.secondary,
                                  backgroundColor: 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${theme.text.secondary}10`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    'transparent';
                                }}
                                title="Editar juego"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  onDeleteIndividualGame(
                                    gameList.id,
                                    idx,
                                    game.name
                                  )
                                }
                                className="p-1 rounded"
                                style={{
                                  color: COLORS.accent.DEFAULT,
                                  backgroundColor: 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${COLORS.accent.DEFAULT}10`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    'transparent';
                                }}
                                title="Eliminar este juego"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p
                    className="text-xs mt-3"
                    style={{ color: theme.text.tertiary }}
                  >
                    {gameList.games.length} juego
                    {gameList.games.length !== 1 ? 's' : ''} disponible
                    {gameList.games.length !== 1 ? 's' : ''}
                  </p>
                </div>
              );
            })}

            {freeGames.length === 0 && !isLoading && (
              <div className="col-span-full py-16 text-center" style={{ color: theme.text.tertiary }}>
                <Box size={48} className="mx-auto mb-4 opacity-20" />
                <p>No hay juegos libres aún.</p>
                <p className="text-sm mt-2">¡Agrega tus juegos disponibles!</p>
              </div>
            )}

            {isLoading && (
              <div className="col-span-full py-16 text-center" style={{ color: theme.text.tertiary }}>
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
