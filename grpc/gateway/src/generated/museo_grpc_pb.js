// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var museo_pb = require('./museo_pb.js');

function serialize_museo_v1_BuscarEventosRequest(arg) {
  if (!(arg instanceof museo_pb.BuscarEventosRequest)) {
    throw new Error('Expected argument of type museo.v1.BuscarEventosRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_museo_v1_BuscarEventosRequest(buffer_arg) {
  return museo_pb.BuscarEventosRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_museo_v1_BuscarObrasRequest(arg) {
  if (!(arg instanceof museo_pb.BuscarObrasRequest)) {
    throw new Error('Expected argument of type museo.v1.BuscarObrasRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_museo_v1_BuscarObrasRequest(buffer_arg) {
  return museo_pb.BuscarObrasRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_museo_v1_EventosResponse(arg) {
  if (!(arg instanceof museo_pb.EventosResponse)) {
    throw new Error('Expected argument of type museo.v1.EventosResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_museo_v1_EventosResponse(buffer_arg) {
  return museo_pb.EventosResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_museo_v1_GenerarRecorridoRequest(arg) {
  if (!(arg instanceof museo_pb.GenerarRecorridoRequest)) {
    throw new Error('Expected argument of type museo.v1.GenerarRecorridoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_museo_v1_GenerarRecorridoRequest(buffer_arg) {
  return museo_pb.GenerarRecorridoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_museo_v1_ObrasPorIdsRequest(arg) {
  if (!(arg instanceof museo_pb.ObrasPorIdsRequest)) {
    throw new Error('Expected argument of type museo.v1.ObrasPorIdsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_museo_v1_ObrasPorIdsRequest(buffer_arg) {
  return museo_pb.ObrasPorIdsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_museo_v1_ObrasResponse(arg) {
  if (!(arg instanceof museo_pb.ObrasResponse)) {
    throw new Error('Expected argument of type museo.v1.ObrasResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_museo_v1_ObrasResponse(buffer_arg) {
  return museo_pb.ObrasResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_museo_v1_PreferenciasRequest(arg) {
  if (!(arg instanceof museo_pb.PreferenciasRequest)) {
    throw new Error('Expected argument of type museo.v1.PreferenciasRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_museo_v1_PreferenciasRequest(buffer_arg) {
  return museo_pb.PreferenciasRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_museo_v1_PreferenciasVisitante(arg) {
  if (!(arg instanceof museo_pb.PreferenciasVisitante)) {
    throw new Error('Expected argument of type museo.v1.PreferenciasVisitante');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_museo_v1_PreferenciasVisitante(buffer_arg) {
  return museo_pb.PreferenciasVisitante.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_museo_v1_RecomendacionRequest(arg) {
  if (!(arg instanceof museo_pb.RecomendacionRequest)) {
    throw new Error('Expected argument of type museo.v1.RecomendacionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_museo_v1_RecomendacionRequest(buffer_arg) {
  return museo_pb.RecomendacionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_museo_v1_RecomendacionResponse(arg) {
  if (!(arg instanceof museo_pb.RecomendacionResponse)) {
    throw new Error('Expected argument of type museo.v1.RecomendacionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_museo_v1_RecomendacionResponse(buffer_arg) {
  return museo_pb.RecomendacionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// ------------- Servicio de obras----------------------
//
var ObraServiceService = exports.ObraServiceService = {
  obtenerObrasPorIds: {
    path: '/museo.v1.ObraService/ObtenerObrasPorIds',
    requestStream: false,
    responseStream: false,
    requestType: museo_pb.ObrasPorIdsRequest,
    responseType: museo_pb.ObrasResponse,
    requestSerialize: serialize_museo_v1_ObrasPorIdsRequest,
    requestDeserialize: deserialize_museo_v1_ObrasPorIdsRequest,
    responseSerialize: serialize_museo_v1_ObrasResponse,
    responseDeserialize: deserialize_museo_v1_ObrasResponse,
  },
  buscarObras: {
    path: '/museo.v1.ObraService/BuscarObras',
    requestStream: false,
    responseStream: false,
    requestType: museo_pb.BuscarObrasRequest,
    responseType: museo_pb.ObrasResponse,
    requestSerialize: serialize_museo_v1_BuscarObrasRequest,
    requestDeserialize: deserialize_museo_v1_BuscarObrasRequest,
    responseSerialize: serialize_museo_v1_ObrasResponse,
    responseDeserialize: deserialize_museo_v1_ObrasResponse,
  },
  generarRecomendacion: {
    path: '/museo.v1.ObraService/GenerarRecomendacion',
    requestStream: false,
    responseStream: false,
    requestType: museo_pb.RecomendacionRequest,
    responseType: museo_pb.RecomendacionResponse,
    requestSerialize: serialize_museo_v1_RecomendacionRequest,
    requestDeserialize: deserialize_museo_v1_RecomendacionRequest,
    responseSerialize: serialize_museo_v1_RecomendacionResponse,
    responseDeserialize: deserialize_museo_v1_RecomendacionResponse,
  },
  generarRecorrido: {
    path: '/museo.v1.ObraService/GenerarRecorrido',
    requestStream: false,
    responseStream: false,
    requestType: museo_pb.GenerarRecorridoRequest,
    responseType: museo_pb.ObrasResponse,
    requestSerialize: serialize_museo_v1_GenerarRecorridoRequest,
    requestDeserialize: deserialize_museo_v1_GenerarRecorridoRequest,
    responseSerialize: serialize_museo_v1_ObrasResponse,
    responseDeserialize: deserialize_museo_v1_ObrasResponse,
  },
};

exports.ObraServiceClient = grpc.makeGenericClientConstructor(ObraServiceService, 'ObraService');
// ------------------Servicio de visitantes------------------
//
var VisitanteServiceService = exports.VisitanteServiceService = {
  obtenerPreferencias: {
    path: '/museo.v1.VisitanteService/ObtenerPreferencias',
    requestStream: false,
    responseStream: false,
    requestType: museo_pb.PreferenciasRequest,
    responseType: museo_pb.PreferenciasVisitante,
    requestSerialize: serialize_museo_v1_PreferenciasRequest,
    requestDeserialize: deserialize_museo_v1_PreferenciasRequest,
    responseSerialize: serialize_museo_v1_PreferenciasVisitante,
    responseDeserialize: deserialize_museo_v1_PreferenciasVisitante,
  },
};

exports.VisitanteServiceClient = grpc.makeGenericClientConstructor(VisitanteServiceService, 'VisitanteService');
// ------------------- Servicio de eventos---------------------
//
var EventoServiceService = exports.EventoServiceService = {
  buscarEventos: {
    path: '/museo.v1.EventoService/BuscarEventos',
    requestStream: false,
    responseStream: false,
    requestType: museo_pb.BuscarEventosRequest,
    responseType: museo_pb.EventosResponse,
    requestSerialize: serialize_museo_v1_BuscarEventosRequest,
    requestDeserialize: deserialize_museo_v1_BuscarEventosRequest,
    responseSerialize: serialize_museo_v1_EventosResponse,
    responseDeserialize: deserialize_museo_v1_EventosResponse,
  },
};

exports.EventoServiceClient = grpc.makeGenericClientConstructor(EventoServiceService, 'EventoService');
