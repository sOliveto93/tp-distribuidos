const express = require("express");
const obraRouter = require("./routes/obraRoutes.js");

const app = express();
const puerto = 3000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "API GATEWAY del museo funcionando"
    });
});

app.use("/obras", obraRouter);

app.get("/test", (req, res) => {
    res.json({ status: "OK", servicio: "API Gateway Museo" });
});

app.listen(puerto, () => {
    console.log(`servidor levantado en el puerto ${puerto}`);
});