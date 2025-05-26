import { usuario } from "../models/usuarios.js";
import { alfombra } from "../models/alfombra.js"
import { reaccion } from "../models/reaccion.js";
import { Op } from "sequelize";

// Obtener todas las pruebas de un usuario específico
export const obtenerPruebasUsuario = async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar que el usuario existe
        const usuarioExiste = await usuario.findByPk(userId);
        if (!usuarioExiste) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Obtener pruebas de alfombra
        const pruebasAlfombra = await alfombra.findAll({
            where: { jugador_id: userId },
            order: [['id', 'DESC']]
        });

        // Obtener pruebas de reacción
        const pruebasReaccion = await reaccion.findAll({
            where: { jugador_id: userId },
            order: [['id', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                usuario: {
                    id: usuarioExiste.id,
                    nombre: usuarioExiste.nombre,
                    apellido: usuarioExiste.apellido,
                    rol: usuarioExiste.rol
                },
                pruebas: {
                    alfombra: pruebasAlfombra,
                    reaccion: pruebasReaccion
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener pruebas del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener estadísticas de un usuario
export const obtenerEstadisticasUsuario = async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar que el usuario existe
        const usuarioExiste = await usuario.findByPk(userId);
        if (!usuarioExiste) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Estadísticas de alfombra
        const estadisticasAlfombra = await alfombra.findAll({
            where: { jugador_id: userId },
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_pruebas'],
                [sequelize.fn('AVG', sequelize.col('aciertos')), 'promedio_aciertos'],
                [sequelize.fn('MAX', sequelize.col('aciertos')), 'mejor_aciertos'],
                [sequelize.fn('MIN', sequelize.col('aciertos')), 'peor_aciertos'],
                [sequelize.fn('AVG', sequelize.literal('(aciertos * 100.0 / repeticiones)')), 'porcentaje_aciertos']
            ],
            raw: true
        });

        // Estadísticas de reacción
        const estadisticasReaccion = await reaccion.findAll({
            where: { jugador_id: userId },
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_pruebas'],
                [sequelize.fn('AVG', sequelize.col('aciertos')), 'promedio_aciertos'],
                [sequelize.fn('MAX', sequelize.col('aciertos')), 'mejor_aciertos'],
                [sequelize.fn('MIN', sequelize.col('aciertos')), 'peor_aciertos'],
                [sequelize.fn('AVG', sequelize.col('tiempo_total')), 'tiempo_promedio'],
                [sequelize.fn('MIN', sequelize.col('tiempo_total')), 'mejor_tiempo'],
                [sequelize.fn('MAX', sequelize.col('tiempo_total')), 'peor_tiempo']
            ],
            raw: true
        });

        // Últimas 5 pruebas de cada tipo para mostrar tendencia
        const ultimasAlfombra = await alfombra.findAll({
            where: { jugador_id: userId },
            order: [['id', 'DESC']],
            limit: 5,
            attributes: ['aciertos', 'repeticiones', 'id']
        });

        const ultimasReaccion = await reaccion.findAll({
            where: { jugador_id: userId },
            order: [['id', 'DESC']],
            limit: 5,
            attributes: ['aciertos', 'tiempo_total', 'id']
        });

        res.json({
            success: true,
            data: {
                usuario: {
                    id: usuarioExiste.id,
                    nombre: usuarioExiste.nombre,
                    apellido: usuarioExiste.apellido,
                    rol: usuarioExiste.rol
                },
                estadisticas: {
                    alfombra: {
                        ...estadisticasAlfombra[0],
                        ultimas_pruebas: ultimasAlfombra
                    },
                    reaccion: {
                        ...estadisticasReaccion[0],
                        ultimas_pruebas: ultimasReaccion
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error al obtener estadísticas del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};