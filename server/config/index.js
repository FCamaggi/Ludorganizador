/**
 * @file Archivo de configuración centralizada
 * @module config
 */

/**
 * Configuración de la base de datos
 */
export const DATABASE_CONFIG = {
    URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ludorganizador',
    OPTIONS: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
} as const;

/**
 * Configuración de JWT
 */
export const JWT_CONFIG = {
    SECRET: process.env.JWT_SECRET || 'default_secret_change_in_production',
    EXPIRES_IN: '30d', // 30 días
} as const;

/**
 * Configuración del servidor
 */
export const SERVER_CONFIG = {
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

/**
 * Configuración de CORS
 */
export const CORS_CONFIG = {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
} as const;

/**
 * Configuración de bcrypt
 */
export const BCRYPT_CONFIG = {
    SALT_ROUNDS: 10,
} as const;
