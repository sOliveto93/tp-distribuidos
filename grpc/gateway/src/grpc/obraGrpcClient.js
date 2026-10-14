const grpc = require("@grpc/grpc-js");
const museoGrpc = require("../generated/museo_grpc_pb.js");

const obraClient = new museoGrpc.ObraServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
);

module.exports = obraClient;