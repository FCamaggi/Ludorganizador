import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    unique: false,
    sparse: true, // Permite múltiples valores null
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['nuevo', 'user', 'admin'],
    default: 'nuevo'
  },
  approved: {
    type: Boolean,
    default: false
  },
  badges: {
    type: [String],
    enum: ['veterano', 'vip', 'organizador', 'fundador'],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// El índice de username ya se crea automáticamente con unique: true
// No es necesario declararlo manualmente

const User = mongoose.model('User', userSchema);

export default User;
