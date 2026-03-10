const express  = require('express')
const { body, param, query } = require('express-validator')
const router   = express.Router()

const {
  getCanchas,
  getCanchaById,
  crearCancha,
  actualizarCancha,
  eliminarCancha,
  getHorariosDisponibles,
} = require('../controllers/canchaController')

const { protect, adminOnly } = require('../middleware/auth')
const validate = require('../middleware/validate')

const canchaValidators = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('tipo')
    .isIn(['Fútbol 5', 'Fútbol 7', 'Fútbol 11'])
    .withMessage('Tipo inválido'),
  body('precio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
]

// GET /api/canchas
router.get('/', getCanchas)

// GET /api/canchas/:id
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('ID inválido')],
  validate,
  getCanchaById
)

// GET /api/canchas/:id/horarios?fecha=YYYY-MM-DD
router.get(
  '/:id/horarios',
  [
    param('id').isMongoId().withMessage('ID inválido'),
    query('fecha')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Fecha inválida. Use YYYY-MM-DD'),
  ],
  validate,
  getHorariosDisponibles
)

// POST /api/canchas  (admin)
router.post('/', protect, adminOnly, canchaValidators, validate, crearCancha)

// PUT /api/canchas/:id  (admin)
router.put(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId().withMessage('ID inválido'), ...canchaValidators],
  validate,
  actualizarCancha
)

// DELETE /api/canchas/:id  (admin)
router.delete(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId().withMessage('ID inválido')],
  validate,
  eliminarCancha
)

module.exports = router
