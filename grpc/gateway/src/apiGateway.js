const express = require("express");
const cors = require("cors");
const obraRouter = require("./routes/obraRoutes.js");
const exploracionRouter = require("./routes/exploracionRoutes.js");

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
app.use("/exploracion", exploracionRouter);

app.listen(puerto, () => {
    console.log(`servidor levantado en el puerto ${puerto}`);
});