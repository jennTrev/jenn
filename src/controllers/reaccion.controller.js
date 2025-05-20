import { reaccion } from "../models/reaccion.js"
import { usuario } from "../models/usuarios.js"

// Obtener todas las reacciones
export const getReacciones = async (req, res) => {
  try {
    const reacciones = await reaccion.findAll({ include: usuario })
    res.status(200).json(reacciones)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al obtener las reacciones" })
  }
}

// Obtener una sola reacción por ID
export const getReaccion = async (req, res) => {
  try {
    const { id } = req.params
    const unaReaccion = await reaccion.findByPk(id, { include: usuario })

    if (!unaReaccion) {
      return res.status(404).json({ message: "Reacción no encontrada" })
    }

    res.status(200).json(unaReaccion)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al obtener la reacción" })
  }
}

// Crear nueva reacción
export const createReaccion = async (req, res) => {
  try {
    const { jugador_id, aciertos, tiempo_total } = req.body

    const nuevaReaccion = await reaccion.create({
      jugador_id,
      aciertos,
      tiempo_total,
    })

    res.status(201).json(nuevaReaccion)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al crear la reacción" })
  }
}

// Actualizar una reacción
export const updateReaccion = async (req, res) => {
  try {
    const { id } = req.params
    const { jugador_id, aciertos, tiempo_total } = req.body

    const reaccionExistente = await reaccion.findByPk(id)

    if (!reaccionExistente) {
      return res.status(404).json({ message: "Reacción no encontrada" })
    }

    reaccionExistente.jugador_id = jugador_id
    reaccionExistente.aciertos = aciertos
    reaccionExistente.tiempo_total = tiempo_total

    await reaccionExistente.save()

    res.status(200).json(reaccionExistente)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al actualizar la reacción" })
  }
}

// Eliminar una reacción
export const deleteReaccion = async (req, res) => {
  try {
    const { id } = req.params
    const reaccionExistente = await reaccion.findByPk(id)

    if (!reaccionExistente) {
      return res.status(404).json({ message: "Reacción no encontrada" })
    }

    await reaccionExistente.destroy()
    res.status(200).json({ message: "Reacción eliminada exitosamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al eliminar la reacción" })
  }
}
