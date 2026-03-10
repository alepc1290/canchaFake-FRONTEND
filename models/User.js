const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [60, 'El nombre no puede superar 60 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // no se devuelve por defecto en queries
    },
    telefono: {
      type: Number,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// ─── Hash password antes de guardar ──────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt   = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ─── Método de instancia: comparar contraseña ─────────────────────────────────
userSchema.methods.compararPassword = async function (plain) {
  return bcrypt.compare(plain, this.password)
}

// ─── Ocultar password y __v en la respuesta JSON ──────────────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.__v
  return obj
}

module.exports = mongoose.model('User', userSchema)
