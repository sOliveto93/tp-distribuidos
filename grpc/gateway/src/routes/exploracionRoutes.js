
const { Router } = require("express");
const obraClient = require("../grpc/obraGrpcClient.js");
const eventoClient = require("../grpc/eventoGrpcClient.js");
const museoMessages = require("../generated/museo_pb.js");

const exploracionRouter = Router();

exploracionRouter.get("/", async (req, res) => {
    const {
        palabra_clave = "",
        epoca = "",
        tecnica = "",
        ubicacion = "",
        tipo = "",
        cantidad_maxima = ""
    } = req.query;

    if (
        cantidad_maxima !== "" &&
        (!Number.isInteger(Number(cantidad_maxima)) ||
            Number(cantidad_maxima) <= 0)
    ) {
        return res.status(400).json({
            error: "cantidad_maxima debe ser un entero positivo"
        });
    }

    const solicitudObras = new museoMessages.BuscarObrasRequest();
    solicitudObras.setPalabraClave(palabra_clave);
    solicitudObras.setEpoca(epoca);
    solicitudObras.setTecnica(tecnica);
    solicitudObras.setUbicacion(ubicacion);

    if (cantidad_maxima !== "") {
        solicitudObras.setCantidadMaxima(Number(cantidad_maxima));
    }

    const solicitudEventos = new museoMessages.BuscarEventosRequest();
    solicitudEventos.setEpocaRelacionada(epoca);
    solicitudEventos.setTipo(tipo);

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

        return res.json({
            filtros: {
                palabra_clave,
                epoca,
                tecnica,
                ubicacion,
                tipo,
                cantidad_maxima:
                    cantidad_maxima === "" ? null : Number(cantidad_maxima)
            },
            obras: resultadoObras.obrasList,
            eventos: resultadoEventos.eventosList
        });
    } catch (error) {
        return res.status(502).json({
            error: "Error al consultar los servicios gRPC",
            detalle: error.message
        });
    }
});

module.exports = exploracionRouter;
