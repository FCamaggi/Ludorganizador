import React, { useState, useEffect } from 'react';
import { Dice6, UserIcon as User, LogOut, Shield } from 'lucide-react';
import { AuthUser, GameEvent, GameTable, FreeGame } from './types';
import { useAuth } from './hooks/useAuth';
import { useEvents } from './hooks/useEvents';
import { useTables } from './hooks/useTables';
import { useFreeGames } from './hooks/useFreeGames';
import AuthForm from './components/auth/AuthForm';
import AdminPanel from './components/admin/AdminPanel';
import Modal from './components/ui/Modal';
import Toast from './components/ui/Toast';
import ConfirmDialog from './components/ui/ConfirmDialog';
import { EventsView, EventDetailView } from './components/views';
import {
  EventForm,
  TableForm,
  FreeGameForm,
  PasswordVerificationForm,
} from './components/forms';
import * as api from './services/apiService';
import { API_CONFIG } from './constants';

type View = 'events' | 'detail';
type Tab = 'tables' | 'free';

const App: React.FC = () => {
  // Authentication
  const { user, logout } = useAuth();

  // View State
  const [view, setView] = useState<View>('events');
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('tables');
  const [archivedEventsCount, setArchivedEventsCount] = useState(0);

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
    loadFreeGames,
  } = useFreeGames(activeEventId);

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
      // Si es admin, cargar count de eventos archivados
      if (user.role === 'admin') {
        loadArchivedEventsCount();
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
        setArchivedEventsCount(data.archivedEvents || 0);
      }
    } catch (error) {
      console.error('Error loading archived events count:', error);
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
    const isOwner = table.ownerId === user?.id;
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
    const isContributor = game.contributorId === user?.id;
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Juego Libre',
      message: `¿Estás seguro de que deseas eliminar el juego "${game.gameName}"?`,
      additionalInfo: isAdmin
        ? 'Esta acción no se puede deshacer.'
        : isContributor
        ? 'Como quien añadió este juego, puedes eliminarlo en cualquier momento.'
        : undefined,
      onConfirm: async () => {
        try {
          await deleteFreeGame(game.id);
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
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleBackToEvents}
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
              <User size={16} />
              <span className="font-medium">{user.name}</span>
            </div>
            {user.role === 'admin' && (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="text-gray-400 hover:text-indigo-600 transition-colors relative"
                title="Panel de Administración"
              >
                <Shield size={20} />
                {archivedEventsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    !
                  </span>
                )}
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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {view === 'events' && (
          <EventsView
            events={events}
            onEventClick={handleEventClick}
            onCreateEvent={() => setIsEventModalOpen(true)}
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
            onCreateTable={() => setIsTableModalOpen(true)}
            onJoinTable={handleJoinTable}
            onLeaveTable={handleLeaveTable}
            onDeleteTable={handleDeleteTable}
            onAddFreeGame={() => setIsFreeGameModalOpen(true)}
            onDeleteFreeGame={handleDeleteFreeGame}
            onDeleteEvent={handleDeleteEvent}
            onArchiveEvent={handleArchiveEvent}
            isLoading={tablesLoading || gamesLoading}
          />
        )}
      </main>

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
            }}
            showToast={showToast}
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
    </div>
  );
};

export default App;
