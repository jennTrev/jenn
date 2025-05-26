import { DataTypes } from "sequelize";
import { bd } from "../database/database.js";
import { usuario } from "../models/usuarios.js"

export const alfombra = bd.define('alfombras', {
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
    repeticiones: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    aciertos: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'alfombras',
    timestamps: false,
});

// Relación con usuario
usuario.hasMany(alfombra, { foreignKey: 'jugador_id' });
alfombra.belongsTo(usuario, { foreignKey: 'jugador_id' });
