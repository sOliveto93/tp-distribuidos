import { DataTypes } from "sequelize";
import connection from "../config/database.js";

const Usuario = connection.define(
     "Usuario",
     {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        contrasenia: {
            type: DataTypes.STRING,
            allowNull: false
        },

        rol: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "usuarios",
        timestamps: false
    }
);
export default Usuario;