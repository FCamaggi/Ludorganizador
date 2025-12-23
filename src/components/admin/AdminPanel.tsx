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
  TrendingUp,
  TrendingDown,
  X,
  Bell,
  Archive,
  UserPlus,
  Edit3,
} from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { API_CONFIG, STORAGE_KEYS } from '../../constants';

interface AdminPanelProps {
  onClose: () => void;
  onEventChange: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onUserUpdate?: () => void;
}

interface Stats {
  users: number;
  events: number;
  archivedEvents: number;
  pendingUsers: number;
}

interface ArchivedEvent {
  _id: string;
  title: string;
  date: string;
  archivedAt: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  onEventChange,
  showToast,
  onUserUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'users' | 'events' | 'archived' | 'stats' | 'pending'
  >('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [archivedEvents, setArchivedEvents] = useState<ArchivedEvent[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [userBeingEdited, setUserBeingEdited] = useState<string | null>(null);
  const [editingBadges, setEditingBadges] = useState<{
    [key: string]: string[];
  }>({});
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
    if (activeTab === 'pending') loadPendingUsers();
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
        showToast(
          `Error: ${error.error || 'No se pudieron cargar los usuarios'}`,
          'error'
        );
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
        showToast(
          `Error: ${error.error || 'No se pudieron cargar los eventos'}`,
          'error'
        );
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

  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/admin/pending-users`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const mappedUsers = data.map((user: any) => ({
          ...user,
          id: user._id,
        }));
        setPendingUsers(mappedUsers);
      } else {
        const error = await res.json();
        console.error('Error al cargar usuarios pendientes:', error);
        showToast(
          `Error: ${
            error.error || 'No se pudieron cargar los usuarios pendientes'
          }`,
          'error'
        );
      }
    } catch (error) {
      console.error('Error loading pending users:', error);
      showToast('Error de conexión al cargar usuarios pendientes', 'error');
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
    // Ciclo: nuevo -> user -> admin -> user -> admin...
    let newRole: string;
    if (currentRole === 'nuevo') {
      newRole = 'user';
    } else if (currentRole === 'user') {
      newRole = 'admin';
    } else {
      newRole = 'user';
    }

    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/admin/users/${userId}/role`,
        {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );

        let message = '';
        if (newRole === 'admin') {
          message = 'Usuario promovido a administrador';
        } else if (newRole === 'user') {
          message =
            currentRole === 'admin'
              ? 'Usuario removido de administrador'
              : 'Usuario aprobado';
        } else if (newRole === 'nuevo') {
          message = 'Usuario marcado como pendiente';
        }

        showToast(message, 'success');

        // Si se cambió el rol del usuario actual, refrescar
        if (userId === currentUserId && onUserUpdate) {
          onUserUpdate();
        }
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
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/admin/users/${userId}/badges`,
        {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify({ badges }),
        }
      );

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

  const handleApproveUser = async (userId: string) => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/admin/users/${userId}/approve`,
        {
          method: 'PATCH',
          headers: authHeaders(),
        }
      );

      if (res.ok) {
        setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
        loadStats();
        showToast('Usuario aprobado correctamente', 'success');

        // Si se aprobó al usuario actual, refrescar
        if (userId === currentUserId && onUserUpdate) {
          onUserUpdate();
        }
      } else {
        const error = await res.json();
        showToast(error.error || 'Error al aprobar usuario', 'error');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      showToast('Error de conexión al aprobar usuario', 'error');
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
    {
      value: 'veterano',
      label: 'Veterano',
      color: 'bg-purple-100 text-purple-800',
    },
    { value: 'vip', label: 'VIP', color: 'bg-yellow-100 text-yellow-800' },
    {
      value: 'organizador',
      label: 'Organizador',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      value: 'fundador',
      label: 'Fundador',
      color: 'bg-green-100 text-green-800',
    },
  ];

