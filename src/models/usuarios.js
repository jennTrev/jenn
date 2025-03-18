import { DataTypes } from "sequelize";
import { bd } from "../database/database.js";
//sadasda
export const usuario = bd.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    altura: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    user: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    posicion: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    rol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['entrenador', 'jugador', 'tecnico']],
        },
    },
    correo: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'usuarios',
    timestamps: false,  // Esto deshabilita los campos `createdAt` y `updatedAt`
});
