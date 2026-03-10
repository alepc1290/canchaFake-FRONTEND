const express = require('express')
const { body } = require('express-validator')
const router = express.Router()

const { register, login, getMe } = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')

// POST /api/auth/register
router.post(
  '/register',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  validate,
  register
)

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  validate,
  login
)

// GET /api/auth/me  (protegido)
router.get('/me', protect, getMe)

module.exports = router
