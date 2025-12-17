import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ludorganizador';

async function makeAdmin(email) {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log(`❌ No se encontró un usuario con el email: ${email}`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`✅ Usuario ${user.name} (${user.email}) ahora es ADMIN`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Obtener email desde argumentos de línea de comandos
const email = process.argv[2];

if (!email) {
    console.log('Uso: node makeAdmin.js <email>');
    console.log('Ejemplo: node makeAdmin.js admin@example.com');
    process.exit(1);
}

makeAdmin(email);
