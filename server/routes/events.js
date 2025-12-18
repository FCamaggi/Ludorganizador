import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import Event from '../models/Event.js';
import Table from '../models/Table.js';
import FreeGame from '../models/FreeGame.js';

const router = express.Router();
const auth = authenticateToken;

// Obtener todos los eventos (públicos y títulos de privados)
router.get('/', optionalAuth, async (req, res) => {
  try {
    // Solo mostrar eventos no archivados, y popular el creador con badges
    const events = await Event.find({ archived: false })
      .populate('creatorId', 'name badges role')
      .sort({ date: 1 });

    const eventsResponse = events.map(event => {
      const isCreator = req.user && event.creatorId && event.creatorId._id.toString() === req.user.id;
      const isAdmin = req.user && req.user.role === 'admin';

      // Si el evento tiene contraseña pero el usuario es creador o admin, mostrar todo
      if (event.password && !isCreator && !isAdmin) {
        return {
          id: event._id,
          title: event.title,
          location: '',
          date: event.date, // Incluir fecha aunque sea privado
          description: '',
          password: true, // Indicar que tiene contraseña
          ...(req.user && { creatorId: event.creatorId?._id.toString() }), // Incluir creatorId si estás autenticado
          ...(req.user && event.creatorId && {
            creatorName: event.creatorId.name,
            creatorBadges: event.creatorId.badges || [],
            creatorRole: event.creatorId.role
          }),
        };
      }

      // Evento público, sin contraseña, o usuario autorizado (creador/admin)
      return {
        id: event._id,
        title: event.title,
        location: event.location,
        date: event.date,
        description: event.description,
        showMap: event.showMap,
        ...(event.password && { password: true }), // Indicar si tiene contraseña
        ...(req.user && { creatorId: event.creatorId?._id.toString() }), // Incluir creatorId si estás autenticado
        ...(event.creatorId && {
          creatorName: event.creatorId.name,
          creatorBadges: event.creatorId.badges || [],
          creatorRole: event.creatorId.role
        }),
      };
    });

    res.json(eventsResponse);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// Verificar contraseña de evento
router.post('/:id/verify-password', async (req, res) => {
  try {
    const { password } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    if (!event.password) {
      return res.json({
        valid: true,
        event: {
          id: event._id,
          title: event.title,
          location: event.location,
          date: event.date,
          description: event.description
        }
      });
    }

    if (password === event.password) {
      res.json({
        valid: true,
        event: {
          id: event._id,
          title: event.title,
          location: event.location,
          date: event.date,
          description: event.description,
          password: event.password
        }
      });
    } else {
      res.status(401).json({ valid: false, error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error al verificar contraseña:', error);
    res.status(500).json({ error: 'Error al verificar contraseña' });
  }
});

// Crear evento (requiere autenticación)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, location, date, description, password, showMap } = req.body;

    if (!title || !location || !date) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const event = await Event.create({
      title,
      location,
      date,
      description: description || 'Evento organizado por la comunidad.',
      creatorId: req.user.id,
      showMap: showMap !== undefined ? showMap : true,
      ...(password && { password })
    });

    // Retornar el evento completo con el formato correcto
    res.status(201).json({
      id: event._id,
      title: event.title,
      location: event.location,
      date: event.date,
      description: event.description,
      showMap: event.showMap,
      ...(password && { password: true }) // Indicar que tiene contraseña sin revelarla
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ error: 'Error al crear evento' });
  }
});

// Obtener evento por ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    const isCreator = req.user && event.creatorId && event.creatorId.toString() === req.user.id;
    const isAdmin = req.user && req.user.role === 'admin';

    // Si tiene contraseña pero no eres creador ni admin, solo devolver info básica
    if (event.password && !isCreator && !isAdmin) {
      return res.json({
        id: event._id,
        title: event.title,
        password: true,
        ...(req.user && { creatorId: event.creatorId?.toString() }),
      });
    }

    // Usuario autorizado o evento público
    res.json({
      id: event._id,
      title: event.title,
      location: event.location,
      date: event.date,
      description: event.description,
      showMap: event.showMap,
      ...(event.password && { password: true }),
      ...(req.user && { creatorId: event.creatorId?.toString() }),
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({ error: 'Error al obtener evento' });
  }
});

// Eliminar evento (solo creador o admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    const isCreator = event.creatorId && event.creatorId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar este evento' });
    }

    // Eliminar mesas y juegos libres relacionados
    await Table.deleteMany({ eventId: req.params.id });
    await FreeGame.deleteMany({ eventId: req.params.id });
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
});

// Archivar/desarchivar evento (solo admin o creador)
router.patch('/:id/archive', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    const isCreator = event.creatorId && event.creatorId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ error: 'No tienes permisos para archivar este evento' });
    }

    event.archived = !event.archived;
    event.archivedAt = event.archived ? new Date() : null;
    await event.save();

    res.json({
      message: event.archived ? 'Evento archivado' : 'Evento restaurado',
      archived: event.archived
    });
  } catch (error) {
    console.error('Error al archivar evento:', error);
    res.status(500).json({ error: 'Error al archivar evento' });
  }
});

// Archivar automáticamente eventos antiguos (llamado por cron o manualmente)
router.post('/auto-archive', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await Event.updateMany(
      {
        date: { $lt: oneWeekAgo },
        archived: false
      },
      {
        $set: {
          archived: true,
          archivedAt: new Date()
        }
      }
    );

    res.json({
      message: `${result.modifiedCount} eventos archivados automáticamente`,
      count: result.modifiedCount
    });
  } catch (error) {
    console.error('Error en archivado automático:', error);
    res.status(500).json({ error: 'Error en archivado automático' });
  }
});

export default router;
