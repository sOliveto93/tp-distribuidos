import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Artista = sequelize.define(
    "Artista",
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
        biografia: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "artistas",
        timestamps: false
    }
);

export default Artista;