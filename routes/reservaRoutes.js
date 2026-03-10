const express  = require('express')
const { body, param } = require('express-validator')
const router   = express.Router()

const {
  getReservas,
  getReservasByUsuario,
  getReservaById,
  crearReserva,
  cancelarReserva,
} = require('../controllers/reservaController')

const { protect, selfOrAdmin } = require('../middleware/auth')
const validate = require('../middleware/validate')

// GET /api/reservas  (admin: todas | user: las suyas)
router.get('/', protect, getReservas)

// GET /api/reservas/usuario/:userId
router.get(
  '/usuario/:userId',
  protect,
  selfOrAdmin,
  [param('userId').isMongoId().withMessage('ID de usuario inválido')],
  validate,
  getReservasByUsuario
)

// GET /api/reservas/:id
router.get(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('ID inválido')],
  validate,
  getReservaById
)

// POST /api/reservas
router.post(
  '/',
  protect,
  [
    body('canchaId').isMongoId().withMessage('canchaId inválido'),
    body('fecha')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha inválida. Use YYYY-MM-DD'),
    body('horaInicio')
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('horaInicio inválida. Use HH:mm'),
    body('horaFin')
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('horaFin inválida. Use HH:mm'),
  ],
  validate,
  crearReserva
)

// DELETE /api/reservas/:id  (cancelar)
router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('ID inválido')],
  validate,
  cancelarReserva
)

module.exports = router
