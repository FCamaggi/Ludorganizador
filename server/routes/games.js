import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import FreeGame from '../models/FreeGame.js';

const router = express.Router();

// Obtener juegos libres de un evento (agrupados por usuario)
router.get('/event/:eventId', async (req, res) => {
  try {
    const gameLists = await FreeGame.find({ eventId: req.params.eventId })
      .populate('ownerId', 'name badges role')
      .sort({ createdAt: -1 });

    const gameListsResponse = gameLists.map(list => ({
      id: list._id,
      eventId: list.eventId,
      ownerId: list.ownerId._id,
      ownerName: list.ownerName,
      ownerBadges: list.ownerId.badges || [],
      ownerRole: list.ownerId.role,
      games: list.games
    }));

    res.json(gameListsResponse);
  } catch (error) {
    console.error('Error al obtener juegos:', error);
    res.status(500).json({ error: 'Error al obtener juegos' });
  }
});

// Agregar lista de juegos (requiere autenticación)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { eventId, games } = req.body;

    if (!eventId || !games || !Array.isArray(games) || games.length === 0) {
      return res.status(400).json({ error: 'Faltan campos requeridos o la lista de juegos está vacía' });
    }

    // Validar que cada juego tenga nombre
    for (const game of games) {
      if (!game.name || game.name.trim() === '') {
        return res.status(400).json({ error: 'Cada juego debe tener un nombre' });
      }
    }

    const gameList = await FreeGame.create({
      eventId,
      ownerId: req.user.id,
      ownerName: req.user.name,
      games
    });

    const populated = await FreeGame.findById(gameList._id).populate('ownerId', 'name badges role');

    res.status(201).json({
      id: populated._id,
      eventId: populated.eventId,
      ownerId: populated.ownerId._id,
      ownerName: populated.ownerName,
      ownerBadges: populated.ownerId.badges || [],
      ownerRole: populated.ownerId.role,
      games: populated.games
    });
  } catch (error) {
    console.error('Error al agregar lista de juegos:', error);
    res.status(500).json({ error: 'Error al agregar lista de juegos' });
  }
});

// Actualizar lista de juegos (requiere ser el creador)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { games } = req.body;

    if (!games || !Array.isArray(games) || games.length === 0) {
      return res.status(400).json({ error: 'La lista de juegos no puede estar vacía' });
    }

    const gameList = await FreeGame.findById(req.params.id);

    if (!gameList) {
      return res.status(404).json({ error: 'Lista de juegos no encontrada' });
    }

    // Verificar que el usuario sea el creador
    if (gameList.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para editar esta lista' });
    }

    gameList.games = games;
    await gameList.save();

    const populated = await FreeGame.findById(gameList._id).populate('ownerId', 'name badges role');

    res.json({
      id: populated._id,
      eventId: populated.eventId,
      ownerId: populated.ownerId._id,
      ownerName: populated.ownerName,
      ownerBadges: populated.ownerId.badges || [],
      ownerRole: populated.ownerId.role,
      games: populated.games
    });
  } catch (error) {
    console.error('Error al actualizar lista de juegos:', error);
    res.status(500).json({ error: 'Error al actualizar lista de juegos' });
  }
});

// Eliminar lista de juegos (requiere ser el creador o admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const gameList = await FreeGame.findById(req.params.id);

    if (!gameList) {
      return res.status(404).json({ error: 'Lista de juegos no encontrada' });
    }

    // Verificar que el usuario sea el creador o admin
    if (gameList.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta lista' });
    }

    await FreeGame.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lista de juegos eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar lista de juegos:', error);
    res.status(500).json({ error: 'Error al eliminar lista de juegos' });
  }
});

// Eliminar juego individual de una lista (requiere ser el creador o admin)
router.delete('/:id/game/:gameIndex', authenticateToken, async (req, res) => {
  try {
    const { id, gameIndex } = req.params;
    const index = parseInt(gameIndex);

    const gameList = await FreeGame.findById(id);

    if (!gameList) {
      return res.status(404).json({ error: 'Lista de juegos no encontrada' });
    }

    // Verificar que el usuario sea el creador o admin
    if (gameList.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para editar esta lista' });
    }

    if (index < 0 || index >= gameList.games.length) {
      return res.status(400).json({ error: 'Índice de juego inválido' });
    }

    // Si solo hay un juego, eliminar toda la lista
    if (gameList.games.length === 1) {
      await FreeGame.findByIdAndDelete(id);
      return res.json({ message: 'Lista eliminada (era el último juego)', deleted: true });
    }

    // Eliminar el juego del array
    gameList.games.splice(index, 1);
    await gameList.save();

    const populated = await FreeGame.findById(gameList._id).populate('ownerId', 'name badges role');

    res.json({
      message: 'Juego eliminado exitosamente',
      deleted: false,
      gameList: {
        id: populated._id,
        eventId: populated.eventId,
        ownerId: populated.ownerId._id,
        ownerName: populated.ownerName,
        ownerBadges: populated.ownerId.badges || [],
        ownerRole: populated.ownerId.role,
        games: populated.games
      }
    });
  } catch (error) {
    console.error('Error al eliminar juego individual:', error);
    res.status(500).json({ error: 'Error al eliminar juego individual' });
  }
});

export default router;
