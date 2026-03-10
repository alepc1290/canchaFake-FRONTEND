/**
 * Script de seed: crea un admin y datos de ejemplo.
 * Uso: node config/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')
const User     = require('../models/User')
const Cancha   = require('../models/Cancha')
const Producto = require('../models/Producto')

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Conectado a MongoDB...')

  // Limpiar colecciones
  await Promise.all([User.deleteMany(), Cancha.deleteMany(), Producto.deleteMany()])
  console.log('Colecciones limpiadas.')

  // Admin
  await User.create({
    nombre:   'Admin',
    email:    'admin@canchas5.com',
    password: 'admin123',
    role:     'admin',
  })

  // Usuario de prueba
  await User.create({
    nombre:   'Juan Pérez',
    email:    'juan@example.com',
    password: 'user1234',
    role:     'user',
  })

  // Canchas
  await Cancha.insertMany([
    {
      nombre:      'Cancha Alpha',
      tipo:        'Fútbol 5',
      precio:      3500,
      descripcion: 'Césped sintético de última generación. Iluminación LED.',
      imagen:      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
      capacidad:   10,
      superficie:  'Sintético',
    },
    {
      nombre:      'Cancha Beta',
      tipo:        'Fútbol 5',
      precio:      3200,
      descripcion: 'Pasto natural, iluminación completa para juego nocturno.',
      imagen:      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
      capacidad:   10,
      superficie:  'Natural',
    },
    {
      nombre:      'Cancha Gamma',
      tipo:        'Fútbol 7',
      precio:      4800,
      descripcion: 'Cancha ampliada para fútbol 7. Vestuarios premium.',
      imagen:      'https://images.unsplash.com/photo-1551958219-acbc630e2914?w=800',
      capacidad:   14,
      superficie:  'Sintético',
      disponible:  false,
    },
    {
      nombre:      'Cancha Delta',
      tipo:        'Fútbol 5',
      precio:      3000,
      descripcion: 'Ideal para entrenamientos y partidos rápidos.',
      imagen:      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      capacidad:   10,
      superficie:  'Sintético',
    },
  ])

  // Productos
  await Producto.insertMany([
    { nombre: 'Botella de agua 500ml', precio: 350,  stock: 100, descripcion: 'Agua mineral.' },
    { nombre: 'Pelota de fútbol',      precio: 4500, stock: 15,  descripcion: 'Pelota oficial.' },
    { nombre: 'Pechera (set x10)',     precio: 1200, stock: 20,  descripcion: 'Set de pecheras de colores.' },
    { nombre: 'Gatorade 600ml',        precio: 650,  stock: 50,  descripcion: 'Bebida isotónica.' },
  ])

  console.log('✅ Seed completado.')
  console.log('   Admin:  admin@canchas5.com  /  admin123')
  console.log('   User:   juan@example.com    /  user1234')
  await mongoose.disconnect()
}

seed().catch((e) => { console.error(e); process.exit(1) })
