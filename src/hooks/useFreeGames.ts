/**
 * @file Hook para manejar juegos libres
 * @module hooks/useFreeGames
 */

import { useState, useEffect, useCallback } from 'react';
import { FreeGame, CreateFreeGameData } from '../types';
import * as api from '../services/apiService';

/**
 * Hook para manejar el estado y operaciones de juegos libres
 */
export const useFreeGames = (eventId: string | null) => {
  const [freeGames, setFreeGames] = useState<FreeGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFreeGames = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);
    try {
      const gamesData = await api.loadFreeGames(eventId);
      setFreeGames(gamesData);
    } catch (err: any) {
      setError(err.message || 'Error cargando juegos');
      console.error('Error loading free games:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadFreeGames();
  }, [loadFreeGames]);

  const createFreeGame = async (
    gameData: CreateFreeGameData
  ): Promise<FreeGame> => {
    const newGame = await api.saveFreeGame(gameData);
    await loadFreeGames();
    return newGame;
  };

  const deleteFreeGame = async (gameId: string): Promise<void> => {
    await api.deleteFreeGame(gameId);
    await loadFreeGames();
  };

  return {
    freeGames,
    loading,
    error,
    loadFreeGames,
    createFreeGame,
    deleteFreeGame,
  };
};
