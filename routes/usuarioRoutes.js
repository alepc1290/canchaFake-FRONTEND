const express  = require('express')
const { param } = require('express-validator')
const router   = express.Router()

const {
  getUsuarios,
  getUsuarioById,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
  eliminarUsuario,
} = require('../controllers/usuarioController')

const { protect, adminOnly, selfOrAdmin } = require('../middleware/auth')
const validate = require('../middleware/validate')

const mongoId = param('id').isMongoId().withMessage('ID inválido')

// GET /api/usuarios  (admin)
router.get('/', protect, adminOnly, getUsuarios)

// GET /api/usuarios/:id
router.get('/:id', protect, selfOrAdmin, [mongoId], validate, getUsuarioById)

// PUT /api/usuarios/:id
router.put('/:id', protect, selfOrAdmin, [mongoId], validate, actualizarUsuario)

// PATCH /api/usuarios/:id/desactivar  (admin)
router.patch('/:id/desactivar', protect, adminOnly, [mongoId], validate, desactivarUsuario)

// PATCH /api/usuarios/:id/activar  (admin)
router.patch('/:id/activar', protect, adminOnly, [mongoId], validate, activarUsuario)

// DELETE /api/usuarios/:id  (admin)
router.delete('/:id', protect, adminOnly, [mongoId], validate, eliminarUsuario)

module.exports = router
