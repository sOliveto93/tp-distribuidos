const grpc = require("@grpc/grpc-js");
const museoGrpc = require("../generated/museo_grpc_pb.js");

const GRPC_HOST = process.env.GRPC_HOST || "127.0.0.1:50051";

const eventoClient = new museoGrpc.EventoServiceClient(
    GRPC_HOST,
    grpc.credentials.createInsecure()
);

module.exports = eventoClient;