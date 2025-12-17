import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import FreeGame from '../models/FreeGame.js';

const router = express.Router();

// Obtener juegos libres de un evento
router.get('/event/:eventId', async (req, res) => {
  try {
    const games = await FreeGame.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });

    const gamesResponse = games.map(game => ({
      id: game._id,
      eventId: game.eventId,
      ownerId: game.ownerId,
      ownerName: game.ownerName,
      gameName: game.gameName,
      note: game.note
    }));

    res.json(gamesResponse);
  } catch (error) {
    console.error('Error al obtener juegos:', error);
    res.status(500).json({ error: 'Error al obtener juegos' });
  }
});

// Agregar juego libre (requiere autenticación)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { eventId, gameName, note } = req.body;

    if (!eventId || !gameName) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const game = await FreeGame.create({
      eventId,
      ownerId: req.user.id,
      ownerName: req.user.name,
      gameName,
      note: note || ''
    });

    res.status(201).json({
      id: game._id,
      eventId: game.eventId,
      ownerId: game.ownerId,
      ownerName: game.ownerName,
      gameName: game.gameName,
      note: game.note
    });
  } catch (error) {
    console.error('Error al agregar juego:', error);
    res.status(500).json({ error: 'Error al agregar juego' });
  }
});

// Eliminar juego libre (requiere ser el creador o admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const game = await FreeGame.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    // Verificar que el usuario sea el creador o admin
    if (game.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este juego' });
    }

    await FreeGame.findByIdAndDelete(req.params.id);
    res.json({ message: 'Juego eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar juego:', error);
    res.status(500).json({ error: 'Error al eliminar juego' });
  }
});

export default router;
