/**
 * @file Definiciones de tipos TypeScript para Ludorganizador
 * @module types
 */

/**
 * Usuario base del sistema
 */
export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  role?: 'nuevo' | 'user' | 'admin';
  badges?: string[];
  approved?: boolean; // Si fue aprobado por un admin (solo para rol 'nuevo')
}

/**
 * Usuario autenticado con token JWT
 */
export interface AuthUser extends User {
  token: string;
}

/**
 * Evento de juegos de mesa
 */
export interface GameEvent {
  id: string;
  title: string;
  location: string;
  date: string; // ISO String
  description: string;
  password?: string; // Contraseña para eventos privados
  creatorId?: string; // ID del creador del evento
  creatorName?: string; // Nombre del creador
  creatorBadges?: string[]; // Badges del creador
  creatorRole?: 'nuevo' | 'user' | 'admin'; // Rol del creador
  showMap?: boolean; // Mostrar mapa embebido
}

/**
 * Mesa de juego dentro de un evento
 */
export interface GameTable {
  id: string;
  eventId: string;
  hostName: string;
  hostId: string;
  hostBadges?: string[]; // Badges del host
  hostRole?: 'nuevo' | 'user' | 'admin'; // Rol del host
  gameName: string;
  description: string;
  imageUrl?: string;
  minPlayers: number;
  maxPlayers: number;
  registeredPlayers: { id: string; name: string }[];
}

/**
 * Lista de juegos libres disponibles para préstamo (agrupados por usuario)
 */
export interface FreeGame {
  id: string;
  eventId: string;
  ownerName: string;
  ownerId: string;
  ownerBadges?: string[];
  ownerRole?: 'nuevo' | 'user' | 'admin';
  games: {
    name: string;
    note?: string;
  }[];
}

/**
 * Datos para crear un nuevo evento
 */
export interface CreateEventData {
  title: string;
  location: string;
  date: string;
  description: string;
  password?: string;
  showMap?: boolean;
}

/**
 * Datos para crear una nueva mesa
 */
export interface CreateTableData {
  eventId: string;
  gameName: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
}

/**
 * Datos para crear una lista de juegos libres
 */
export interface CreateFreeGameData {
  eventId: string;
  games: {
    name: string;
    note?: string;
  }[];
}

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Datos de registro
 */
export interface RegisterData {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}
