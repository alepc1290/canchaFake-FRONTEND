const jwt  = require('jsonwebtoken')
const User = require('../models/User')

// ─── Helper: generar token ────────────────────────────────────────────────────
const generarToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

// ─── POST /api/auth/register ─────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { nombre, email, password, telefono } = req.body

    const existe = await User.findOne({ email })
    if (existe) {
      return res.status(400).json({ message: 'Ya existe un usuario con ese email.' })
    }

    const user  = await User.create({ nombre, email, password, telefono })
    const token = generarToken(user._id)

    res.status(201).json({ token, usuario: user })
  } catch (error) {
    next(error)
  }
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' })
    }

    if (!user.activo) {
      return res.status(401).json({ message: 'Tu cuenta está desactivada.' })
    }

    const ok = await user.compararPassword(password)
    if (!ok) {
      return res.status(401).json({ message: 'Credenciales inválidas.' })
    }

    const token = generarToken(user._id)
    res.status(200).json({ token, usuario: user })
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.status(200).json({ usuario: req.user })
}

module.exports = { register, login, getMe }
