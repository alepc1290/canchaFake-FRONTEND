// ─── Handler global de errores ────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err.message)

  // Mongoose: duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      message: `Ya existe un registro con ese ${field}.`,
    })
  }

  // Mongoose: validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ message: messages.join(', ') })
  }

  // Mongoose: cast error (id inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `ID inválido: ${err.value}` })
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token inválido.' })
  }

  const status = err.statusCode || 500
  res.status(status).json({
    message: err.message || 'Error interno del servidor.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

// ─── 404 para rutas no encontradas ────────────────────────────────────────────
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

module.exports = { errorHandler, notFound }
