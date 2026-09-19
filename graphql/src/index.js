import "dotenv/config";
import express from "express";
import { graphql } from "graphql";
import { schema } from "./schema/schema.js";
import { resolvers } from "./resolver/resolvers.js";
import connection from "./config/database.js";
import "./models/associations.js"; // para cargar las relaciones desde el primer momento
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

try {
    await connection.authenticate();
    console.log("Conexión a MySQL OK");

} catch (error) {
    console.error("Error conectando a MySQL:", error);
}
app.post("/graphql",async(req,res)=>{
    const result = await graphql({
        schema,
        source:req.body.query,
        variableValues: req.body.variables,
        rootValue:resolvers,
        //ya no es necesario por migrar a sequelize
        contextValue:{
            db:connection
        }
    });

    res.json(result);
});


app.listen(4000, () => {
    console.log("Servidor escuchando en http://localhost:4000");
});