import mongoose from 'mongoose';
import Event from '../models/Event.js';

/**
 * Script para archivar eventos antiguos (1 semana después de su fecha)
 * Puede ejecutarse manualmente o mediante un cron job
 */
const archiveOldEvents = async () => {
    try {
        // Conectar a MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ludorganizador';
        await mongoose.connect(mongoUri);
        console.log('Conectado a MongoDB');

        // Calcular fecha de corte (1 semana atrás)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        console.log(`Buscando eventos anteriores a: ${oneWeekAgo.toLocaleDateString('es-CL')}`);

        // Archivar eventos antiguos que aún no están archivados
        const result = await Event.updateMany(
            {
                date: { $lt: oneWeekAgo },
                archived: { $ne: true }
            },
            {
                $set: {
                    archived: true,
                    archivedAt: new Date()
                }
            }
        );

        console.log(`✅ ${result.modifiedCount} eventos archivados correctamente`);

        // Desconectar
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error al archivar eventos:', error);
        process.exit(1);
    }
};

// Ejecutar el script
archiveOldEvents();
