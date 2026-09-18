import "dotenv/config";
import express from "express";
import { graphql } from "graphql";
import { schema } from "./schema/schema.js";
import { resolvers } from "./resolver/resolvers.js";
import connection from "./config/database.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

app.post("/graphql",async(req,res)=>{
    const result = await graphql({
        schema,
        source:req.body.query,
        variableValues: req.body.variables,
        rootValue:resolvers,
        contextValue:{
            db:connection
        }
    });

    res.json(result);
});


app.listen(4000, () => {
    console.log("Servidor escuchando en http://localhost:4000");
});