import { User, GameEvent, GameTable, FreeGame, AuthUser } from '../types';
import React, { useEffect, useState } from 'react';
import {
  Trash2,
  Users,
  Calendar,
  Table as TableIcon,
  Gamepad2,
  AlertTriangle,
} from 'lucide-react';
import Button from './Button';
import Modal from './Modal';

interface AdminPanelProps {
  currentUser: AuthUser;
  onClose: () => void;
}

interface Stats {
  users: number;
  events: number;
  tables: number;
  freeGames: number;
}

const API_URL =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api';

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onClose }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'events' | 'stats'>(
    'stats'
  );
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    type: string;
    id: string;
    name: string;
  } | null>(null);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${currentUser.token}`,
  });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'events') loadEvents();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
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
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        // Mapear _id a id para compatibilidad con el frontend
        const mappedUsers = data.map((user: any) => ({
          ...user,
          id: user._id,
        }));
        setUsers(mappedUsers);
      } else {
        const error = await res.json();
        console.error('Error al cargar usuarios:', error);
        alert(`Error: ${error.error || 'No se pudieron cargar los usuarios'}`);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error de conexión al cargar usuarios');
    }
    setLoading(false);
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/events`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        const error = await res.json();
        console.error('Error al cargar eventos:', error);
        alert(`Error: ${error.error || 'No se pudieron cargar los eventos'}`);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Error de conexión al cargar eventos');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    try {
      const endpoint = deleteModal.type === 'user' ? 'users' : 'events';
      const res = await fetch(
        `${API_URL}/admin/${endpoint}/${deleteModal.id}`,
        {
          method: 'DELETE',
          headers: authHeaders(),
        }
      );

      if (res.ok) {
        if (deleteModal.type === 'user') {
          // Actualización inmediata del estado local
          setUsers((prev) => prev.filter((u) => u.id !== deleteModal.id));
        } else {
          // Actualización inmediata del estado local
          setEvents((prev) => prev.filter((e) => e._id !== deleteModal.id));
        }
        loadStats();
        setDeleteModal(null);
      } else {
        const error = await res.json();
        alert(error.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error al eliminar');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Panel de Administración">
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
                <h3 className="font-semibold text-gray-700">Eventos</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {stats.events}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TableIcon className="text-purple-600" size={24} />
                <h3 className="font-semibold text-gray-700">Mesas</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {stats.tables}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 className="text-orange-600" size={24} />
                <h3 className="font-semibold text-gray-700">Juegos Libres</h3>
              </div>
              <p className="text-3xl font-bold text-orange-600">
                {stats.freeGames}
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
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  {user.id !== currentUser.id && (
                    <button
                      onClick={() =>
                        setDeleteModal({
                          type: 'user',
                          id: user.id,
                          name: user.name,
                        })
                      }
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
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
    </Modal>
  );
};

export default AdminPanel;
