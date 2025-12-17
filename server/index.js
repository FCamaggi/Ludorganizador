import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import tablesRoutes from './routes/tables.js';
import gamesRoutes from './routes/games.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (para desarrollo - en producción usar base de datos)
export const db = {
  users: [],
  events: [
    {
      id: 'evt-1',
      title: 'Noche de Juegos en el Centro',
      location: 'Cafetería "El Dado"',
      date: new Date(Date.now() + 86400000 * 3).toISOString(),
      description: 'Nuestra reunión mensual. Traed vuestros mejores juegos.',
      creatorId: null
    }
  ],
  tables: [],
  freeGames: []
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/games', gamesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ludorganizador API funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
