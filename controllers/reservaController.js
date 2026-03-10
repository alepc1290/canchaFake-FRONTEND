const Reserva = require('../models/Reserva')
const Cancha  = require('../models/Cancha')

// ─── Helper: verificar solapamiento de horario ────────────────────────────────
const hayConflicto = async (canchaId, fecha, horaInicio, horaFin, excludeId = null) => {
  const query = {
    canchaId,
    fecha,
    estado: 'confirmada',
    $or: [
      // la nueva reserva empieza dentro de una existente
      { horaInicio: { $lt: horaFin }, horaFin: { $gt: horaInicio } },
    ],
  }
  if (excludeId) query._id = { $ne: excludeId }
  const conflicto = await Reserva.findOne(query)
  return !!conflicto
}

// ─── GET /api/reservas  (admin: todas | user: las suyas) ─────────────────────
const getReservas = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id }

    const reservas = await Reserva.find(filter)
      .populate('canchaId', 'nombre tipo precio')
      .populate('userId',   'nombre email')
      .sort({ createdAt: -1 })

    res.status(200).json(reservas)
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/reservas/usuario/:userId ───────────────────────────────────────
const getReservasByUsuario = async (req, res, next) => {
  try {
    // selfOrAdmin middleware ya validó el acceso
    const reservas = await Reserva.find({ userId: req.params.userId })
      .populate('canchaId', 'nombre tipo precio imagen')
      .sort({ fecha: -1, horaInicio: -1 })

    res.status(200).json(reservas)
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/reservas/:id ────────────────────────────────────────────────────
const getReservaById = async (req, res, next) => {
  try {
    const reserva = await Reserva.findById(req.params.id)
      .populate('canchaId', 'nombre tipo precio')
      .populate('userId',   'nombre email')

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada.' })
    }

    // Un user solo puede ver sus propias reservas
    if (
      req.user.role !== 'admin' &&
      reserva.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'No tenés permiso para ver esta reserva.' })
    }

    res.status(200).json(reserva)
  } catch (error) {
    next(error)
  }
}

// ─── POST /api/reservas ───────────────────────────────────────────────────────
const crearReserva = async (req, res, next) => {
  try {
    const { canchaId, fecha, horaInicio, horaFin } = req.body

    // Validar que la cancha existe y está disponible
    const cancha = await Cancha.findById(canchaId)
    if (!cancha) {
      return res.status(404).json({ message: 'Cancha no encontrada.' })
    }
    if (!cancha.disponible) {
      return res.status(400).json({ message: 'La cancha no está disponible.' })
    }

    // ─── REGLA: no solapamiento ───────────────────────────────────────────────
    const conflicto = await hayConflicto(canchaId, fecha, horaInicio, horaFin)
    if (conflicto) {
      return res.status(400).json({
        message: 'Ya existe una reserva para esa cancha en ese horario.',
      })
    }

    // Calcular total (precio por hora)
    const [h1, m1] = horaInicio.split(':').map(Number)
    const [h2, m2] = horaFin.split(':').map(Number)
    const horas    = (h2 * 60 + m2 - (h1 * 60 + m1)) / 60
    const total    = cancha.precio * horas

    const reserva = await Reserva.create({
      userId: req.user._id,
      canchaId,
      fecha,
      horaInicio,
      horaFin,
      total,
    })

    const populada = await reserva.populate('canchaId', 'nombre tipo precio')
    res.status(201).json(populada)
  } catch (error) {
    next(error)
  }
}

// ─── DELETE /api/reservas/:id  (cancelar) ────────────────────────────────────
const cancelarReserva = async (req, res, next) => {
  try {
    const reserva = await Reserva.findById(req.params.id)
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada.' })
    }

    // Solo el dueño o un admin pueden cancelar
    if (
      req.user.role !== 'admin' &&
      reserva.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'No tenés permiso para cancelar esta reserva.' })
    }

    if (reserva.estado === 'cancelada') {
      return res.status(400).json({ message: 'La reserva ya está cancelada.' })
    }

    reserva.estado = 'cancelada'
    await reserva.save()

    res.status(200).json({ message: 'Reserva cancelada correctamente.', reserva })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getReservas,
  getReservasByUsuario,
  getReservaById,
  crearReserva,
  cancelarReserva,
}
