import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  User as UserIcon,
  Dice6,
  Box,
  LogOut,
  MessageSquare,
  Lock,
  Shield,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import Modal from './components/Modal';
import Button from './components/Button';
import AuthForm from './components/AuthForm';
import AdminPanel from './components/AdminPanel';
import { GameEvent, GameTable, FreeGame, AuthUser } from './types';
import * as api from './services/apiService';

// --- Components defined within App.tsx to keep file count low as requested, but separated conceptually ---

const EventCard: React.FC<{ event: GameEvent; onClick: () => void }> = ({
  event,
  onClick,
}) => {
  const isPrivate = !!event.password;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-6 cursor-pointer transition-all hover:border-indigo-200 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
              {event.title}
            </h3>
            {isPrivate && <Lock size={16} className="text-amber-600" />}
          </div>
          {!isPrivate && (
            <p className="text-sm text-gray-500 mt-1">{event.description}</p>
          )}
          {isPrivate && (
            <p className="text-sm text-amber-600 mt-1 italic">Evento Privado</p>
          )}
        </div>
        <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg">
          <Calendar size={24} />
        </div>
      </div>
      {!isPrivate ? (
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <span>
              {format(new Date(event.date), "d 'de' MMMM, yyyy - HH:mm", {
                locale: es,
              })}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-400 italic">
          Introduce la contraseña para ver los detalles
        </div>
      )}
    </div>
  );
};

