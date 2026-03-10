const jwt  = require('jsonwebtoken')
const User = require('../models/User')

// ─── Verificar JWT ────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'No autorizado. Token requerido.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'Token inválido. Usuario no encontrado.' })
    }

    if (!user.activo) {
      return res.status(401).json({ message: 'Tu cuenta está desactivada.' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado. Iniciá sesión nuevamente.' })
    }
    return res.status(401).json({ message: 'Token inválido.' })
  }
}

// ─── Verificar rol admin ──────────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol admin.' })
  }
  next()
}

// ─── El usuario sólo puede acceder a sus propios recursos (o admin puede todo) ─
const selfOrAdmin = (req, res, next) => {
  const paramId = req.params.userId || req.params.id
  if (req.user.role === 'admin' || req.user._id.toString() === paramId) {
    return next()
  }
  return res.status(403).json({ message: 'No tenés permiso para este recurso.' })
}

module.exports = { protect, adminOnly, selfOrAdmin }
