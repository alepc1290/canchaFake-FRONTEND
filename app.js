require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const morgan  = require('morgan')

const authRoutes     = require('./routes/authRoutes')
const canchaRoutes   = require('./routes/canchaRoutes')
const productoRoutes = require('./routes/productoRoutes')
const reservaRoutes  = require('./routes/reservaRoutes')
const usuarioRoutes  = require('./routes/usuarioRoutes')
const { errorHandler, notFound } = require('./middleware/errorHandler')

const app = express()

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',')
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS bloqueado para: ${origin}`))
  },
  credentials: true,
}))

// ─── Parsers ──────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Logger ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    env:    process.env.NODE_ENV,
    time:   new Date().toISOString(),
  })
})

// ─── Rutas ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/canchas',   canchaRoutes)
app.use('/api/productos', productoRoutes)
app.use('/api/reservas',  reservaRoutes)
app.use('/api/usuarios',  usuarioRoutes)

// ─── Error handlers ───────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

module.exports = app
