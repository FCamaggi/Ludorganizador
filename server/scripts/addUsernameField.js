/**
 * Script de migración: Agregar campo username a usuarios existentes
 * 
 * Este script debe ejecutarse UNA VEZ para migrar usuarios existentes
 * que solo tienen email a tener también username.
 * 
 * Ejecutar: node server/scripts/addUsernameField.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

const migrateUsers = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect('mongodb+srv://ludoadmin:RRdWDIVlaZem68Gr@ludorganizador.o1y6mzv.mongodb.net/?appName=ludorganizador');
    console.log('✅ Conectado a MongoDB\n');

    // Buscar usuarios sin username
    const usersWithoutUsername = await User.find({
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: '' }
      ]
    });

    console.log(`📊 Usuarios sin username encontrados: ${usersWithoutUsername.length}\n`);

    if (usersWithoutUsername.length === 0) {
      console.log('✨ Todos los usuarios ya tienen username. No hay nada que migrar.');
      process.exit(0);
    }

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutUsername) {
      try {
        // Generar username desde email o name
        let baseUsername = user.email
          ? user.email.split('@')[0].toLowerCase()
          : user.name.toLowerCase().replace(/\s+/g, '');

        // Limpiar caracteres especiales
        baseUsername = baseUsername.replace(/[^a-z0-9_]/g, '');

        let username = baseUsername;
        let counter = 1;

        // Verificar si el username ya existe
        while (await User.findOne({ username })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        // Actualizar usuario
        user.username = username;
        await user.save();

        console.log(`✅ Migrado: ${user.name} -> username: ${username}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrando usuario ${user.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Resumen de migración:');
    console.log(`   ✅ Exitosos: ${successCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log('\n✨ Migración completada');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar migración
migrateUsers();
