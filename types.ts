export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface GameEvent {
  id: string;
  title: string;
  location: string;
  date: string; // ISO String
  description: string;
  password?: string; // Optional password for private events
}

export interface GameTable {
  id: string;
  eventId: string;
  hostName: string;
  hostId: string;
  gameName: string;
  description: string;
  imageUrl?: string;
  minPlayers: number;
  maxPlayers: number;
  registeredPlayers: { id: string; name: string }[]; // Includes host usually? Depending on logic. Let's assume host plays.
}

export interface FreeGame {
  id: string;
  eventId: string;
  ownerName: string;
  ownerId: string;
  gameName: string;
  note?: string;
}
