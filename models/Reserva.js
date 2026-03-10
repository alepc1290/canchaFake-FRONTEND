const mongoose = require('mongoose')

const reservaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
    },
    canchaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cancha',
      required: [true, 'La cancha es obligatoria'],
    },
    fecha: {
      type: String, // formato YYYY-MM-DD
      required: [true, 'La fecha es obligatoria'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido. Use YYYY-MM-DD'],
    },
    horaInicio: {
      type: String, // formato HH:mm
      required: [true, 'La hora de inicio es obligatoria'],
      match: [/^\d{2}:\d{2}$/, 'Formato de hora inválido. Use HH:mm'],
    },
    horaFin: {
      type: String,
      required: [true, 'La hora de fin es obligatoria'],
      match: [/^\d{2}:\d{2}$/, 'Formato de hora inválido. Use HH:mm'],
    },
    estado: {
      type: String,
      enum: ['confirmada', 'cancelada', 'completada'],
      default: 'confirmada',
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ─── Índice compuesto para la regla de no solapamiento ────────────────────────
reservaSchema.index({ canchaId: 1, fecha: 1, estado: 1 })

// ─── Virtual: populate cancha y usuario al hacer queries ─────────────────────
reservaSchema.virtual('cancha', {
  ref:          'Cancha',
  localField:   'canchaId',
  foreignField: '_id',
  justOne:      true,
})

reservaSchema.virtual('usuario', {
  ref:          'User',
  localField:   'userId',
  foreignField: '_id',
  justOne:      true,
})

module.exports = mongoose.model('Reserva', reservaSchema)
