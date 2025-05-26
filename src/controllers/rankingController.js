import { usuario } from "../models/usuarios.js";
import { alfombra } from "../models/alfombra.js"
import { reaccion } from "../models/reaccion.js";
import { Sequelize as sequelize } from 'sequelize';

// Ranking general de alfombra
export const rankingAlfombra = async (req, res) => {
    try {
        const { limite = 10, rol = null } = req.query;

        let whereClause = {};
        if (rol && ['entrenador', 'jugador', 'tecnico'].includes(rol)) {
            whereClause.rol = rol;
        }

        const ranking = await usuario.findAll({
            where: whereClause,
            include: [{
                model: alfombra,
                attributes: []
            }],
            attributes: [
                'id',
                'nombre',
                'apellido',
                'rol',
                'posicion',
                [sequelize.fn('COUNT', sequelize.col('alfombras.id')), 'total_pruebas'],
                [sequelize.fn('AVG', sequelize.col('alfombras.aciertos')), 'promedio_aciertos'],
                [sequelize.fn('AVG', sequelize.literal('(alfombras.aciertos * 100.0 / alfombras.repeticiones)')), 'porcentaje_aciertos'],
                [sequelize.fn('MAX', sequelize.col('alfombras.aciertos')), 'mejor_puntuacion']
            ],
            group: ['usuario.id'],
            having: sequelize.where(sequelize.fn('COUNT', sequelize.col('alfombras.id')), '>', 0),
            order: [[sequelize.literal('porcentaje_aciertos'), 'DESC']],
            limit: parseInt(limite),
            raw: true
        });

        res.json({
            success: true,
            data: {
                tipo: 'alfombra',
                ranking: ranking.map((item, index) => ({
                    posicion: index + 1,
                    ...item,
                    promedio_aciertos: parseFloat(item.promedio_aciertos).toFixed(2),
                    porcentaje_aciertos: parseFloat(item.porcentaje_aciertos).toFixed(2)
                }))
            }
        });

    } catch (error) {
        console.error('Error al obtener ranking de alfombra:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
export const rankingReaccion = async (req, res) => {
    try {
        const { limite = 10, rol = null } = req.query;

        let whereClause = {};
        if (rol && ['entrenador', 'jugador', 'tecnico'].includes(rol)) {
            whereClause.rol = rol;
        }

        const ranking = await usuario.findAll({
            where: whereClause,
            include: [{
                model: reaccion,
                as: 'reacciones', // Asegúrate de que coincida con la asociación
                attributes: []
            }],
            attributes: [
                'id',
                'nombre',
                'apellido',
                'rol',
                'posicion',
                [sequelize.fn('COUNT', sequelize.col('reacciones.id')), 'total_pruebas'],
                [sequelize.fn('AVG', sequelize.col('reacciones.aciertos')), 'promedio_aciertos'],
                [sequelize.fn('AVG', sequelize.col('reacciones.tiempo_total')), 'tiempo_promedio'],
                [sequelize.fn('MIN', sequelize.col('reacciones.tiempo_total')), 'mejor_tiempo'],
                [sequelize.fn('MAX', sequelize.col('reacciones.aciertos')), 'mejor_puntuacion']
            ],
            group: ['usuarios.id'], // Cambiado a plural
            having: sequelize.where(sequelize.fn('COUNT', sequelize.col('reacciones.id')), '>', 0),
            order: [
                [sequelize.literal('promedio_aciertos'), 'DESC'],
                [sequelize.literal('tiempo_promedio'), 'ASC']
            ],
            limit: parseInt(limite),
            subQuery: false, // Importante para consultas complejas
            raw: true
        });

        // Resto del código...
    } catch (error) {
        // Manejo de errores...
    }
};
// Ranking combinado (puntuación general)
export const rankingGeneral = async (req, res) => {
    try {
        const { limite = 10, rol = null } = req.query;

        let whereClause = {};
        if (rol && ['entrenador', 'jugador', 'tecnico'].includes(rol)) {
            whereClause.rol = rol;
        }

        // Obtener estadísticas combinadas
        const usuarios = await usuario.findAll({
            where: whereClause,
            include: [
                {
                    model: alfombra,
                    attributes: []
                },
                {
                    model: reaccion,
                    attributes: []
                }
            ],
            attributes: [
                'id',
                'nombre',
                'apellido',
                'rol',
                'posicion',
                // Estadísticas de alfombra
                [sequelize.fn('COUNT', sequelize.col('alfombras.id')), 'pruebas_alfombra'],
                [sequelize.fn('AVG', sequelize.literal('(alfombras.aciertos * 100.0 / alfombras.repeticiones)')), 'porcentaje_alfombra'],
                // Estadísticas de reacción
                [sequelize.fn('COUNT', sequelize.col('reacciones.id')), 'pruebas_reaccion'],
                [sequelize.fn('AVG', sequelize.col('reacciones.aciertos')), 'promedio_reaccion'],
                [sequelize.fn('AVG', sequelize.col('reacciones.tiempo_total')), 'tiempo_promedio']
            ],
            group: ['usuario.id'],
            raw: true
        });

        // Calcular puntuación general (puedes ajustar la fórmula según tus necesidades)
        const rankingConPuntuacion = usuarios
            .filter(u => u.pruebas_alfombra > 0 || u.pruebas_reaccion > 0)
            .map(usuario => {
                const porcentajeAlfombra = parseFloat(usuario.porcentaje_alfombra) || 0;
                const promedioReaccion = parseFloat(usuario.promedio_reaccion) || 0;
                const tiempoPromedio = parseFloat(usuario.tiempo_promedio) || 999;
                
                // Fórmula de puntuación general (ajustable)
                const puntuacionGeneral = (
                    (porcentajeAlfombra * 0.4) + 
                    (promedioReaccion * 10 * 0.4) + 
                    ((100 / tiempoPromedio) * 0.2)
                );

                return {
                    ...usuario,
                    puntuacion_general: puntuacionGeneral.toFixed(2),
                    porcentaje_alfombra: porcentajeAlfombra.toFixed(2),
                    promedio_reaccion: promedioReaccion.toFixed(2),
                    tiempo_promedio: tiempoPromedio.toFixed(3)
                };
            })
            .sort((a, b) => parseFloat(b.puntuacion_general) - parseFloat(a.puntuacion_general))
            .slice(0, parseInt(limite));

        res.json({
            success: true,
            data: {
                tipo: 'general',
                ranking: rankingConPuntuacion.map((item, index) => ({
                    posicion: index + 1,
                    ...item
                }))
            }
        });

    } catch (error) {
        console.error('Error al obtener ranking general:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Comparar dos usuarios
export const compararUsuarios = async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;

        // Verificar que ambos usuarios existen
        const usuarios = await usuario.findAll({
            where: {
                id: [userId1, userId2]
            }
        });

        if (usuarios.length !== 2) {
            return res.status(404).json({
                success: false,
                message: 'Uno o ambos usuarios no encontrados'
            });
        }

        // Obtener estadísticas de ambos usuarios
        const estadisticasUsuarios = await Promise.all([userId1, userId2].map(async (id) => {
            const estadisticasAlfombra = await alfombra.findAll({
                where: { jugador_id: id },
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total_pruebas'],
                    [sequelize.fn('AVG', sequelize.col('aciertos')), 'promedio_aciertos'],
                    [sequelize.fn('AVG', sequelize.literal('(aciertos * 100.0 / repeticiones)')), 'porcentaje_aciertos']
                ],
                raw: true
            });

            const estadisticasReaccion = await reaccion.findAll({
                where: { jugador_id: id },
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('id')), 'total_pruebas'],
                    [sequelize.fn('AVG', sequelize.col('aciertos')), 'promedio_aciertos'],
                    [sequelize.fn('AVG', sequelize.col('tiempo_total')), 'tiempo_promedio']
                ],
                raw: true
            });

            const usuarioInfo = usuarios.find(u => u.id == id);

            return {
                usuario: {
                    id: usuarioInfo.id,
                    nombre: usuarioInfo.nombre,
                    apellido: usuarioInfo.apellido,
                    rol: usuarioInfo.rol
                },
                alfombra: estadisticasAlfombra[0] || {},
                reaccion: estadisticasReaccion[0] || {}
            };
        }));

        res.json({
            success: true,
            data: {
                comparacion: estadisticasUsuarios
            }
        });

    } catch (error) {
        console.error('Error al comparar usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};