import { usuario } from "../models/usuarios.js";
import { alfombra } from "../models/alfombra.js"
import { reaccion } from "../models/reaccion.js";
import { Sequelize as sequelize } from 'sequelize';

// Ranking general de alfombra
export const rankingAlfombra = async (req, res) => {
  try {
    const { limite = 10, rol = null } = req.query

    const whereClause = {}
    if (rol && ["entrenador", "jugador", "tecnico"].includes(rol)) {
      whereClause.rol = rol
    }

    const ranking = await usuario.findAll({
      where: whereClause,
      include: [
        {
          model: alfombra,
          as: "alfombras", // Asegúrate de que coincida con la asociación
          attributes: [],
          required: true, // INNER JOIN para solo usuarios con pruebas
        },
      ],
      attributes: [
        "id",
        "nombre",
        "apellido",
        "rol",
        "posicion",
        [sequelize.fn("COUNT", sequelize.col("alfombras.id")), "total_pruebas"],
        [sequelize.fn("AVG", sequelize.col("alfombras.aciertos")), "promedio_aciertos"],
        [
          sequelize.fn("AVG", sequelize.literal("(alfombras.aciertos * 100.0 / alfombras.repeticiones)")),
          "porcentaje_aciertos",
        ],
        [sequelize.fn("MAX", sequelize.col("alfombras.aciertos")), "mejor_puntuacion"],
      ],
      group: ["usuario.id"],
      having: sequelize.where(sequelize.fn("COUNT", sequelize.col("alfombras.id")), ">", 0),
      order: [[sequelize.literal("porcentaje_aciertos"), "DESC"]],
      limit: Number.parseInt(limite),
      subQuery: false,
      raw: true,
    })

    res.json({
      success: true,
      data: {
        tipo: "alfombra",
        ranking: ranking.map((item, index) => ({
          posicion: index + 1,
          ...item,
          promedio_aciertos: Number.parseFloat(item.promedio_aciertos || 0).toFixed(2),
          porcentaje_aciertos: Number.parseFloat(item.porcentaje_aciertos || 0).toFixed(2),
        })),
      },
    })
  } catch (error) {
    console.error("Error al obtener ranking de alfombra:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Ranking general de reacción
export const rankingReaccion = async (req, res) => {
  try {
    const { limite = 10, rol = null } = req.query

    const whereClause = {}
    if (rol && ["entrenador", "jugador", "tecnico"].includes(rol)) {
      whereClause.rol = rol
    }

    const ranking = await usuario.findAll({
      where: whereClause,
      include: [
        {
          model: reaccion,
          as: "reacciones", // Asegúrate de que coincida con la asociación
          attributes: [],
          required: true, // INNER JOIN para solo usuarios con pruebas
        },
      ],
      attributes: [
        "id",
        "nombre",
        "apellido",
        "rol",
        "posicion",
        [sequelize.fn("COUNT", sequelize.col("reacciones.id")), "total_pruebas"],
        [sequelize.fn("AVG", sequelize.col("reacciones.aciertos")), "promedio_aciertos"],
        [sequelize.fn("AVG", sequelize.col("reacciones.tiempo_total")), "tiempo_promedio"],
        [sequelize.fn("MIN", sequelize.col("reacciones.tiempo_total")), "mejor_tiempo"],
        [sequelize.fn("MAX", sequelize.col("reacciones.aciertos")), "mejor_puntuacion"],
      ],
      group: ["usuario.id"],
      having: sequelize.where(sequelize.fn("COUNT", sequelize.col("reacciones.id")), ">", 0),
      order: [
        [sequelize.literal("promedio_aciertos"), "DESC"],
        [sequelize.literal("tiempo_promedio"), "ASC"],
      ],
      limit: Number.parseInt(limite),
      subQuery: false,
      raw: true,
    })

    res.json({
      success: true,
      data: {
        tipo: "reaccion",
        ranking: ranking.map((item, index) => ({
          posicion: index + 1,
          ...item,
          promedio_aciertos: Number.parseFloat(item.promedio_aciertos || 0).toFixed(2),
          tiempo_promedio: Number.parseFloat(item.tiempo_promedio || 0).toFixed(3),
          mejor_tiempo: Number.parseFloat(item.mejor_tiempo || 0).toFixed(3),
        })),
      },
    })
  } catch (error) {
    console.error("Error al obtener ranking de reacción:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Ranking combinado (puntuación general)
export const rankingGeneral = async (req, res) => {
  try {
    const { limite = 10, rol = null } = req.query

    const whereClause = {}
    if (rol && ["entrenador", "jugador", "tecnico"].includes(rol)) {
      whereClause.rol = rol
    }

    // Obtener usuarios con estadísticas de alfombra
    const usuariosAlfombra = await usuario.findAll({
      where: whereClause,
      include: [
        {
          model: alfombra,
          as: "alfombras",
          attributes: [],
          required: false,
        },
      ],
      attributes: [
        "id",
        "nombre",
        "apellido",
        "rol",
        "posicion",
        [sequelize.fn("COUNT", sequelize.col("alfombras.id")), "pruebas_alfombra"],
        [
          sequelize.fn("AVG", sequelize.literal("(alfombras.aciertos * 100.0 / alfombras.repeticiones)")),
          "porcentaje_alfombra",
        ],
      ],
      group: ["usuario.id"],
      subQuery: false,
      raw: true,
    })

    // Obtener usuarios con estadísticas de reacción
    const usuariosReaccion = await usuario.findAll({
      where: whereClause,
      include: [
        {
          model: reaccion,
          as: "reacciones",
          attributes: [],
          required: false,
        },
      ],
      attributes: [
        "id",
        [sequelize.fn("COUNT", sequelize.col("reacciones.id")), "pruebas_reaccion"],
        [sequelize.fn("AVG", sequelize.col("reacciones.aciertos")), "promedio_reaccion"],
        [sequelize.fn("AVG", sequelize.col("reacciones.tiempo_total")), "tiempo_promedio"],
      ],
      group: ["usuario.id"],
      subQuery: false,
      raw: true,
    })

    // Combinar resultados
    const usuariosCombinados = usuariosAlfombra.map((userAlf) => {
      const userReac = usuariosReaccion.find((ur) => ur.id === userAlf.id) || {}

      return {
        id: userAlf.id,
        nombre: userAlf.nombre,
        apellido: userAlf.apellido,
        rol: userAlf.rol,
        posicion: userAlf.posicion,
        pruebas_alfombra: userAlf.pruebas_alfombra || 0,
        porcentaje_alfombra: userAlf.porcentaje_alfombra || 0,
        pruebas_reaccion: userReac.pruebas_reaccion || 0,
        promedio_reaccion: userReac.promedio_reaccion || 0,
        tiempo_promedio: userReac.tiempo_promedio || 999,
      }
    })

    // Calcular puntuación general
    const rankingConPuntuacion = usuariosCombinados
      .filter((u) => u.pruebas_alfombra > 0 || u.pruebas_reaccion > 0)
      .map((usuario) => {
        const porcentajeAlfombra = Number.parseFloat(usuario.porcentaje_alfombra) || 0
        const promedioReaccion = Number.parseFloat(usuario.promedio_reaccion) || 0
        const tiempoPromedio = Number.parseFloat(usuario.tiempo_promedio) || 999

        // Fórmula de puntuación general (ajustable)
        const puntuacionGeneral = porcentajeAlfombra * 0.4 + promedioReaccion * 10 * 0.4 + (100 / tiempoPromedio) * 0.2

        return {
          ...usuario,
          puntuacion_general: puntuacionGeneral.toFixed(2),
          porcentaje_alfombra: porcentajeAlfombra.toFixed(2),
          promedio_reaccion: promedioReaccion.toFixed(2),
          tiempo_promedio: tiempoPromedio.toFixed(3),
        }
      })
      .sort((a, b) => Number.parseFloat(b.puntuacion_general) - Number.parseFloat(a.puntuacion_general))
      .slice(0, Number.parseInt(limite))

    res.json({
      success: true,
      data: {
        tipo: "general",
        ranking: rankingConPuntuacion.map((item, index) => ({
          posicion: index + 1,
          ...item,
        })),
      },
    })
  } catch (error) {
    console.error("Error al obtener ranking general:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}

// Comparar dos usuarios
export const compararUsuarios = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params

    // Verificar que ambos usuarios existen
    const usuarios = await usuario.findAll({
      where: {
        id: [userId1, userId2],
      },
    })

    if (usuarios.length !== 2) {
      return res.status(404).json({
        success: false,
        message: "Uno o ambos usuarios no encontrados",
      })
    }

    // Obtener estadísticas de ambos usuarios
    const estadisticasUsuarios = await Promise.all(
      [userId1, userId2].map(async (id) => {
        const estadisticasAlfombra = await alfombra.findAll({
          where: { jugador_id: id },
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "total_pruebas"],
            [sequelize.fn("AVG", sequelize.col("aciertos")), "promedio_aciertos"],
            [sequelize.fn("AVG", sequelize.literal("(aciertos * 100.0 / repeticiones)")), "porcentaje_aciertos"],
          ],
          raw: true,
        })

        const estadisticasReaccion = await reaccion.findAll({
          where: { jugador_id: id },
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("id")), "total_pruebas"],
            [sequelize.fn("AVG", sequelize.col("aciertos")), "promedio_aciertos"],
            [sequelize.fn("AVG", sequelize.col("tiempo_total")), "tiempo_promedio"],
          ],
          raw: true,
        })

        const usuarioInfo = usuarios.find((u) => u.id == id)

        return {
          usuario: {
            id: usuarioInfo.id,
            nombre: usuarioInfo.nombre,
            apellido: usuarioInfo.apellido,
            rol: usuarioInfo.rol,
          },
          alfombra: estadisticasAlfombra[0] || {
            total_pruebas: 0,
            promedio_aciertos: 0,
            porcentaje_aciertos: 0,
          },
          reaccion: estadisticasReaccion[0] || {
            total_pruebas: 0,
            promedio_aciertos: 0,
            tiempo_promedio: 0,
          },
        }
      }),
    )

    res.json({
      success: true,
      data: {
        comparacion: estadisticasUsuarios,
      },
    })
  } catch (error) {
    console.error("Error al comparar usuarios:", error)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    })
  }
}
