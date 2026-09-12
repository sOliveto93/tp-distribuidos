import "dotenv/config";
import express from "express";
import connection from "./config/database.js";

const app = express();

app.get("/", (req, res) => {
    

        res.json("todo salio bien");
    });

app.listen(3000, () => {
    console.log("Servidor escuchando en http://localhost:3000");
});