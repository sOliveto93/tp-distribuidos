const { Router } = require("express");
const obraClient = require("../grpc/obraGrpcClient.js");
const museoMessages = require("../generated/museo_pb.js");

const obraRouter = Router();

obraRouter.get("/", (req, res) => {
    res.json({
        mensaje: "Listado de obras"
    });
});

obraRouter.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "El ID debe ser un entero positivo"
        });
    }

    const solicitud = new museoMessages.ObrasPorIdsRequest();
    solicitud.setIdsList([id]);

    obraClient.obtenerObrasPorIds(solicitud, (error, resultado) => {
        if (error) {
            return res.status(502).json({
                error: "Error al comunicarse con el servidor gRPC",
                detalle: error.message
            });
        }

        res.json(resultado.toObject());
    });
});

module.exports = obraRouter;