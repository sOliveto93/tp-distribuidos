import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Comentario = sequelize.define(
    "Comentario",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        texto: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_obra: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "comentarios",
        timestamps: false
    }
);

export default Comentario;