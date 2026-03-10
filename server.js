require('dotenv').config()
const app       = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 8000

const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    console.log(`📋 Entorno: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔑 Endpoints disponibles:`)
    console.log(`   POST   /api/auth/register`)
    console.log(`   POST   /api/auth/login`)
    console.log(`   GET    /api/auth/me`)
    console.log(`   GET    /api/canchas`)
    console.log(`   GET    /api/canchas/:id/horarios?fecha=YYYY-MM-DD`)
    console.log(`   POST   /api/reservas`)
    console.log(`   GET    /api/reservas/usuario/:userId`)
    console.log(`   GET    /api/productos`)
    console.log(`   GET    /api/usuarios  (admin)`)
  })
}

start()
