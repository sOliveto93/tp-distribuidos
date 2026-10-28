package main

import (
	"database/sql"
	"log"
	"net"
	museov1 "server/proto/museov1"

	_ "github.com/go-sql-driver/mysql"

	"google.golang.org/grpc"
)

func main() {
	dsn := "root:root@tcp(localhost:3307)/museo?parseTime=true"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error abriendo conexión a BD: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("No se pudo conectar a la base de datos: %v", err)
	}
	log.Println("Conectado exitosamente a la base de datos 'museo'")
	listener, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Error al abrir el puerto: %v", err)
	}

	grpcServer := grpc.NewServer()

	museov1.RegisterObraServiceServer(grpcServer, &obraServer{db: db})
	museov1.RegisterEventoServiceServer(grpcServer, &eventoServer{db: db})

	log.Println("Servidor gRPC escuchando en el puerto 50051")

	log.Fatal(grpcServer.Serve(listener))
}
