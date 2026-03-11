const router = require('express').Router()
const { body } = require('express-validator')
const {
  listarUsuarios,
  obtenerUsuario,
  desactivarUsuario,
  activarUsuario,
  eliminarUsuario,
  cambiarRol,
} = require('../controllers/userController')
const { proteger, soloAdmin } = require('../middleware/auth')
const validar = require('../middleware/validar')

// Todas las rutas requieren autenticación + rol admin
router.use(proteger, soloAdmin)

router.get('/', listarUsuarios)
router.get('/:id', obtenerUsuario)
router.put('/:id/desactivar', desactivarUsuario)
router.put('/:id/activar', activarUsuario)
router.delete('/:id', eliminarUsuario)
router.put(
  '/:id/rol',
  [body('rol').isIn(['user', 'admin']).withMessage("Rol inválido.")],
  validar,
  cambiarRol
)

module.exports = router
