const { Router } = require("express");
const obraClient = require("../grpc/obraGrpcClient.js");
const eventoClient = require("../grpc/eventoGrpcClient.js");
const museoMessages = require("../generated/museo_pb.js");

const exploracionRouter = Router();

exploracionRouter.get("/:movimiento", async (req, res) => {
    const movimiento = req.params.movimiento;

    const solicitudObras = new museoMessages.BuscarObrasRequest();
    solicitudObras.setEpoca(movimiento);

    const solicitudEventos = new museoMessages.BuscarEventosRequest();
    solicitudEventos.setEpocaRelacionada(movimiento);

    try {
        const [resultadoObras, resultadoEventos] = await Promise.all([
            new Promise((resolve, reject) => {
                obraClient.buscarObras(solicitudObras, (error, resultado) => {
                    if (error) return reject(error);
                    resolve(resultado.toObject());
                });
            }),
            new Promise((resolve, reject) => {
                eventoClient.buscarEventos(solicitudEventos, (error, resultado) => {
                    if (error) return reject(error);
                    resolve(resultado.toObject());
                });
            })
        ]);

        const artistasSet = new Set();
        if (resultadoObras.obrasList) {
            resultadoObras.obrasList.forEach(obra => {
                if (obra.artista) artistasSet.add(obra.artista);
            });
        }

        return res.json({
            movimiento_explorado: movimiento,
            obras_pertenecientes: resultadoObras.obrasList,
            artistas_asociados: Array.from(artistasSet),
            eventos_vinculados: resultadoEventos.eventosList
        });

    } catch (error) {
        return res.status(502).json({
            error: "Error al consultar los servicios gRPC",
            detalle: error.message
        });
    }
});

module.exports = exploracionRouter;