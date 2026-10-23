const { Router } = require("express");
const obraClient = require("../grpc/obraGrpcClient.js");
const museoMessages = require("../generated/museo_pb.js");

const obraRouter = Router();

obraRouter.get("/", (req, res) => {
    const solicitud = new museoMessages.BuscarObrasRequest();
    solicitud.setPalabraClave(req.query.q || "");
    solicitud.setEpoca(req.query.epoca || "");
    solicitud.setTecnica(req.query.tecnica || "");
    solicitud.setUbicacion(req.query.ubicacion || "");

    obraClient.buscarObras(solicitud, (error, resultado) => {
        if (error) return res.status(502).json({ error: error.message });
        res.json(resultado.toObject()); 
    });
});
obraRouter.get("/comparar", (req, res) => {
    const ids = (req.query.ids || "")
        .split(",")
        .map(Number)
        .filter(n => Number.isInteger(n) && n > 0);

    if (ids.length < 2) {
        return res.status(400).json({ error: "Seleccioná al menos 2 IDs" });
    }

    const solicitud = new museoMessages.ObrasPorIdsRequest();
    solicitud.setIdsList(ids);

    obraClient.obtenerObrasPorIds(solicitud, (error, resultado) => {
        if (error) {
            return res.status(502).json({ error: error.message });
        }
        res.json(resultado.toObject()); 
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