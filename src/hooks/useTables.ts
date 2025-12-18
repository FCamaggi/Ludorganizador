/**
 * @file Hook para manejar mesas de juego
 * @module hooks/useTables
 */

import { useState, useEffect, useCallback } from 'react';
import { GameTable, CreateTableData } from '../types';
import * as api from '../services/apiService';

/**
 * Hook para manejar el estado y operaciones de mesas
 */
export const useTables = (eventId: string | null) => {
  const [tables, setTables] = useState<GameTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTables = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);
    try {
      const tablesData = await api.loadTables(eventId);
      setTables(tablesData);
    } catch (err: any) {
      setError(err.message || 'Error cargando mesas');
      console.error('Error loading tables:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const createTable = async (
    tableData: CreateTableData
  ): Promise<GameTable> => {
    const newTable = await api.saveTable(tableData);
    await loadTables();
    return newTable;
  };

  const joinTable = async (tableId: string): Promise<void> => {
    await api.joinTable(tableId);
    await loadTables();
  };

  const leaveTable = async (tableId: string): Promise<void> => {
    await api.leaveTable(tableId);
    await loadTables();
  };

  const deleteTable = async (tableId: string): Promise<void> => {
    await api.deleteTable(tableId);
    await loadTables();
  };

  return {
    tables,
    loading,
    error,
    loadTables,
    createTable,
    joinTable,
    leaveTable,
    deleteTable,
  };
};
