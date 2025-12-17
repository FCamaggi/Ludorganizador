import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../index.js';

const router = express.Router();

// Obtener mesas de un evento
router.get('/event/:eventId', (req, res) => {
  try {
    const tables = db.tables.filter(t => t.eventId === req.params.eventId);
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mesas' });
  }
});

// Crear mesa (requiere autenticación)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { eventId, gameName, description, minPlayers, maxPlayers } = req.body;

    if (!eventId || !gameName || !minPlayers || !maxPlayers) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const table = {
      id: `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      hostId: req.user.id,
      hostName: req.user.name,
      gameName,
      description: description || '',
      minPlayers,
      maxPlayers,
      registeredPlayers: [{ id: req.user.id, name: req.user.name }],
      createdAt: new Date().toISOString()
    };

    db.tables.push(table);
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear mesa' });
  }
});

// Unirse a una mesa
router.post('/:id/join', authenticateToken, (req, res) => {
  try {
    const table = db.tables.find(t => t.id === req.params.id);
    
    if (!table) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }

    // Verificar si ya está registrado
    if (table.registeredPlayers.some(p => p.id === req.user.id)) {
      return res.status(400).json({ error: 'Ya estás registrado en esta mesa' });
    }

    // Verificar si hay espacio
    if (table.registeredPlayers.length >= table.maxPlayers) {
      return res.status(400).json({ error: 'Mesa llena' });
    }

    table.registeredPlayers.push({
      id: req.user.id,
      name: req.user.name
    });

    res.json(table);
  } catch (error) {
    res.status(500).json({ error: 'Error al unirse a la mesa' });
  }
});

// Salir de una mesa
router.post('/:id/leave', authenticateToken, (req, res) => {
  try {
    const table = db.tables.find(t => t.id === req.params.id);
    
    if (!table) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }

    table.registeredPlayers = table.registeredPlayers.filter(
      p => p.id !== req.user.id
    );

    res.json(table);
  } catch (error) {
    res.status(500).json({ error: 'Error al salir de la mesa' });
  }
});

export default router;
