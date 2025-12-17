import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import Event from '../models/Event.js';

const router = express.Router();

// Obtener todos los eventos (públicos y títulos de privados)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    const eventsResponse = events.map(event => {
      // Si el evento tiene contraseña, solo devolver información básica
      if (event.password) {
        return {
          id: event._id,
          title: event.title,
          hasPassword: true,
        };
      }
      // Evento público o sin contraseña
      return {
        id: event._id,
        title: event.title,
        location: event.location,
        date: event.date,
        description: event.description,
        hasPassword: false
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
    const { title, location, date, description, password } = req.body;

    if (!title || !location || !date) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const event = await Event.create({
      title,
      location,
      date,
      description: description || 'Evento organizado por la comunidad.',
      creatorId: req.user.id,
      ...(password && { password })
    });

    res.status(201).json({
      id: event._id,
      title: event.title,
      location: event.location,
      date: event.date,
      description: event.description,
      ...(password && { password })
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

    // Si tiene contraseña, solo devolver información básica
    if (event.password) {
      return res.json({
        id: event._id,
        title: event.title,
        hasPassword: true
      });
    }

    res.json({
      id: event._id,
      title: event.title,
      location: event.location,
      date: event.date,
      description: event.description
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({ error: 'Error al obtener evento' });
  }
});

export default router;
