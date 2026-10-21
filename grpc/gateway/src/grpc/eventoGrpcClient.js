
const grpc = require("@grpc/grpc-js");
const museoGrpc = require("../generated/museo_grpc_pb.js");

const eventoClient = new museoGrpc.EventoServiceClient(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

module.exports = eventoClient;
