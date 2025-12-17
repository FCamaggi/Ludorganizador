import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../index.js';

const router = express.Router();

// Obtener juegos libres de un evento
router.get('/event/:eventId', (req, res) => {
  try {
    const games = db.freeGames.filter(g => g.eventId === req.params.eventId);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener juegos' });
  }
});

// Agregar juego libre (requiere autenticación)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { eventId, gameName, note } = req.body;

    if (!eventId || !gameName) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const game = {
      id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      ownerId: req.user.id,
      ownerName: req.user.name,
      gameName,
      note: note || '',
      createdAt: new Date().toISOString()
    };

    db.freeGames.push(game);
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar juego' });
  }
});

export default router;
