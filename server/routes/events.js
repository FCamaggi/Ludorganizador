import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { db } from '../index.js';

const router = express.Router();

// Obtener todos los eventos (públicos y títulos de privados)
router.get('/', optionalAuth, (req, res) => {
  try {
    const events = db.events.map(event => {
      // Si el evento tiene contraseña y el usuario no está autenticado o no ha desbloqueado
      if (event.password) {
        return {
          id: event.id,
          title: event.title,
          hasPassword: true,
          // No incluir otros detalles
        };
      }
      // Evento público o sin contraseña
      return {
        ...event,
        hasPassword: false
      };
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// Verificar contraseña de evento
router.post('/:id/verify-password', (req, res) => {
  try {
    const { password } = req.body;
    const event = db.events.find(e => e.id === req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    if (!event.password) {
      return res.json({ valid: true, event });
    }

    if (password === event.password) {
      res.json({ valid: true, event });
    } else {
      res.status(401).json({ valid: false, error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar contraseña' });
  }
});

// Crear evento (requiere autenticación)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, location, date, description, password } = req.body;

    if (!title || !location || !date) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const event = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      location,
      date,
      description: description || 'Evento organizado por la comunidad.',
      creatorId: req.user.id,
      createdAt: new Date().toISOString(),
      ...(password && { password })
    };

    db.events.push(event);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
});

// Obtener evento por ID
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const event = db.events.find(e => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Si tiene contraseña, solo devolver información básica
    if (event.password) {
      return res.json({
        id: event.id,
        title: event.title,
        hasPassword: true
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener evento' });
  }
});

export default router;