const GameTableCard: React.FC<{
  table: GameTable;
  currentUser: AuthUser;
  onJoin: () => void;
  onLeave: () => void;
  onDelete: () => void;
}> = ({ table, currentUser, onJoin, onLeave, onDelete }) => {
  const isJoined = table.registeredPlayers.some((p) => p.id === currentUser.id);
  const isHost = table.hostId === currentUser.id;
  const isAdmin = currentUser.role === 'admin';
  const canDelete = isHost || isAdmin;
  const isFull = table.registeredPlayers.length >= table.maxPlayers;
  const spotsLeft = table.maxPlayers - table.registeredPlayers.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg truncate pr-2">{table.gameName}</h3>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full whitespace-nowrap">
            {table.minPlayers}-{table.maxPlayers} Jug.
          </span>
        </div>
        <p className="text-indigo-100 text-xs mt-1">Host: {table.hostName}</p>
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

// --- Main App Component ---

const App: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [view, setView] = useState<'events' | 'detail'>('events');
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);

  // Detail View State
  const [tables, setTables] = useState<GameTable[]>([]);
  const [freeGames, setFreeGames] = useState<FreeGame[]>([]);
  const [activeTab, setActiveTab] = useState<'tables' | 'free'>('tables');

  // Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isFreeGameModalOpen, setIsFreeGameModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Forms
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventPassword, setNewEventPassword] = useState('');

  // Password verification
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const [unlockedEvents, setUnlockedEvents] = useState<Set<string>>(new Set());

  // Table Form & AI
  const [newTableName, setNewTableName] = useState('');
  const [newTableDesc, setNewTableDesc] = useState('');
  const [newTableMin, setNewTableMin] = useState(2);
  const [newTableMax, setNewTableMax] = useState(4);

  // Free Game Form
  const [newFreeGameName, setNewFreeGameName] = useState('');
  const [newFreeGameNote, setNewFreeGameNote] = useState('');

  // Initialization
  useEffect(() => {
    const authUser = api.getCurrentUser();
    if (authUser) {
      setUser(authUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadEventsData();
    }
  }, [user]);

  const loadEventsData = async () => {
    try {
      const eventsData = await api.loadEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  // Load Event Data when active event changes
  useEffect(() => {
    if (activeEventId && user) {
      loadEventData();
    }
  }, [activeEventId, user]);

  const loadEventData = async () => {
    if (!activeEventId) return;
    try {
      const [tablesData, gamesData] = await Promise.all([
        api.loadTables(activeEventId),
        api.loadFreeGames(activeEventId),
      ]);
      setTables(tablesData);
      setFreeGames(gamesData);
    } catch (error) {
      console.error('Error loading event data:', error);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setView('events');
    setActiveEventId(null);
    setEvents([]);
  };

  // --- Actions ---

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        title: newEventTitle,
        location: newEventLocation,
        date: new Date(newEventDate).toISOString(),
        description: 'Evento organizado por la comunidad.',
        ...(newEventPassword.trim() && { password: newEventPassword.trim() }),
      };
      await api.saveEvent(eventData);
      await loadEventsData();
      setIsEventModalOpen(false);
      // Reset form
      setNewEventTitle('');
      setNewEventLocation('');
      setNewEventDate('');
      setNewEventPassword('');
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert(error.message || 'Error al crear evento');
    }
  };

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeEventId) return;

    try {
      await api.saveTable({
        eventId: activeEventId,
        gameName: newTableName,
        description: newTableDesc,
        minPlayers: newTableMin,
        maxPlayers: newTableMax,
      });
      await loadEventData();
      setIsTableModalOpen(false);
      // Reset
      setNewTableName('');
      setNewTableDesc('');
      setNewTableMin(2);
      setNewTableMax(4);
    } catch (error: any) {
      console.error('Error creating table:', error);
      alert(error.message || 'Error al crear mesa');
    }
  };

  const handleJoinTable = async (table: GameTable) => {
    if (!user) return;
    if (table.registeredPlayers.length >= table.maxPlayers) return;
    if (table.registeredPlayers.find((p) => p.id === user.id)) return;

    try {
      await api.joinTable(table.id);
      await loadEventData();
    } catch (error: any) {
      console.error('Error joining table:', error);
      alert(error.message || 'Error al unirse a la mesa');
    }
  };

  const handleLeaveTable = async (table: GameTable) => {
    if (!user) return;

    try {
      await api.leaveTable(table.id);
      await loadEventData();
    } catch (error: any) {
      console.error('Error leaving table:', error);
      alert(error.message || 'Error al salir de la mesa');
    }
  };

  const handleDeleteTable = async (table: GameTable) => {
    if (!user) return;

    if (!confirm(`¿Estás seguro de eliminar la mesa "${table.gameName}"?`)) {
      return;
    }

    try {
      await api.deleteTable(table.id);
      await loadEventData();
    } catch (error: any) {
      console.error('Error deleting table:', error);
      alert(error.message || 'Error al eliminar mesa');
    }
  };

  const handleDeleteFreeGame = async (game: FreeGame) => {
    if (!user) return;

    if (!confirm(`¿Estás seguro de eliminar el juego "${game.gameName}"?`)) {
      return;
    }

    try {
      await api.deleteFreeGame(game.id);
      await loadEventData();
    } catch (error: any) {
      console.error('Error deleting game:', error);
      alert(error.message || 'Error al eliminar juego');
    }
  };

  const handleAddFreeGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeEventId) return;

    try {
      await api.saveFreeGame({
        eventId: activeEventId,
        gameName: newFreeGameName,
        note: newFreeGameNote,
      });
      await loadEventData();
      setIsFreeGameModalOpen(false);
      setNewFreeGameName('');
      setNewFreeGameNote('');
    } catch (error: any) {
      console.error('Error adding game:', error);
      alert(error.message || 'Error al agregar juego');
    }
  };

  const handleEventClick = (event: GameEvent) => {
    // Si el evento no tiene contraseña o ya fue desbloqueado, acceder directamente
    if (!event.password || unlockedEvents.has(event.id)) {
      setActiveEventId(event.id);
      setView('detail');
      return;
    }

    // Si tiene contraseña, mostrar modal de contraseña
    setPendingEventId(event.id);
    setIsPasswordModalOpen(true);
    setPasswordInput('');
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingEventId) return;

    try {
      const event = await api.verifyEventPassword(
        pendingEventId,
        passwordInput
      );
      // Contraseña correcta
      setUnlockedEvents((prev) => new Set(prev).add(pendingEventId));
      setActiveEventId(pendingEventId);
      setView('detail');
      setIsPasswordModalOpen(false);
      setPasswordInput('');
      setPasswordError('');
      setPendingEventId(null);
    } catch (error: any) {
      // Contraseña incorrecta
      setPasswordError(
        error.message || 'Contraseña incorrecta. Inténtalo de nuevo.'
      );
    }
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    setPasswordInput('');
    setPasswordError('');
    setPendingEventId(null);
  };

  // --- Renders ---

  if (!user) {
    return <AuthForm onComplete={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setView('events');
              setActiveEventId(null);
            }}
          >
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Dice6 size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Ludorganizador
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <UserIcon size={16} />
              <span className="font-medium">{user.name}</span>
            </div>
            {user.role === 'admin' && (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
                title="Panel de Administración"
              >
                <Shield size={20} />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Events View */}
        {view === 'events' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Próximos Eventos
                </h1>
                <p className="text-gray-500 mt-1">
                  Encuentra una reunión y únete a una mesa.
                </p>
              </div>
              <Button onClick={() => setIsEventModalOpen(true)}>
                <Plus size={20} />
                <span className="hidden sm:inline">Nuevo Evento</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onClick={() => handleEventClick(evt)}
                />
              ))}
              {events.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-400">
                  <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No hay eventos programados aún.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detail View */}
        {view === 'detail' && activeEventId && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {/* Breadcrumb / Back */}
            <button
              onClick={() => {
                setView('events');
                setActiveEventId(null);
              }}
              className="mb-6 text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              &larr; Volver a Eventos
            </button>

            {/* Event Details Card */}
            {(() => {
              const currentEvent = events.find((e) => e.id === activeEventId);
              if (!currentEvent) return null;
              return (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">
                        {currentEvent.title}
                      </h1>
                      {currentEvent.description && (
                        <p className="text-indigo-100 mb-4">
                          {currentEvent.description}
                        </p>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={18} />
                          <span>{currentEvent.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={18} />
                          <span>
                            {format(
                              new Date(currentEvent.date),
                              "EEEE d 'de' MMMM, yyyy - HH:mm",
                              {
                                locale: es,
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    {currentEvent.password && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                        <Lock size={20} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
              <button
                className={`pb-4 px-6 text-sm font-medium transition-colors relative ${
                  activeTab === 'tables'
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('tables')}
              >
                Mesas Organizadas ({tables.length})
                {activeTab === 'tables' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>
                )}
              </button>
              <button
                className={`pb-4 px-6 text-sm font-medium transition-colors relative ${
                  activeTab === 'free'
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('free')}
              >
                Ludoteca / Juegos Libres ({freeGames.length})
                {activeTab === 'free' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>
                )}
              </button>
            </div>

            {/* Tables Content */}
            {activeTab === 'tables' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Mesas Disponibles
                  </h2>
                  <Button onClick={() => setIsTableModalOpen(true)}>
                    <Plus size={18} />
                    <span className="hidden sm:inline">Crear Mesa</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tables.map((table) => (
                    <GameTableCard
                      key={table.id}
                      table={table}
                      currentUser={user}
                      onJoin={() => handleJoinTable(table)}
                      onLeave={() => handleLeaveTable(table)}
                      onDelete={() => handleDeleteTable(table)}
                    />
                  ))}
                  {tables.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        No hay mesas creadas
                      </h3>
                      <p className="text-gray-500 mt-1">
                        ¡Sé el primero en proponer un juego!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Free Games Content */}
            {activeTab === 'free' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Ludoteca Colaborativa
                    </h2>
                    <p className="text-sm text-gray-500">
                      Juegos que la gente traerá para jugar si surgen mesas
                      espontáneas.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setIsFreeGameModalOpen(true)}
                  >
                    <Box size={18} />
                    <span className="hidden sm:inline ml-2">Aportar Juego</span>
                  </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
                  {freeGames.map((game) => {
                    const canDelete =
                      user.id === game.ownerId || user.role === 'admin';
                    return (
                      <div
                        key={game.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-teal-50 text-teal-600 p-2 rounded-lg mt-1 sm:mt-0">
                            <Dice6 size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">
                              {game.gameName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Traído por{' '}
                              <span className="text-indigo-600 font-medium">
                                {game.ownerName}
                              </span>
                            </p>
                            {game.note && (
                              <p className="text-xs text-gray-400 mt-1 italic">
                                "{game.note}"
                              </p>
                            )}
                          </div>
                        </div>
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteFreeGame(game)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                            title="Eliminar juego"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {freeGames.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                      Nadie ha registrado juegos libres aún.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      {/* --- Modals --- */}
      {/* Create Event Modal */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title="Organizar Nuevo Evento"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Evento
            </label>
            <input
              required
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="Ej. Tarde de Euros"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lugar
            </label>
            <input
              required
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newEventLocation}
              onChange={(e) => setNewEventLocation(e.target.value)}
              placeholder="Ej. Providencia, Santiago / Casa de Juan..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha y Hora
            </label>
            <input
              required
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña (Opcional - para eventos privados)
            </label>
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-gray-400" />
              <input
                type="password"
                autoComplete="new-password"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newEventPassword}
                onChange={(e) => setNewEventPassword(e.target.value)}
                placeholder="Opcional - solo para eventos privados"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Si estableces una contraseña, los detalles del evento serán
              privados
            </p>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEventModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear Evento</Button>
          </div>
        </form>
      </Modal>
      {/* Create Table Modal */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        title="Crear Mesa de Juego"
      >
        <form onSubmit={handleCreateTable} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Juego de Mesa
            </label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="Ej. Catan, Terraforming Mars..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Jugadores
              </label>
              <input
                required
                type="number"
                min="1"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newTableMin}
                onChange={(e) => setNewTableMin(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Jugadores
              </label>
              <input
                required
                type="number"
                min="1"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newTableMax}
                onChange={(e) => setNewTableMax(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción / Reglas / Notas
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newTableDesc}
              onChange={(e) => setNewTableDesc(e.target.value)}
              placeholder="Explica brevemente de qué va o si explicarás las reglas."
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTableModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Publicar Mesa</Button>
          </div>
        </form>
      </Modal>
      {/* Password Verification Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={handlePasswordModalClose}
        title="Evento Privado"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock size={32} />
            </div>
            <p className="text-gray-600">
              Este evento es privado. Introduce la contraseña para acceder.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              required
              type="password"
              autoFocus
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError('');
              }}
              placeholder="Introduce la contraseña"
            />
            {passwordError && (
              <p className="text-sm text-red-500 mt-2">{passwordError}</p>
            )}
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePasswordModalClose}
            >
              Cancelar
            </Button>
            <Button type="submit">Acceder</Button>
          </div>
        </form>
      </Modal>
      {/* Add Free Game Modal */}
      <Modal
        isOpen={isFreeGameModalOpen}
        onClose={() => setIsFreeGameModalOpen(false)}
        title="Aportar a la Ludoteca"
      >
        <form onSubmit={handleAddFreeGame} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Juego
            </label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newFreeGameName}
              onChange={(e) => setNewFreeGameName(e.target.value)}
              placeholder="Ej. Love Letter"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nota (Opcional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newFreeGameNote}
              onChange={(e) => setNewFreeGameNote(e.target.value)}
              placeholder="Ej. Edición Deluxe, puedo explicarlo..."
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFreeGameModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="secondary">
              Añadir
            </Button>
          </div>
        </form>
      </Modal>
      {/* Admin Panel */}
      {isAdminPanelOpen && user && (
        <AdminPanel
          currentUser={user}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}{' '}
    </div>
  );
};

export default App;
