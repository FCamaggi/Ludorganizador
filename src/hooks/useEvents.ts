/**
 * @file Hook para manejar eventos
 * @module hooks/useEvents
 */

import { useState, useEffect, useCallback } from 'react';
import { GameEvent, CreateEventData } from '../types';
import * as api from '../services/apiService';

/**
 * Hook para manejar el estado y operaciones de eventos
 */
export const useEvents = (userId: string | null) => {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const eventsData = await api.loadEvents();
      setEvents(eventsData);
    } catch (err: any) {
      setError(err.message || 'Error cargando eventos');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const createEvent = async (
    eventData: CreateEventData
  ): Promise<GameEvent> => {
    const newEvent = await api.saveEvent(eventData);
    await loadEvents();
    return newEvent;
  };

  const deleteEvent = async (eventId: string): Promise<void> => {
    await api.deleteEvent(eventId);
    await loadEvents();
  };

  const archiveEvent = async (eventId: string): Promise<boolean> => {
    const result = await api.archiveEvent(eventId);
    await loadEvents();
    return result.archived;
  };

  const verifyEventPassword = async (
    eventId: string,
    password: string
  ): Promise<boolean> => {
    return await api.verifyEventPassword(eventId, password);
  };

  return {
    events,
    loading,
    error,
    loadEvents,
    createEvent,
    deleteEvent,
    archiveEvent,
    verifyEventPassword,
  };
};
