import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Evento = sequelize.define(
    "Evento",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fecha_hora: {
            type: DataTypes.DATE,
            allowNull: false
        },
        duracion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cupo_max: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_curador: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "eventos",
        timestamps: false
    }
);

export default Evento;