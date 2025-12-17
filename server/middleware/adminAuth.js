import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No autorizado - Token requerido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_ludo');
        const user = await User.findById(decoded.id); // Cambiado de decoded.userId a decoded.id

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado - Se requieren permisos de administrador' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

export default adminAuth;