  // Generar datos de actividad reciente simulados
  const getRecentActivity = () => {
    const activities = [];
    
    if (users.length > 0) {
      const recentUser = users[users.length - 1];
      activities.push({
        type: 'user',
        icon: <UserPlus size={20} />,
        text: `Nuevo Usuario Registrado: ${recentUser.name}`,
        time: '13 minutes ago',
        color: 'bg-blue-100 text-blue-600',
      });
    }
    
    if (archivedEvents.length > 0) {
      const recentArchived = archivedEvents[0];
      activities.push({
        type: 'archive',
        icon: <Archive size={20} />,
        text: `Evento Archivado: ${recentArchived.title}`,
        time: '21 minutes ago',
        color: 'bg-orange-100 text-orange-600',
      });
    }
    
    if (userBeingEdited) {
      const editedUser = users.find(u => u.id === userBeingEdited);
      if (editedUser) {
        activities.push({
          type: 'badge',
          icon: <Edit3 size={20} />,
          text: `Badge Editado: ${editedUser.name}`,
          time: '31 minutes ago',
          color: 'bg-yellow-100 text-yellow-600',
        });
      }
    }
    
    return activities;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full h-[90vh] flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'stats'
                  ? 'bg-[#EC7D10] text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <TableIcon size={20} />
              <span className="font-medium">Estadísticas</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'users'
                  ? 'bg-[#EC7D10] text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Users size={20} />
              <span className="font-medium">Gestionar Usuarios</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'events'
                  ? 'bg-[#EC7D10] text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Calendar size={20} />
              <span className="font-medium">Gestionar Eventos</span>
            </button>

            <button
              onClick={() => setActiveTab('archived')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'archived'
                  ? 'bg-[#EC7D10] text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Archive size={20} />
              <span className="font-medium">Eventos Archivados</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell size={24} />
                {stats && (stats.pendingUsers > 0 || stats.archivedEvents > 0) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {stats.pendingUsers + (stats.archivedEvents > 0 ? 1 : 0)}
                  </span>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {/* Stats Tab */}
            {activeTab === 'stats' && stats && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Usuarios Registrados */}
                  <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Usuarios Registrados
                        </p>
                        <p className="text-4xl font-bold text-gray-900">
                          {stats.users.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Users className="text-blue-600" size={24} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <TrendingUp size={16} />
                        +15%
                      </span>
                      <span className="text-gray-500">vs. último mes</span>
                    </div>
                    {/* Mini Chart */}
                    <div className="mt-4 h-16">
                      <svg className="w-full h-full" viewBox="0 0 200 50">
                        <path
                          d="M 0 40 Q 50 35 100 30 T 200 20"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                        />
                        <path
                          d="M 0 40 Q 50 35 100 30 T 200 20 L 200 50 L 0 50 Z"
                          fill="#DBEAFE"
                          opacity="0.3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Eventos Activos */}
                  <div className="bg-white rounded-xl border border-green-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Eventos Activos
                        </p>
                        <p className="text-4xl font-bold text-gray-900">
                          {stats.events}
                        </p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Calendar className="text-green-600" size={24} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <TrendingUp size={16} />
                        +8%
                      </span>
                      <span className="text-gray-500">vs. último mes</span>
                    </div>
                    {/* Mini Chart */}
                    <div className="mt-4 h-16">
                      <svg className="w-full h-full" viewBox="0 0 200 50">
                        <path
                          d="M 0 45 Q 50 40 100 35 T 200 25"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2"
                        />
                        <path
                          d="M 0 45 Q 50 40 100 35 T 200 25 L 200 50 L 0 50 Z"
                          fill="#D1FAE5"
                          opacity="0.3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Eventos Archivados */}
                  <div className="bg-white rounded-xl border border-orange-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Eventos Archivados
                        </p>
                        <p className="text-4xl font-bold text-gray-900">
                          {stats.archivedEvents}
                        </p>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Archive className="text-orange-600" size={24} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <TrendingUp size={16} />
                        +2%
                      </span>
                      <span className="text-gray-500">vs. último mes</span>
                    </div>
                    {/* Mini Chart */}
                    <div className="mt-4 h-16">
                      <svg className="w-full h-full" viewBox="0 0 200 50">
                        <path
                          d="M 0 42 Q 50 41 100 39 T 200 36"
                          fill="none"
                          stroke="#F97316"
                          strokeWidth="2"
                        />
                        <path
                          d="M 0 42 Q 50 41 100 39 T 200 36 L 200 50 L 0 50 Z"
                          fill="#FFEDD5"
                          opacity="0.3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Actividad Reciente
                  </h3>
                  <div className="space-y-4">
                    {getRecentActivity().map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${activity.color}`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.text}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                    {getRecentActivity().length === 0 && (
                      <p className="text-center text-gray-400 py-8">
                        No hay actividad reciente
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Gestión de Usuarios
                  </h3>
                  {loading ? (
                    <p className="text-center text-gray-500 py-8">Cargando...</p>
                  ) : users.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No hay usuarios</p>
                  ) : (
                    <div className="space-y-3">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                {user.role === 'admin' && (
                                  <span className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                    <Shield size={12} />
                                    Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{user.email}</p>

                              {/* Badges Display */}
                              {user.badges && user.badges.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {user.badges.map((badge: string) => {
                                    const badgeConfig = badgeOptions.find(
                                      (b) => b.value === badge
                                    );
                                    return (
                                      <span
                                        key={badge}
                                        className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                                          badgeConfig?.color ||
                                          'bg-gray-100 text-gray-800'
                                        }`}
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
                                <div className="mt-3 p-3 bg-white rounded border border-gray-300">
                                  <p className="text-xs font-semibold text-gray-700 mb-2">
                                    Asignar badges:
                                  </p>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {badgeOptions.map((badge) => {
                                      const isSelected = (
                                        editingBadges[user.id] ||
                                        user.badges ||
                                        []
                                      ).includes(badge.value);
                                      return (
                                        <button
                                          key={badge.value}
                                          onClick={() =>
                                            toggleBadge(user.id, badge.value)
                                          }
                                          className={`text-xs px-3 py-1.5 rounded transition-all ${
                                            isSelected
                                              ? badge.color + ' ring-2 ring-offset-1'
                                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                          }`}
                                        >
                                          {badge.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() =>
                                        handleUpdateBadges(
                                          user.id,
                                          editingBadges[user.id] || user.badges || []
                                        )
                                      }
                                      className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                      Guardar
                                    </button>
                                    <button
                                      onClick={() => {
                                        setUserBeingEdited(null);
                                        setEditingBadges({});
                                      }}
                                      className="text-sm bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {user.id !== currentUserId && (
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleToggleRole(user.id, user.role)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    user.role === 'admin'
                                      ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                                  title={
                                    user.role === 'admin'
                                      ? 'Remover como Admin'
                                      : 'Hacer Admin'
                                  }
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
                                  className="p-2 bg-yellow-100 text-yellow-600 hover:bg-yellow-200 rounded-lg transition-colors"
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
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar usuario"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Eventos Activos
                  </h3>
                  {loading ? (
                    <p className="text-center text-gray-500 py-8">Cargando...</p>
                  ) : events.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No hay eventos activos</p>
                  ) : (
                    <div className="space-y-3">
                      {events.map((event) => (
                        <div
                          key={event._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                            <p className="text-xs text-gray-500 mt-1">
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
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar evento"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Archived Events Tab */}
            {activeTab === 'archived' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Eventos Archivados
                  </h3>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                  ) : archivedEvents.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No hay eventos archivados
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {archivedEvents.map((event) => (
                        <div
                          key={event._id}
                          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Fecha evento:{' '}
                              {new Date(event.date).toLocaleDateString('es-CL')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Archivado:{' '}
                              {new Date(event.archivedAt).toLocaleDateString('es-CL')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleRestoreEvent(event._id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar permanentemente"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

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
                <p className="text-sm text-red-900 font-medium">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <p className="text-gray-700">
                ¿Estás seguro de que deseas eliminar{' '}
                <span className="font-semibold">
                  {deleteModal.type === 'user' ? 'al usuario' : 'el evento'}
                </span>{' '}
                <span className="font-semibold text-gray-900">
                  "{deleteModal.name}"
                </span>
                ?
              </p>
              {deleteModal.type === 'event' && (
                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                  Esto también eliminará todas las mesas y juegos libres asociados.
                </p>
              )}
              <div className="flex justify-end gap-3 pt-4">
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
    </div>
  );
};

export default AdminPanel;
