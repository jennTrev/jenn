import { alfombra } from "../models/alfombra.js"
import { usuario } from "../models/usuarios.js"

// Obtener todas las sesiones de alfombra
export const getAlfombras = async (req, res) => {
  try {
    const sesiones = await alfombra.findAll({ include: usuario })
    res.status(200).json(sesiones)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al obtener las sesiones de alfombra" })
  }
}

// Obtener una sola sesión de alfombra
export const getAlfombra = async (req, res) => {
  try {
    const { id } = req.params
    const unaSesion = await alfombra.findByPk(id, { include: usuario })

    if (!unaSesion) {
      return res.status(404).json({ message: "Sesión no encontrada" })
    }

    res.status(200).json(unaSesion)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al obtener la sesión" })
  }
}

// Crear nueva sesión de alfombra
export const createAlfombra = async (req, res) => {
  try {
    const { jugador_id, repeticiones, aciertos } = req.body

    const nuevaSesion = await alfombra.create({
      jugador_id,
      repeticiones,
      aciertos,
    })

    res.status(201).json(nuevaSesion)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al crear la sesión de alfombra" })
  }
}

// Actualizar una sesión de alfombra
export const updateAlfombra = async (req, res) => {
  try {
    const { id } = req.params
    const { jugador_id, repeticiones, aciertos } = req.body

    const sesionExistente = await alfombra.findByPk(id)

    if (!sesionExistente) {
      return res.status(404).json({ message: "Sesión no encontrada" })
    }

    sesionExistente.jugador_id = jugador_id
    sesionExistente.repeticiones = repeticiones
    sesionExistente.aciertos = aciertos

    await sesionExistente.save()

    res.status(200).json(sesionExistente)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al actualizar la sesión" })
  }
}

// Eliminar una sesión de alfombra
export const deleteAlfombra = async (req, res) => {
  try {
    const { id } = req.params
    const sesionExistente = await alfombra.findByPk(id)

    if (!sesionExistente) {
      return res.status(404).json({ message: "Sesión no encontrada" })
    }

    await sesionExistente.destroy()
    res.status(200).json({ message: "Sesión eliminada exitosamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al eliminar la sesión" })
  }
}
