package main

import (
	"context"
	"log"
	"net"

	"google.golang.org/grpc"

	museov1 "server/proto/museov1"
)

type obraServer struct {
	museov1.UnimplementedObraServiceServer
}

func (s *obraServer) ObtenerObrasPorIds(
	ctx context.Context,
	req *museov1.ObrasPorIdsRequest,
) (*museov1.ObrasResponse, error) {

	obra := &museov1.Obra{
		Id:           1,
		Titulo:       "La noche estrellada",
		Artista:      "Vincent van Gogh",
		Epoca:        "Postimpresionismo",
		Tecnica:      "Óleo sobre lienzo",
		AnioCreacion: "1889",
		Dimensiones:  "73.7 x 92.1 cm",
		Descripcion:  "Paisaje nocturno",
		Ubicacion:    "Museo de Arte Moderno",
		Disponible:   true,
	}

	var obras []*museov1.Obra
	obras = append(obras, obra)

	respuesta := &museov1.ObrasResponse{Obras: obras}
	return respuesta, nil
}

func (s *obraServer) BuscarObras(
	ctx context.Context,
	req *museov1.BuscarObrasRequest,
) (*museov1.ObrasResponse, error) {
	respuesta := &museov1.ObrasResponse{}
	return respuesta, nil
}

func main() {
	listener, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Error al abrir el puerto: %v", err)
	}

	grpcServer := grpc.NewServer()

	museov1.RegisterObraServiceServer(grpcServer, &obraServer{})

	log.Println("Servidor gRPC escuchando en el puerto 50051")

	log.Fatal(grpcServer.Serve(listener))
}
