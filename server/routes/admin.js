import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Table from '../models/Table.js';
import FreeGame from '../models/FreeGame.js';

const router = express.Router();

// ============ USERS MANAGEMENT ============

// Get all users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de administrador' });
        }

        await User.findByIdAndDelete(req.params.id);

        // Delete all events created by this user
        await Event.deleteMany({ createdBy: req.params.id });

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ EVENTS MANAGEMENT ============

// Get all events (admin view with full details)
router.get('/events', adminAuth, async (req, res) => {
    try {
        const events = await Event.find()
            .populate('creatorId', 'name email')
            .sort({ date: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete any event
router.delete('/events/:id', adminAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        // Delete related tables and free games
        await Table.deleteMany({ eventId: req.params.id });
        await FreeGame.deleteMany({ eventId: req.params.id });
        await Event.findByIdAndDelete(req.params.id);

        res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update any event
router.put('/events/:id', adminAuth, async (req, res) => {
    try {
        const { title, location, date, password } = req.body;

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { title, location, date, password },
            { new: true }
        ).populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ TABLES MANAGEMENT ============

// Get all tables
router.get('/tables', adminAuth, async (req, res) => {
    try {
        const tables = await Table.find()
            .populate('eventId', 'title date')
            .sort({ createdAt: -1 });
        res.json(tables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete any table
router.delete('/tables/:id', adminAuth, async (req, res) => {
    try {
        const table = await Table.findByIdAndDelete(req.params.id);

        if (!table) {
            return res.status(404).json({ error: 'Mesa no encontrada' });
        }

        res.json({ message: 'Mesa eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ FREE GAMES MANAGEMENT ============

// Get all free games
router.get('/freegames', adminAuth, async (req, res) => {
    try {
        const games = await FreeGame.find()
            .populate('eventId', 'title date')
            .sort({ createdAt: -1 });
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete any free game
router.delete('/freegames/:id', adminAuth, async (req, res) => {
    try {
        const game = await FreeGame.findByIdAndDelete(req.params.id);

        if (!game) {
            return res.status(404).json({ error: 'Juego no encontrado' });
        }

        res.json({ message: 'Juego eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ STATS ============

router.get('/stats', adminAuth, async (req, res) => {
    try {
        const [usersCount, eventsCount, tablesCount, gamesCount] = await Promise.all([
            User.countDocuments(),
            Event.countDocuments(),
            Table.countDocuments(),
            FreeGame.countDocuments()
        ]);

        res.json({
            users: usersCount,
            events: eventsCount,
            tables: tablesCount,
            freeGames: gamesCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
