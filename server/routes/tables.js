import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Table from '../models/Table.js';

const router = express.Router();

// Obtener mesas de un evento
router.get('/event/:eventId', async (req, res) => {
  try {
    const tables = await Table.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });

    const tablesResponse = tables.map(table => ({
      id: table._id,
      eventId: table.eventId,
      hostId: table.hostId,
      hostName: table.hostName,
      gameName: table.gameName,
      description: table.description,
      minPlayers: table.minPlayers,
      maxPlayers: table.maxPlayers,
      registeredPlayers: table.registeredPlayers
    }));

    res.json(tablesResponse);
  } catch (error) {
    console.error('Error al obtener mesas:', error);
    res.status(500).json({ error: 'Error al obtener mesas' });
  }
});

// Crear mesa (requiere autenticación)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { eventId, gameName, description, minPlayers, maxPlayers } = req.body;

    if (!eventId || !gameName || !minPlayers || !maxPlayers) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const table = await Table.create({
      eventId,
      hostId: req.user.id,
      hostName: req.user.name,
      gameName,
      description: description || '',
      minPlayers,
      maxPlayers,
      registeredPlayers: [{ id: req.user.id, name: req.user.name }]
    });

    res.status(201).json({
      id: table._id,
      eventId: table.eventId,
      hostId: table.hostId,
      hostName: table.hostName,
      gameName: table.gameName,
      description: table.description,
      minPlayers: table.minPlayers,
      maxPlayers: table.maxPlayers,
      registeredPlayers: table.registeredPlayers
    });
  } catch (error) {
    console.error('Error al crear mesa:', error);
    res.status(500).json({ error: 'Error al crear mesa' });
  }
});

// Unirse a una mesa
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }

    // Verificar si ya está registrado
    if (table.registeredPlayers.some(p => p.id.toString() === req.user.id)) {
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

    await table.save();

    res.json({
      id: table._id,
      eventId: table.eventId,
      hostId: table.hostId,
      hostName: table.hostName,
      gameName: table.gameName,
      description: table.description,
      minPlayers: table.minPlayers,
      maxPlayers: table.maxPlayers,
      registeredPlayers: table.registeredPlayers
    });
  } catch (error) {
    console.error('Error al unirse a la mesa:', error);
    res.status(500).json({ error: 'Error al unirse a la mesa' });
  }
});

// Salir de una mesa
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }

    table.registeredPlayers = table.registeredPlayers.filter(
      p => p.id.toString() !== req.user.id
    );

    await table.save();

    res.json({
      id: table._id,
      eventId: table.eventId,
      hostId: table.hostId,
      hostName: table.hostName,
      gameName: table.gameName,
      description: table.description,
      minPlayers: table.minPlayers,
      maxPlayers: table.maxPlayers,
      registeredPlayers: table.registeredPlayers
    });
  } catch (error) {
    console.error('Error al salir de la mesa:', error);
    res.status(500).json({ error: 'Error al salir de la mesa' });
  }
});

// Eliminar mesa (requiere ser el creador o admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }

    // Verificar que el usuario sea el creador o admin
    if (table.hostId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta mesa' });
    }

    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mesa eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar mesa:', error);
    res.status(500).json({ error: 'Error al eliminar mesa' });
  }
});

export default router;
