const mongoose = require('mongoose')

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
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
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Producto', productoSchema)
