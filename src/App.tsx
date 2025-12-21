import React, { useState, useEffect } from 'react';
import {
  Dice6,
  UserIcon as User,
  LogOut,
  Shield,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react';
import { AuthUser, GameEvent, GameTable, FreeGame } from './types';
import { useAuth } from './hooks/useAuth';
import { useEvents } from './hooks/useEvents';
import { useTables } from './hooks/useTables';
import { useFreeGames } from './hooks/useFreeGames';
import { useLoadingWithDelay } from './hooks/useLoadingWithDelay';
import AuthForm from './components/auth/AuthForm';
import AdminPanel from './components/admin/AdminPanel';
import Modal from './components/ui/Modal';
import Toast from './components/ui/Toast';
import LoadingMessage from './components/ui/LoadingMessage';
import ConfirmDialog from './components/ui/ConfirmDialog';
import { EventsView, EventDetailView } from './components/views';
import {
  EventForm,
  TableForm,
  FreeGameForm,
  PasswordVerificationForm,
} from './components/forms';
import * as api from './services/apiService';
import { API_CONFIG, getTheme } from './constants';
import { COLORS } from './constants/colors';
import { useTheme } from './contexts/ThemeContext';

type View = 'events' | 'detail';
type Tab = 'tables' | 'free';

const App: React.FC = () => {
  // Theme
  const { theme: themeMode, toggleTheme } = useTheme();
  const theme = getTheme(themeMode === 'dark');

  // Authentication
  const { user, logout, refreshCurrentUser } = useAuth();

  // View State
  const [view, setView] = useState<View>('events');
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('tables');
  const [archivedEventsCount, setArchivedEventsCount] = useState(0);
  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  const [isRefreshingUser, setIsRefreshingUser] = useState(false);

  // Custom Hooks
  const {
    events,
    loading: eventsLoading,
    createEvent,
    deleteEvent,
    archiveEvent,
    loadEvents,
  } = useEvents(user?.id || null);

  const {
    tables,
    loading: tablesLoading,
    createTable,
    joinTable,
    leaveTable,
    deleteTable,
    loadTables,
  } = useTables(activeEventId);

  const {
    freeGames,
    loading: gamesLoading,
    createFreeGame,
    deleteFreeGame,
    deleteIndividualGame,
    loadFreeGames,
  } = useFreeGames(activeEventId);

  // Detect prolonged loading (for Render cold starts)
  const isLoading = eventsLoading || tablesLoading || gamesLoading;
  const showDelayedMessage = useLoadingWithDelay(isLoading, 3000);

  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isFreeGameModalOpen, setIsFreeGameModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  // Password Verification
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState('');
  const [unlockedEvents, setUnlockedEvents] = useState<Set<string>>(new Set());

  // Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    additionalInfo?: string;
    confirmText?: string;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // Load events when user logs in
  useEffect(() => {
    if (user) {
      loadEvents();
      // Si es admin, cargar count de eventos archivados y usuarios pendientes
      if (user.role === 'admin') {
        loadArchivedEventsCount();
        loadPendingUsersCount();
      }
    }
  }, [user, loadEvents]);

  // Load event data when active event changes
  useEffect(() => {
    if (activeEventId && user) {
      loadTables(activeEventId);
      loadFreeGames(activeEventId);
    }
  }, [activeEventId, user, loadTables, loadFreeGames]);

  const loadArchivedEventsCount = async () => {
    try {
      const authUserStr = localStorage.getItem('ludorganizador_auth_user');
      if (!authUserStr) return;
      const authUser = JSON.parse(authUserStr);

      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/stats`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPendingUsersCount(data.pendingUsers || 0);
      }
    } catch (error) {
      console.error('Error loading archived events count:', error);
    }
  };

  const loadPendingUsersCount = async () => {
    try {
      const authUserStr = localStorage.getItem('ludorganizador_auth_user');
      if (!authUserStr) return;
      const authUser = JSON.parse(authUserStr);

      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/stats`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPendingUsersCount(data.pendingUsers || 0);
      }
    } catch (error) {
      console.error('Error loading pending users count:', error);
    }
  };

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    setToast({ show: true, message, type });
  };

  // --- Event Handlers ---

  const handleLogout = () => {
    logout();
    setView('events');
    setActiveEventId(null);
  };

  const handleEventClick = (event: GameEvent) => {
    const isAdmin = user?.role === 'admin';

    // Admin tiene acceso directo a todos los eventos (llave maestra)
    // También si no tiene contraseña o ya fue desbloqueado
    if (isAdmin || !event.password || unlockedEvents.has(event.id)) {
      setActiveEventId(event.id);
      setView('detail');
      return;
    }

    // Si tiene contraseña y no eres admin, mostrar modal de contraseña
    setPendingEventId(event.id);
    setIsPasswordModalOpen(true);
    setPasswordError('');
  };

  const handlePasswordSubmit = async (password: string) => {
    if (!pendingEventId) return;

    try {
      await api.verifyEventPassword(pendingEventId, password);
      // Contraseña correcta
      setUnlockedEvents((prev) => new Set(prev).add(pendingEventId));
      setActiveEventId(pendingEventId);
      setView('detail');
      setIsPasswordModalOpen(false);
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
    setPasswordError('');
    setPendingEventId(null);
  };

  const handleCreateEvent = async (eventData: any) => {
    try {
      await createEvent(eventData);
      setIsEventModalOpen(false);
    } catch (error: any) {
      alert(error.message || 'Error al crear evento');
    }
  };

  const handleCreateTable = async (tableData: any) => {
    try {
      await createTable(tableData);
      setIsTableModalOpen(false);
    } catch (error: any) {
      alert(error.message || 'Error al crear mesa');
    }
  };

  const handleJoinTable = async (table: GameTable) => {
    if (!user) return;
    if (table.registeredPlayers.length >= table.maxPlayers) return;
    if (table.registeredPlayers.find((p) => p.id === user.id)) return;

    try {
      await joinTable(table.id);
    } catch (error: any) {
      alert(error.message || 'Error al unirse a la mesa');
    }
  };

  const handleLeaveTable = async (table: GameTable) => {
    try {
      await leaveTable(table.id);
    } catch (error: any) {
      alert(error.message || 'Error al salir de la mesa');
    }
  };

  const handleDeleteTable = async (table: GameTable) => {
    const isAdmin = user?.role === 'admin';
    const isOwner = table.hostId === user?.id;
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Mesa',
      message: `¿Estás seguro de que deseas eliminar la mesa "${table.gameName}"?`,
      additionalInfo: isAdmin
        ? 'Se eliminarán todos los jugadores registrados. Esta acción no se puede deshacer.'
        : isOwner
        ? 'Como creador de la mesa, puedes eliminarla en cualquier momento.'
        : 'Se eliminarán todos los jugadores registrados.',
      onConfirm: async () => {
        try {
          await deleteTable(table.id);
        } catch (error: any) {
          alert(error.message || 'Error al eliminar mesa');
        }
      },
    });
  };

  const handleAddFreeGame = async (gameData: any) => {
    try {
      await createFreeGame(gameData);
      setIsFreeGameModalOpen(false);
    } catch (error: any) {
      alert(error.message || 'Error al agregar juego');
    }
  };

  const handleDeleteFreeGame = async (game: FreeGame) => {
    const isAdmin = user?.role === 'admin';
    const isOwner = game.ownerId === user?.id;
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Lista de Juegos',
      message: `¿Estás seguro de que deseas eliminar toda tu lista de juegos?`,
      additionalInfo: isAdmin
        ? 'Se eliminarán todos los juegos de la lista. Esta acción no se puede deshacer.'
        : isOwner
        ? 'Como quien añadió esta lista, puedes eliminarla en cualquier momento.'
        : undefined,
      onConfirm: async () => {
        try {
          await deleteFreeGame(game.id);
        } catch (error: any) {
          alert(error.message || 'Error al eliminar lista de juegos');
        }
      },
    });
  };

  const handleDeleteIndividualGame = async (
    gameListId: string,
    gameIndex: number,
    gameName: string
  ) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Juego',
      message: `¿Estás seguro de que deseas eliminar "${gameName}" de tu lista?`,
      additionalInfo: 'Si es el último juego, se eliminará toda la lista.',
      onConfirm: async () => {
        try {
          await deleteIndividualGame(gameListId, gameIndex);
        } catch (error: any) {
          alert(error.message || 'Error al eliminar juego');
        }
      },
    });
  };

  const handleDeleteEvent = async (event: GameEvent) => {
    const isAdmin = user?.role === 'admin';
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Evento',
      message: `¿Estás seguro de que deseas eliminar el evento "${event.title}"? Se eliminarán todas las mesas y juegos asociados.`,
      additionalInfo: isAdmin
        ? 'Esta acción no se puede deshacer.'
        : 'Esta acción no se puede deshacer. Como creador, puedes eliminar este evento en cualquier momento.',
      onConfirm: async () => {
        try {
          await deleteEvent(event.id);
          setView('events');
          setActiveEventId(null);
        } catch (error: any) {
          alert(error.message || 'Error al eliminar evento');
        }
      },
    });
  };

  const handleArchiveEvent = async (event: GameEvent) => {
    const isAdmin = user?.role === 'admin';
    setConfirmDialog({
      isOpen: true,
      title: 'Archivar Evento',
      message: `¿Archivar el evento "${event.title}"?`,
      confirmText: 'Archivar',
      additionalInfo: isAdmin
        ? 'Podrás restaurarlo desde el panel de administración.'
        : 'El evento quedará oculto. Solo un administrador podrá restaurarlo desde el panel de administración.',
      onConfirm: async () => {
        try {
          await archiveEvent(event.id);
          setView('events');
          setActiveEventId(null);
          // Actualizar contador si eres admin
          if (user?.role === 'admin') {
            loadArchivedEventsCount();
          }
        } catch (error: any) {
          alert(error.message || 'Error al archivar evento');
        }
      },
    });
  };

  const handleBackToEvents = () => {
    setView('events');
    setActiveEventId(null);
  };

  // --- Render ---

  if (!user) {
    return <AuthForm onComplete={() => window.location.reload()} />;
  }

  const currentEvent = activeEventId
    ? events.find((e) => e.id === activeEventId)
    : null;

  return (
    <div
      className="min-h-screen font-sans pb-20 transition-colors duration-200"
      style={{
        backgroundColor: theme.bg.primary,
        color: theme.text.primary,
      }}
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-[#EC7D10] to-[#FC2F00] sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleBackToEvents}
          >
            <div className="bg-white/20 backdrop-blur-sm text-white p-1.5 rounded-lg">
              <Dice6 size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Ludorganizador
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <User size={16} />
              <span className="font-medium">{user.name}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="text-white/80 hover:text-white transition-colors"
              title={themeMode === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={async () => {
                setIsRefreshingUser(true);
                try {
                  await refreshCurrentUser();
                  showToast('Usuario actualizado', 'success');
                } catch (error) {
                  console.error('Error al refrescar usuario:', error);
                  showToast('Error al actualizar usuario', 'error');
                } finally {
                  setIsRefreshingUser(false);
                }
              }}
              disabled={isRefreshingUser}
              className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
              title="Actualizar información de usuario"
            >
              <RefreshCw
                size={18}
                className={isRefreshingUser ? 'animate-spin' : ''}
              />
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="text-white/80 hover:text-white transition-colors relative"
                title="Panel de Administración"
              >
                <Shield size={20} />
                {archivedEventsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C200FB] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    !
                  </span>
                )}
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-white/80 hover:text-white transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 pb-16">
        {user.role === 'nuevo' && (
          <div
            className="mb-6 border-l-4 p-4 rounded"
            style={{
              backgroundColor:
                themeMode === 'dark'
                  ? 'rgba(255, 188, 10, 0.1)'
                  : 'rgba(255, 188, 10, 0.2)',
              borderLeftColor: theme.primary,
            }}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5"
                  style={{ color: theme.primary }}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm" style={{ color: theme.text.primary }}>
                  <span className="font-medium">
                    Cuenta pendiente de aprobación:
                  </span>{' '}
                  Tu cuenta ha sido registrada y está en la lista de espera. Un
                  administrador la revisará y aprobará pronto. Una vez aprobada,
                  podrás crear eventos y mesas.
                </p>
              </div>
            </div>
          </div>
        )}

        {view === 'events' && (
          <EventsView
            events={events}
            onEventClick={handleEventClick}
            onCreateEvent={() => {
              if (user.role === 'nuevo') {
                showToast(
                  'Debes esperar a que un administrador apruebe tu cuenta',
                  'error'
                );
                return;
              }
              setIsEventModalOpen(true);
            }}
            onRefresh={loadEvents}
            isLoading={eventsLoading}
          />
        )}

        {view === 'detail' && currentEvent && (
          <EventDetailView
            event={currentEvent}
            tables={tables}
            freeGames={freeGames}
            currentUser={user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onBack={handleBackToEvents}
            onCreateTable={() => {
              if (user.role === 'nuevo') {
                showToast(
                  'Debes esperar a que un administrador apruebe tu cuenta',
                  'error'
                );
                return;
              }
              setIsTableModalOpen(true);
            }}
            onJoinTable={handleJoinTable}
            onLeaveTable={handleLeaveTable}
            onDeleteTable={handleDeleteTable}
            onAddFreeGame={() => {
              if (user.role === 'nuevo') {
                showToast(
                  'Debes esperar a que un administrador apruebe tu cuenta',
                  'error'
                );
                return;
              }
              setIsFreeGameModalOpen(true);
            }}
            onDeleteFreeGame={handleDeleteFreeGame}
            onDeleteIndividualGame={handleDeleteIndividualGame}
            onDeleteEvent={handleDeleteEvent}
            onArchiveEvent={handleArchiveEvent}
            onRefreshTables={() => loadTables(activeEventId!)}
            onRefreshFreeGames={() => loadFreeGames(activeEventId!)}
            isLoading={tablesLoading || gamesLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className="fixed bottom-0 left-0 right-0 py-3 text-center"
        style={{
          background: `linear-gradient(to top, ${theme.bg.primary}, transparent)`,
        }}
      >
        <p className="text-xs" style={{ color: theme.text.tertiary }}>
          Desarrollado con{' '}
          <span style={{ color: COLORS.accent.DEFAULT }}>❤️</span> por{' '}
          <span className="font-medium" style={{ color: theme.text.secondary }}>
            Fabrizio Camaggi
          </span>
        </p>
      </footer>

      {/* Modals */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title="Crear Nuevo Evento"
      >
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setIsEventModalOpen(false)}
          existingEvents={events}
          isLoading={eventsLoading}
        />
      </Modal>

      <Modal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        title="Crear Nueva Mesa"
      >
        {activeEventId && (
          <TableForm
            eventId={activeEventId}
            onSubmit={handleCreateTable}
            onCancel={() => setIsTableModalOpen(false)}
            isLoading={tablesLoading}
          />
        )}
      </Modal>

      <Modal
        isOpen={isFreeGameModalOpen}
        onClose={() => setIsFreeGameModalOpen(false)}
        title="Agregar Juego Libre"
      >
        {activeEventId && (
          <FreeGameForm
            eventId={activeEventId}
            onSubmit={handleAddFreeGame}
            onCancel={() => setIsFreeGameModalOpen(false)}
            isLoading={gamesLoading}
          />
        )}
      </Modal>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={handlePasswordModalClose}
        title="Evento Privado"
        size="sm"
      >
        <PasswordVerificationForm
          onSubmit={handlePasswordSubmit}
          onCancel={handlePasswordModalClose}
          error={passwordError}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        additionalInfo={confirmDialog.additionalInfo}
        confirmText={confirmDialog.confirmText || 'Eliminar'}
      />

      {user.role === 'admin' && (
        <Modal
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          title="Panel de Administración"
          size="lg"
        >
          <AdminPanel
            onClose={() => setIsAdminPanelOpen(false)}
            onEventChange={() => {
              loadEvents();
              loadArchivedEventsCount();
              if (user.role === 'admin') {
                loadPendingUsersCount();
              }
            }}
            showToast={showToast}
            onUserUpdate={async () => {
              try {
                await refreshCurrentUser();
                showToast('Usuario actualizado', 'info');
              } catch (error) {
                console.error('Error al refrescar usuario:', error);
              }
            }}
          />
        </Modal>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <LoadingMessage isLoading={showDelayedMessage} />
    </div>
  );
};

export default App;
