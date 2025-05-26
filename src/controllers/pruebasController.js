import { usuario } from "../models/usuarios.js";
import { alfombra } from "../models/alfombra.js"
import { reaccion } from "../models/reaccion.js";
import { Sequelize as sequelize } from 'sequelize';

// Obtener todas las pruebas de un usuario
export const obtenerPruebasUsuario = async (req, res) => {
  try {
    const { userId } = req.params

    // Verificar que el usuario existe
    const usuarioExiste = await usuario.findByPk(userId)
    if (!usuarioExiste) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    // Obtener pruebas de alfombra
    const pruebasAlfombra = await alfombra.findAll({
      where: { jugador_id: userId },
      order: [["id", "DESC"]],
      limit: 50,
    })

    // Obtener pruebas de reacción
    const pruebasReaccion = await reaccion.findAll({
      where: { jugador_id: userId },
      order: [["id", "DESC"]],
      limit: 50,
    })

    res.json({
      success: true,
      data: {
        usuario: {
          id: usuarioExiste.id,
          nombre: usuarioExiste.nombre,
          apellido: usuarioExiste.apellido,
        },
        pruebas: {
          alfombra: pruebasAlfombra,
          reaccion: pruebasReaccion,
        },
        total: {
          alfombra: pruebasAlfombra.length,
          reaccion: pruebasReaccion.length,
        },
      },
    })
  } catch (error) {
    console.error("Error al obtener pruebas del usuario:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Obtener estadísticas de un usuario
export const obtenerEstadisticasUsuario = async (req, res) => {
  try {
    const { userId } = req.params

    // Verificar que el usuario existe
    const usuarioExiste = await usuario.findByPk(userId)
    if (!usuarioExiste) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    // Estadísticas de alfombra
    const estadisticasAlfombra = await alfombra.findAll({
      where: { jugador_id: userId },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "total_pruebas"],
        [sequelize.fn("AVG", sequelize.col("aciertos")), "promedio_aciertos"],
        [sequelize.fn("AVG", sequelize.literal("(aciertos * 100.0 / repeticiones)")), "porcentaje_aciertos"],
        [sequelize.fn("MAX", sequelize.col("aciertos")), "mejor_aciertos"],
        [sequelize.fn("MIN", sequelize.col("aciertos")), "peor_aciertos"],
      ],
      raw: true,
    })

    // Estadísticas de reacción
    const estadisticasReaccion = await reaccion.findAll({
      where: { jugador_id: userId },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "total_pruebas"],
        [sequelize.fn("AVG", sequelize.col("aciertos")), "promedio_aciertos"],
        [sequelize.fn("AVG", sequelize.col("tiempo_total")), "tiempo_promedio"],
        [sequelize.fn("MIN", sequelize.col("tiempo_total")), "mejor_tiempo"],
        [sequelize.fn("MAX", sequelize.col("tiempo_total")), "peor_tiempo"],
        [sequelize.fn("MAX", sequelize.col("aciertos")), "mejor_aciertos"],
      ],
      raw: true,
    })

    res.json({
      success: true,
      data: {
        usuario: {
          id: usuarioExiste.id,
          nombre: usuarioExiste.nombre,
          apellido: usuarioExiste.apellido,
          rol: usuarioExiste.rol,
        },
        estadisticas: {
          alfombra: estadisticasAlfombra[0] || {
            total_pruebas: 0,
            promedio_aciertos: 0,
            porcentaje_aciertos: 0,
            mejor_aciertos: 0,
            peor_aciertos: 0,
          },
          reaccion: estadisticasReaccion[0] || {
            total_pruebas: 0,
            promedio_aciertos: 0,
            tiempo_promedio: 0,
            mejor_tiempo: 0,
            peor_tiempo: 0,
            mejor_aciertos: 0,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error al obtener estadísticas del usuario:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}
