import { GameEvent, GameTable, FreeGame, AuthUser } from '../types';

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api';

// Helper para obtener el token
const getToken = (): string | null => {
  const userData = localStorage.getItem('ludis_auth_user');
  if (userData) {
    const { token } = JSON.parse(userData);
    return token;
  }
  return null;
};

// Helper para headers con autenticación
const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// ============ AUTH ============

export const register = async (name: string, email: string, password: string): Promise<AuthUser> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al registrar');
  }

  const data = await res.json();
  const authUser: AuthUser = { ...data.user, token: data.token };
  localStorage.setItem('ludis_auth_user', JSON.stringify(authUser));
  return authUser;
};

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al iniciar sesión');
  }

  const data = await res.json();
  const authUser: AuthUser = { ...data.user, token: data.token };
  localStorage.setItem('ludis_auth_user', JSON.stringify(authUser));
  return authUser;
};

export const getCurrentUser = (): AuthUser | null => {
  const userData = localStorage.getItem('ludis_auth_user');
  return userData ? JSON.parse(userData) : null;
};

export const logout = () => {
  localStorage.removeItem('ludis_auth_user');
};

// ============ EVENTS ============

export const loadEvents = async (): Promise<GameEvent[]> => {
  const res = await fetch(`${API_URL}/events`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error('Error al cargar eventos');
  return res.json();
};

export const saveEvent = async (event: Omit<GameEvent, 'id'>): Promise<GameEvent> => {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(event)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear evento');
  }

  return res.json();
};

export const verifyEventPassword = async (eventId: string, password: string): Promise<GameEvent> => {
  const res = await fetch(`${API_URL}/events/${eventId}/verify-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Contraseña incorrecta');
  }

  const data = await res.json();
  return data.event;
};

// ============ TABLES ============

export const loadTables = async (eventId: string): Promise<GameTable[]> => {
  const res = await fetch(`${API_URL}/tables/event/${eventId}`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error('Error al cargar mesas');
  return res.json();
};

export const saveTable = async (table: Omit<GameTable, 'id' | 'hostId' | 'hostName' | 'registeredPlayers'>): Promise<GameTable> => {
  const res = await fetch(`${API_URL}/tables`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(table)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear mesa');
  }

  return res.json();
};

export const joinTable = async (tableId: string): Promise<GameTable> => {
  const res = await fetch(`${API_URL}/tables/${tableId}/join`, {
    method: 'POST',
    headers: authHeaders()
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al unirse a la mesa');
  }

  return res.json();
};

export const leaveTable = async (tableId: string): Promise<GameTable> => {
  const res = await fetch(`${API_URL}/tables/${tableId}/leave`, {
    method: 'POST',
    headers: authHeaders()
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al salir de la mesa');
  }

  return res.json();
};

// ============ FREE GAMES ============

export const loadFreeGames = async (eventId: string): Promise<FreeGame[]> => {
  const res = await fetch(`${API_URL}/games/event/${eventId}`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error('Error al cargar juegos');
  return res.json();
};

export const saveFreeGame = async (game: Omit<FreeGame, 'id' | 'ownerId' | 'ownerName'>): Promise<FreeGame> => {
  const res = await fetch(`${API_URL}/games`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(game)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al agregar juego');
  }

  return res.json();
};
