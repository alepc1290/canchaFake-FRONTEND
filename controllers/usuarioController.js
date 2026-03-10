const User = require('../models/User')

// ─── GET /api/usuarios  (admin) ───────────────────────────────────────────────
const getUsuarios = async (req, res, next) => {
  try {
    const { activo, role } = req.query
    const filter = {}
    if (activo !== undefined) filter.activo = activo === 'true'
    if (role)                 filter.role   = role

    const usuarios = await User.find(filter).sort({ createdAt: -1 })
    res.status(200).json(usuarios)
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/usuarios/:id  (admin o el propio usuario) ──────────────────────
const getUsuarioById = async (req, res, next) => {
  try {
    const usuario = await User.findById(req.params.id)
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }
    res.status(200).json(usuario)
  } catch (error) {
    next(error)
  }
}

// ─── PUT /api/usuarios/:id  (admin o el propio usuario) ──────────────────────
const actualizarUsuario = async (req, res, next) => {
  try {
    // Los usuarios no pueden cambiar su propio role ni activo
    if (req.user.role !== 'admin') {
      delete req.body.role
      delete req.body.activo
    }

    // Si se manda password, se hashea automáticamente en el pre-save hook
    // Solo actualizar si se mandó password
    const usuario = await User.findById(req.params.id)
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    const campos = ['nombre', 'telefono']
    if (req.user.role === 'admin') campos.push('role', 'activo')

    campos.forEach((c) => {
      if (req.body[c] !== undefined) usuario[c] = req.body[c]
    })

    if (req.body.password) {
      usuario.password = req.body.password
    }

    await usuario.save()
    res.status(200).json(usuario)
  } catch (error) {
    next(error)
  }
}

// ─── PATCH /api/usuarios/:id/desactivar  (admin) ─────────────────────────────
const desactivarUsuario = async (req, res, next) => {
  try {
    const usuario = await User.findById(req.params.id)
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    if (usuario.role === 'admin') {
      return res.status(400).json({ message: 'No podés desactivar a otro admin.' })
    }

    usuario.activo = false
    await usuario.save()

    res.status(200).json({ message: 'Usuario desactivado.', usuario })
  } catch (error) {
    next(error)
  }
}

// ─── PATCH /api/usuarios/:id/activar  (admin) ────────────────────────────────
const activarUsuario = async (req, res, next) => {
  try {
    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      { activo: true },
      { new: true }
    )
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }
    res.status(200).json({ message: 'Usuario activado.', usuario })
  } catch (error) {
    next(error)
  }
}

// ─── DELETE /api/usuarios/:id  (admin) ────────────────────────────────────────
const eliminarUsuario = async (req, res, next) => {
  try {
    const usuario = await User.findById(req.params.id)
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    if (usuario.role === 'admin') {
      return res.status(400).json({ message: 'No podés eliminar a un admin.' })
    }

    await usuario.deleteOne()
    res.status(200).json({ message: 'Usuario eliminado correctamente.' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsuarios,
  getUsuarioById,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
  eliminarUsuario,
}
