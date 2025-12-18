import { User, AuthUser } from '../../types';
import React, { useEffect, useState } from 'react';
import {
  Trash2,
  Users,
  Calendar,
  Table as TableIcon,
  Gamepad2,
  AlertTriangle,
  RotateCcw,
  Shield,
  Award,
  ChevronDown,
} from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { API_CONFIG, STORAGE_KEYS } from '../../constants';

interface AdminPanelProps {
  onClose: () => void;
  onEventChange: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface Stats {
  users: number;
  events: number;
  archivedEvents: number;
}

interface ArchivedEvent {
  _id: string;
  title: string;
  date: string;
  archivedAt: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onEventChange, showToast }) => {
  const [activeTab, setActiveTab] = useState<
    'users' | 'events' | 'archived' | 'stats'
  >('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [archivedEvents, setArchivedEvents] = useState<ArchivedEvent[]>([]);
  const [userBeingEdited, setUserBeingEdited] = useState<string | null>(null);
  const [editingBadges, setEditingBadges] = useState<{[key: string]: string[]}>({});
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    type: string;
    id: string;
    name: string;
  } | null>(null);

  const authHeaders = () => {
    const authUserStr = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!authUserStr) return { 'Content-Type': 'application/json' };

    const authUser: AuthUser = JSON.parse(authUserStr);
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authUser.token}`,
    };
  };

  const currentUserId = (() => {
    const authUserStr = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!authUserStr) return null;
    const authUser: AuthUser = JSON.parse(authUserStr);
    return authUser.id;
  })();

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'events') loadEvents();
    if (activeTab === 'archived') loadArchivedEvents();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/stats`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/users`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const mappedUsers = data.map((user: any) => ({
          ...user,
          id: user._id,
        }));
        setUsers(mappedUsers);
      } else {
        const error = await res.json();
        console.error('Error al cargar usuarios:', error);
        showToast(`Error: ${error.error || 'No se pudieron cargar los usuarios'}`, 'error');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Error de conexión al cargar usuarios', 'error');
    }
    setLoading(false);
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/events`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        const error = await res.json();
        console.error('Error al cargar eventos:', error);
        showToast(`Error: ${error.error || 'No se pudieron cargar los eventos'}`, 'error');
      }
    } catch (error) {
      console.error('Error loading events:', error);
      showToast('Error de conexión al cargar eventos', 'error');
    }
    setLoading(false);
  };

  const loadArchivedEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/archived-events`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setArchivedEvents(data);
      } else {
        const error = await res.json();
        console.error('Error al cargar eventos archivados:', error);
        showToast(
          `Error: ${
            error.error || 'No se pudieron cargar los eventos archivados'
          }`,
          'error'
        );
      }
    } catch (error) {
      console.error('Error loading archived events:', error);
      showToast('Error de conexión al cargar eventos archivados', 'error');
    }
    setLoading(false);
  };

  const handleRestoreEvent = async (eventId: string) => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/events/${eventId}/archive`,
        {
          method: 'PATCH',
          headers: authHeaders(),
        }
      );

      if (res.ok) {
        setArchivedEvents((prev) => prev.filter((e) => e._id !== eventId));
        loadStats();
        onEventChange();
        showToast('Evento restaurado correctamente', 'success');
      } else {
        const error = await res.json();
        showToast(error.error || 'Error al restaurar evento', 'error');
      }
    } catch (error) {
      console.error('Error restoring event:', error);
      showToast('Error de conexión al restaurar evento', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      const endpoint = deleteModal.type === 'user' ? 'users' : 'events';
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/admin/${endpoint}/${deleteModal.id}`,
        {
          method: 'DELETE',
          headers: authHeaders(),
        }
      );

      if (res.ok) {
        if (deleteModal.type === 'user') {
          setUsers((prev) => prev.filter((u) => u.id !== deleteModal.id));
          showToast('Usuario eliminado correctamente', 'success');
        } else if (deleteModal.type === 'archived-event') {
          setArchivedEvents((prev) =>
            prev.filter((e) => e._id !== deleteModal.id)
          );
          showToast('Evento archivado eliminado permanentemente', 'success');
        } else {
          setEvents((prev) => prev.filter((e) => e._id !== deleteModal.id));
          onEventChange();
          showToast('Evento eliminado correctamente', 'success');
        }
        loadStats();
        setDeleteModal(null);
      } else {
        const error = await res.json();
        showToast(error.error || 'Error al eliminar', 'error');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showToast('Error al eliminar', 'error');
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        showToast(`Usuario ${newRole === 'admin' ? 'promovido a' : 'removido de'} administrador`, 'success');
      } else {
        const error = await res.json();
        showToast(error.error || 'Error al cambiar rol', 'error');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      showToast('Error de conexión al cambiar rol', 'error');
    }
  };

  const handleUpdateBadges = async (userId: string, badges: string[]) => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/users/${userId}/badges`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ badges }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, badges } : u))
        );
        setUserBeingEdited(null);
        setEditingBadges({});
        showToast('Badges actualizados correctamente', 'success');
      } else {
        const error = await res.json();
        showToast(error.error || 'Error al actualizar badges', 'error');
      }
    } catch (error) {
      console.error('Error updating badges:', error);
      showToast('Error de conexión al actualizar badges', 'error');
    }
  };

  const toggleBadge = (userId: string, badge: string) => {
    const currentBadges = editingBadges[userId] || [];
    const newBadges = currentBadges.includes(badge)
      ? currentBadges.filter((b) => b !== badge)
      : [...currentBadges, badge];
    
    setEditingBadges({ ...editingBadges, [userId]: newBadges });
  };

  const badgeOptions = [
    { value: 'veterano', label: 'Veterano', color: 'bg-purple-100 text-purple-800' },
    { value: 'vip', label: 'VIP', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'organizador', label: 'Organizador', color: 'bg-blue-100 text-blue-800' },
    { value: 'fundador', label: 'Fundador', color: 'bg-green-100 text-green-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'stats'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Estadísticas
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'users'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'events'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Eventos
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'archived'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Archivados
          {stats && stats.archivedEvents > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-600" size={24} />
              <h3 className="font-semibold text-gray-700">Usuarios</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-green-600" size={24} />
              <h3 className="font-semibold text-gray-700">Eventos Activos</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.events}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-orange-600" size={24} />
              <h3 className="font-semibold text-gray-700">
                Eventos Archivados
              </h3>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {stats.archivedEvents}
            </p>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-2">
          {loading ? (
            <p className="text-center text-gray-500">Cargando...</p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500">No hay usuarios</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{user.name}</p>
                      {user.role === 'admin' && (
                        <span className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          <Shield size={12} />
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                    
                    {/* Badges Display */}
                    {user.badges && user.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {user.badges.map((badge: string) => {
                          const badgeConfig = badgeOptions.find(b => b.value === badge);
                          return (
                            <span
                              key={badge}
                              className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${badgeConfig?.color || 'bg-gray-100 text-gray-800'}`}
                            >
                              <Award size={12} />
                              {badgeConfig?.label || badge}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Edit Badges Mode */}
                    {userBeingEdited === user.id && (
                      <div className="mt-2 p-2 bg-white rounded border">
                        <p className="text-xs font-medium mb-2">Asignar badges:</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {badgeOptions.map((badge) => {
                            const isSelected = (editingBadges[user.id] || user.badges || []).includes(badge.value);
                            return (
                              <button
                                key={badge.value}
                                onClick={() => toggleBadge(user.id, badge.value)}
                                className={`text-xs px-2 py-1 rounded transition-all ${
                                  isSelected
                                    ? badge.color
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                              >
                                {badge.label}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateBadges(user.id, editingBadges[user.id] || user.badges || [])}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => {
                              setUserBeingEdited(null);
                              setEditingBadges({});
                            }}
                            className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {user.id !== currentUserId && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleRole(user.id, user.role)}
                        className={`p-2 rounded transition-colors ${
                          user.role === 'admin'
                            ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title={user.role === 'admin' ? 'Remover admin' : 'Hacer admin'}
                      >
                        <Shield size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (userBeingEdited === user.id) {
                            setUserBeingEdited(null);
                            setEditingBadges({});
                          } else {
                            setUserBeingEdited(user.id);
                            setEditingBadges({ [user.id]: user.badges || [] });
                          }
                        }}
                        className="p-2 bg-yellow-100 text-yellow-600 hover:bg-yellow-200 rounded transition-colors"
                        title="Editar badges"
                      >
                        <Award size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            type: 'user',
                            id: user.id,
                            name: user.name,
                          })
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-2">
          {loading ? (
            <p className="text-center text-gray-500">Cargando...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500">No hay eventos</p>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.location}</p>
                  <p className="text-xs text-gray-400">
                    Por: {event.creatorId?.name || 'Desconocido'}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setDeleteModal({
                      type: 'event',
                      id: event._id,
                      name: event.title,
                    })
                  }
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Archived Events Tab */}
      {activeTab === 'archived' && (
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : archivedEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay eventos archivados
            </p>
          ) : (
            archivedEvents.map((event) => (
              <div
                key={event._id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    Fecha evento:{' '}
                    {new Date(event.date).toLocaleDateString('es-CL')}
                  </p>
                  <p className="text-xs text-gray-400">
                    Archivado:{' '}
                    {new Date(event.archivedAt).toLocaleDateString('es-CL')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRestoreEvent(event._id)}
                    className="text-green-600 hover:text-green-800 transition-colors"
                    title="Restaurar evento"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteModal({
                        type: 'archived-event',
                        id: event._id,
                        name: event.title,
                      })
                    }
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar permanentemente"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteModal(null)}
          title="Confirmar Eliminación"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
              <p className="text-sm">Esta acción no se puede deshacer.</p>
            </div>
            <p className="text-gray-700">
              ¿Estás seguro de que deseas eliminar{' '}
              <span className="font-semibold">
                {deleteModal.type === 'user' ? 'al usuario' : 'el evento'}
              </span>{' '}
              <span className="font-semibold">"{deleteModal.name}"</span>?
            </p>
            {deleteModal.type === 'event' && (
              <p className="text-sm text-gray-600">
                Esto también eliminará todas las mesas y juegos libres
                asociados.
              </p>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDeleteModal(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminPanel;
