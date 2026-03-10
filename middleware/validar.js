const { validationResult } = require('express-validator')

/**
 * Middleware que corta la cadena si hay errores de validación.
 * Debe colocarse después de los `check()` / `body()` de express-validator.
 */
const validar = (req, res, next) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errores: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    })
  }
  next()
}

module.exports = validar
