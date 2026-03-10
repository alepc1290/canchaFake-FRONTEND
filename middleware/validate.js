const { validationResult } = require('express-validator')

// Middleware que lee el resultado de express-validator y corta si hay errores
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Error de validación',
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    })
  }
  next()
}

module.exports = validate
