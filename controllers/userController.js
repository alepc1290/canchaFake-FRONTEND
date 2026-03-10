const User = require('../models/User')

// ── GET /api/users — listar todos (admin) ─────────────────────────────────────
const listarUsuarios = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, activo } = req.query
    const filtro = {}
    if (activo !== undefined) filtro.activo = activo === 'true'

    const skip    = (Number(page) - 1) * Number(limit)
    const total   = await User.countDocuments(filtro)
    const usuarios = await User.find(filtro)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    res.status(200).json({
      success: true,
      total,
      pagina:  Number(page),
      paginas: Math.ceil(total / Number(limit)),
      usuarios,
    })
  } catch (error) {
    next(error)
  }
}

// ── GET /api/users/:id — detalle (admin) ──────────────────────────────────────
const obtenerUsuario = async (req, res, next) => {
  try {
    const usuario = await User.findById(req.params.id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' })
    }
    res.status(200).json({ success: true, usuario })
  } catch (error) {
    next(error)
  }
}

// ── PUT /api/users/:id/desactivar — desactivar usuario (admin) ────────────────
const desactivarUsuario = async (req, res, next) => {
  try {
    const usuario = await User.findById(req.params.id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' })
    }
    if (usuario._id.toString() === req.usuario._id.toString()) {
      return res.status(400).json({ success: false, message: 'No podés desactivar tu propia cuenta.' })
    }

    usuario.activo = false
    await usuario.save()

    res.status(200).json({ success: true, message: 'Usuario desactivado.', usuario })
  } catch (error) {
    next(error)
  }
}

// ── PUT /api/users/:id/activar — reactivar usuario (admin) ───────────────────
const activarUsuario = async (req, res, next) => {
  try {
    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      { activo: true },
      { new: true, runValidators: true }
    )
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' })
    }
    res.status(200).json({ success: true, message: 'Usuario activado.', usuario })
  } catch (error) {
    next(error)
  }
}

// ── DELETE /api/users/:id — eliminar usuario (admin) ─────────────────────────
const eliminarUsuario = async (req, res, next) => {
  try {
    const usuario = await User.findById(req.params.id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' })
    }
    if (usuario._id.toString() === req.usuario._id.toString()) {
      return res.status(400).json({ success: false, message: 'No podés eliminar tu propia cuenta.' })
    }
    await usuario.deleteOne()
    res.status(200).json({ success: true, message: 'Usuario eliminado.' })
  } catch (error) {
    next(error)
  }
}

// ── PUT /api/users/:id/rol — cambiar rol (admin) ──────────────────────────────
const cambiarRol = async (req, res, next) => {
  try {
    const { rol } = req.body
    if (!['user', 'admin'].includes(rol)) {
      return res.status(400).json({ success: false, message: "Rol inválido. Use 'user' o 'admin'." })
    }
    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true, runValidators: true }
    )
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' })
    }
    res.status(200).json({ success: true, message: `Rol actualizado a '${rol}'.`, usuario })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  desactivarUsuario,
  activarUsuario,
  eliminarUsuario,
  cambiarRol,
}
