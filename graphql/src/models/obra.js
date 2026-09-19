import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Obra = sequelize.define(
    "Obra",
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
        anio_creacion: {
            type: DataTypes.DATE,
            allowNull: true
        },
        epoca: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tecnica: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ubicacion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        disponible: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        imagen_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dimensiones: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_artista: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "obras",
        timestamps: false
    }
);

export default Obra;