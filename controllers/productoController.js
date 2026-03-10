const Producto = require('../models/Producto')

// ─── GET /api/productos ───────────────────────────────────────────────────────
const getProductos = async (req, res, next) => {
  try {
    const { activo } = req.query
    const filter = {}
    if (activo !== undefined) filter.activo = activo === 'true'

    const productos = await Producto.find(filter).sort({ createdAt: -1 })
    res.status(200).json(productos)
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/productos/:id ───────────────────────────────────────────────────
const getProductoById = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id)
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }
    res.status(200).json(producto)
  } catch (error) {
    next(error)
  }
}

// ─── POST /api/productos  (admin) ─────────────────────────────────────────────
const crearProducto = async (req, res, next) => {
  try {
    const producto = await Producto.create(req.body)
    res.status(201).json(producto)
  } catch (error) {
    next(error)
  }
}

// ─── PUT /api/productos/:id  (admin) ──────────────────────────────────────────
const actualizarProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }
    res.status(200).json(producto)
  } catch (error) {
    next(error)
  }
}

// ─── DELETE /api/productos/:id  (admin) ───────────────────────────────────────
const eliminarProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id)
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }
    res.status(200).json({ message: 'Producto eliminado correctamente.' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
}
