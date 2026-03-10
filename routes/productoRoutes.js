const express  = require('express')
const { body, param } = require('express-validator')
const router   = express.Router()

const {
  getProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productoController')

const { protect, adminOnly } = require('../middleware/auth')
const validate = require('../middleware/validate')

const productoValidators = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('precio').isFloat({ min: 0 }).withMessage('Precio inválido'),
  body('stock').isInt({ min: 0 }).withMessage('Stock inválido'),
]

// GET /api/productos
router.get('/', getProductos)

// GET /api/productos/:id
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('ID inválido')],
  validate,
  getProductoById
)

// POST /api/productos  (admin)
router.post('/', protect, adminOnly, productoValidators, validate, crearProducto)

// PUT /api/productos/:id  (admin)
router.put(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId().withMessage('ID inválido'), ...productoValidators],
  validate,
  actualizarProducto
)

// DELETE /api/productos/:id  (admin)
router.delete(
  '/:id',
  protect,
  adminOnly,
  [param('id').isMongoId().withMessage('ID inválido')],
  validate,
  eliminarProducto
)

module.exports = router
