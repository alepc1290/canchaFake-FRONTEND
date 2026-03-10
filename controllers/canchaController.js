const Cancha = require('../models/Cancha')

// ─── GET /api/canchas ─────────────────────────────────────────────────────────
const getCanchas = async (req, res, next) => {
  try {
    const { tipo, disponible } = req.query
    const filter = {}
    if (tipo)       filter.tipo      = tipo
    if (disponible !== undefined) filter.disponible = disponible === 'true'

    const canchas = await Cancha.find(filter).sort({ createdAt: -1 })
    res.status(200).json(canchas)
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/canchas/:id ─────────────────────────────────────────────────────
const getCanchaById = async (req, res, next) => {
  try {
    const cancha = await Cancha.findById(req.params.id)
    if (!cancha) {
      return res.status(404).json({ message: 'Cancha no encontrada.' })
    }
    res.status(200).json(cancha)
  } catch (error) {
    next(error)
  }
}

// ─── POST /api/canchas  (admin) ───────────────────────────────────────────────
const crearCancha = async (req, res, next) => {
  try {
    const cancha = await Cancha.create(req.body)
    res.status(201).json(cancha)
  } catch (error) {
    next(error)
  }
}

// ─── PUT /api/canchas/:id  (admin) ────────────────────────────────────────────
const actualizarCancha = async (req, res, next) => {
  try {
    const cancha = await Cancha.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!cancha) {
      return res.status(404).json({ message: 'Cancha no encontrada.' })
    }
    res.status(200).json(cancha)
  } catch (error) {
    next(error)
  }
}

// ─── DELETE /api/canchas/:id  (admin) ────────────────────────────────────────
const eliminarCancha = async (req, res, next) => {
  try {
    const cancha = await Cancha.findByIdAndDelete(req.params.id)
    if (!cancha) {
      return res.status(404).json({ message: 'Cancha no encontrada.' })
    }
    res.status(200).json({ message: 'Cancha eliminada correctamente.' })
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/canchas/:id/horarios?fecha=YYYY-MM-DD ──────────────────────────
const getHorariosDisponibles = async (req, res, next) => {
  try {
    const { id }   = req.params
    const { fecha } = req.query

    if (!fecha) {
      return res.status(400).json({ message: 'El parámetro fecha es requerido.' })
    }

    const cancha = await Cancha.findById(id)
    if (!cancha) {
      return res.status(404).json({ message: 'Cancha no encontrada.' })
    }

    // Horarios del día completo
    const HORARIOS_DIA = [
      '08:00','09:00','10:00','11:00','12:00','13:00',
      '14:00','15:00','16:00','17:00','18:00','19:00',
      '20:00','21:00','22:00',
    ]

    const Reserva = require('../models/Reserva')
    const reservasDelDia = await Reserva.find({
      canchaId: id,
      fecha,
      estado: 'confirmada',
    })

    const ocupadas = new Set(reservasDelDia.map((r) => r.horaInicio))

    const horarios = HORARIOS_DIA.map((hora, idx) => ({
      id:         idx + 1,
      horaInicio: hora,
      horaFin:    HORARIOS_DIA[idx + 1] || '23:00',
      disponible: !ocupadas.has(hora),
    }))

    res.status(200).json(horarios)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCanchas,
  getCanchaById,
  crearCancha,
  actualizarCancha,
  eliminarCancha,
  getHorariosDisponibles,
}
