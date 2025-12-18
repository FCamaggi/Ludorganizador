import mongoose from 'mongoose';

const freeGameSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  games: {
    type: [
      {
        name: { type: String, required: true, trim: true },
        note: { type: String, default: '' }
      }
    ],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Debe haber al menos un juego en la lista'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices
freeGameSchema.index({ eventId: 1 });
freeGameSchema.index({ ownerId: 1 });

const FreeGame = mongoose.model('FreeGame', freeGameSchema);

export default FreeGame;
