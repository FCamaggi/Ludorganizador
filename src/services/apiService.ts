/**
 * @file Servicio de API para comunicación con el backend
 * @module services/apiService
 */

import { API_CONFIG, API_ROUTES, STORAGE_KEYS } from '../constants';
import {
  GameEvent,
  GameTable,
  FreeGame,
  AuthUser,
  CreateEventData,
  CreateTableData,
  CreateFreeGameData,
} from '../types';

/**
 * Clase para manejar errores de API
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Helper para obtener el token de autenticación
 */
const getToken = (): string | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  if (userData) {
    const { token } = JSON.parse(userData);
    return token;
  }
  return null;
};

/**
 * Helper para crear headers con autenticación
 */
const authHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Helper para manejar respuestas de la API
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Error desconocido' }));
    throw new ApiError(
      error.error || 'Error en la solicitud',
      response.status,
      error
    );
  }
  return response.json();
};

// ============ AUTH ============

/**
 * Registra un nuevo usuario
 */
export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthUser> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.AUTH.REGISTER}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    }
  );

  const data = await handleResponse<{ user: any; token: string }>(response);
  const authUser: AuthUser = { ...data.user, token: data.token };
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));
  return authUser;
};

/**
 * Inicia sesión con email y contraseña
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.AUTH.LOGIN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await handleResponse<{ user: any; token: string }>(response);
  const authUser: AuthUser = { ...data.user, token: data.token };
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser));
  return authUser;
};

/**
 * Obtiene el usuario actualmente autenticado
 */
export const getCurrentUser = (): AuthUser | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Cierra la sesión del usuario
 */
export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
};

// ============ EVENTS ============

/**
 * Carga todos los eventos
 */
export const loadEvents = async (): Promise<GameEvent[]> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.EVENTS.BASE}`,
    {
      headers: authHeaders(),
    }
  );
  return handleResponse<GameEvent[]>(response);
};

/**
 * Crea un nuevo evento
 */
export const saveEvent = async (
  eventData: CreateEventData
): Promise<GameEvent> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.EVENTS.BASE}`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(eventData),
    }
  );
  return handleResponse<GameEvent>(response);
};

/**
 * Elimina un evento
 */
export const deleteEvent = async (eventId: string): Promise<void> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.EVENTS.BY_ID(eventId)}`,
    {
      method: 'DELETE',
      headers: authHeaders(),
    }
  );
  await handleResponse<void>(response);
};

/**
 * Archiva o desarchiva un evento
 */
export const archiveEvent = async (
  eventId: string
): Promise<{ archived: boolean }> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/events/${eventId}/archive`,
    {
      method: 'PATCH',
      headers: authHeaders(),
    }
  );
  return handleResponse<{ archived: boolean; message: string }>(response);
};

/**
 * Verifica la contraseña de un evento privado
 */
export const verifyEventPassword = async (
  eventId: string,
  password: string
): Promise<boolean> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.EVENTS.VERIFY_PASSWORD(eventId)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    }
  );

  const data = await handleResponse<{ success: boolean }>(response);
  return data.success;
};

// ============ TABLES ============

/**
 * Carga todas las mesas de un evento
 */
export const loadTables = async (eventId: string): Promise<GameTable[]> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.TABLES.BY_EVENT(eventId)}`,
    {
      headers: authHeaders(),
    }
  );
  return handleResponse<GameTable[]>(response);
};

/**
 * Crea una nueva mesa
 */
export const saveTable = async (
  tableData: CreateTableData
): Promise<GameTable> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.TABLES.BASE}`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(tableData),
    }
  );
  return handleResponse<GameTable>(response);
};

/**
 * Une al usuario actual a una mesa
 */
export const joinTable = async (tableId: string): Promise<GameTable> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.TABLES.JOIN(tableId)}`,
    {
      method: 'POST',
      headers: authHeaders(),
    }
  );
  return handleResponse<GameTable>(response);
};

/**
 * Retira al usuario actual de una mesa
 */
export const leaveTable = async (tableId: string): Promise<GameTable> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.TABLES.LEAVE(tableId)}`,
    {
      method: 'POST',
      headers: authHeaders(),
    }
  );
  return handleResponse<GameTable>(response);
};

/**
 * Elimina una mesa
 */
export const deleteTable = async (tableId: string): Promise<void> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.TABLES.BY_ID(tableId)}`,
    {
      method: 'DELETE',
      headers: authHeaders(),
    }
  );
  await handleResponse<void>(response);
};

// ============ FREE GAMES ============

/**
 * Carga todos los juegos libres de un evento
 */
export const loadFreeGames = async (eventId: string): Promise<FreeGame[]> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.GAMES.BY_EVENT(eventId)}`,
    {
      headers: authHeaders(),
    }
  );
  return handleResponse<FreeGame[]>(response);
};

/**
 * Crea un nuevo juego libre
 */
export const saveFreeGame = async (
  gameData: CreateFreeGameData
): Promise<FreeGame> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.GAMES.BASE}`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(gameData),
    }
  );
  return handleResponse<FreeGame>(response);
};

/**
 * Elimina un juego libre
 */
export const deleteFreeGame = async (gameId: string): Promise<void> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.GAMES.BY_ID(gameId)}`,
    {
      method: 'DELETE',
      headers: authHeaders(),
    }
  );
  await handleResponse<void>(response);
};

/**
 * Elimina un juego individual de una lista
 */
export const deleteIndividualGame = async (
  gameListId: string,
  gameIndex: number
): Promise<{ deleted: boolean; gameList?: FreeGame }> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/games/${gameListId}/game/${gameIndex}`,
    {
      method: 'DELETE',
      headers: authHeaders(),
    }
  );
  return handleResponse<{ deleted: boolean; gameList?: FreeGame }>(response);
};

/**
 * Actualiza una lista de juegos libres
 */
export const updateFreeGame = async (
  gameId: string,
  games: { name: string; note?: string }[]
): Promise<FreeGame> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ROUTES.GAMES.BY_ID(gameId)}`,
    {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ games }),
    }
  );
  return handleResponse<FreeGame>(response);
};

// ============ ADMIN ============

/**
 * Obtiene usuarios pendientes de aprobación
 */
export const getPendingUsers = async (): Promise<any[]> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/admin/pending-users`,
    {
      headers: authHeaders(),
    }
  );
  return handleResponse<any[]>(response);
};

/**
 * Aprueba un usuario (cambia rol de 'nuevo' a 'user')
 */
export const approveUser = async (userId: string): Promise<void> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/admin/users/${userId}/approve`,
    {
      method: 'PATCH',
      headers: authHeaders(),
    }
  );
  await handleResponse<void>(response);
};

