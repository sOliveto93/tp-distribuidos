import "dotenv/config";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema/schema.js";
import { resolvers } from "./resolver/resolvers.js";
import sequelizeConnection from "./config/sequelize.js";
import mysqlConnection from "./config/mysql.js";
import "./models/associations.js"; // para cargar las relaciones desde el primer momento
import cors from "cors";
import { jwtMiddleware } from "./auth/jwtMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

try {
    await sequelizeConnection.authenticate();
    console.log("Conexión a MySQL OK");

} catch (error) {
    console.error("Error conectando a MySQL:", error);
}

app.use("/graphql", jwtMiddleware);

app.use("/graphql", graphqlHTTP((req) => ({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: {
        db: mysqlConnection,
        user: req.user
    }
})));



app.listen(4000, () => {
    console.log("Servidor escuchando en http://localhost:4000");
});