import { DataTypes } from "sequelize";
import { bd } from "../database/database.js";
import { usuario } from "../models/usuarios.js"
export const reaccion = bd.define('reacciones', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    jugador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id',
        },
    },
    aciertos: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tiempo_total: {
        type: DataTypes.FLOAT, // tiempo en segundos
        allowNull: false,
    },
}, {
    tableName: 'reacciones',
    timestamps: false,
});

// Relación con usuario
usuario.hasMany(reaccion, { foreignKey: 'jugador_id' });
reaccion.belongsTo(usuario, { foreignKey: 'jugador_id' });
