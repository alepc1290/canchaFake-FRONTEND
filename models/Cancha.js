const mongoose = require('mongoose')

const canchaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la cancha es obligatorio'],
      trim: true,
      unique: true,
    },
    tipo: {
      type: String,
      required: [true, 'El tipo es obligatorio'],
      enum: {
        values: ['Fútbol 5', 'Fútbol 7', 'Fútbol 11'],
        message: 'Tipo inválido. Use: Fútbol 5, Fútbol 7 o Fútbol 11',
      },
    },
    precio: {
      type: Number,
      required: [true, 'El precio por hora es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
    imagen: {
      type: String,
      default: '',
    },
    capacidad: {
      type: Number,
      default: 10,
    },
    superficie: {
      type: String,
      enum: ['Sintético', 'Natural', 'Cemento'],
      default: 'Sintético',
    },
    disponible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Cancha', canchaSchema)
