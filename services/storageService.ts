import { GameEvent, GameTable, FreeGame, User } from "../types";

// Keys
const USERS_KEY = 'ludis_users'; // Store current user session
const EVENTS_KEY = 'ludis_events';
const TABLES_KEY = 'ludis_tables';
const FREE_GAMES_KEY = 'ludis_free_games';

// Mock Initial Data
const INITIAL_EVENTS: GameEvent[] = [
  {
    id: 'evt-1',
    title: 'Noche de Juegos en el Centro',
    location: 'Cafetería "El Dado"',
    date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    description: 'Nuestra reunión mensual. Traed vuestros mejores juegos.'
  }
];

export const loadEvents = (): GameEvent[] => {
  const data = localStorage.getItem(EVENTS_KEY);
  if (!data) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  return JSON.parse(data);
};

export const saveEvent = (event: GameEvent) => {
  const events = loadEvents();
  const newEvents = [...events, event];
  localStorage.setItem(EVENTS_KEY, JSON.stringify(newEvents));
  return newEvents;
};

export const loadTables = (eventId: string): GameTable[] => {
  const allTables = JSON.parse(localStorage.getItem(TABLES_KEY) || '[]');
  return allTables.filter((t: GameTable) => t.eventId === eventId);
};

export const saveTable = (table: GameTable) => {
  const allTables = JSON.parse(localStorage.getItem(TABLES_KEY) || '[]');
  allTables.push(table);
  localStorage.setItem(TABLES_KEY, JSON.stringify(allTables));
};

export const updateTable = (updatedTable: GameTable) => {
  const allTables = JSON.parse(localStorage.getItem(TABLES_KEY) || '[]');
  const index = allTables.findIndex((t: GameTable) => t.id === updatedTable.id);
  if (index !== -1) {
    allTables[index] = updatedTable;
    localStorage.setItem(TABLES_KEY, JSON.stringify(allTables));
  }
};

export const loadFreeGames = (eventId: string): FreeGame[] => {
  const allGames = JSON.parse(localStorage.getItem(FREE_GAMES_KEY) || '[]');
  return allGames.filter((g: FreeGame) => g.eventId === eventId);
};

export const saveFreeGame = (game: FreeGame) => {
  const allGames = JSON.parse(localStorage.getItem(FREE_GAMES_KEY) || '[]');
  allGames.push(game);
  localStorage.setItem(FREE_GAMES_KEY, JSON.stringify(allGames));
};

export const getSessionUser = (): User | null => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : null;
};

export const setSessionUser = (user: User) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(user));
};
