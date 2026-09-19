import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const FiltrosFavoritos = sequelize.define(
    "FiltroFavorito",
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
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        configuracion_filtros: {
            type: DataTypes.JSON,
            allowNull: false
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "filtros_favoritos",
        timestamps: false
    }
);

export default FiltrosFavoritos;