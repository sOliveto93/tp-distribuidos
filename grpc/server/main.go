package main

import (
	"context"
	"database/sql"
	"log"
	"net"
	museov1 "server/proto/museov1"

	_ "github.com/go-sql-driver/mysql"

	"google.golang.org/grpc"
)

type obraServer struct {
	museov1.UnimplementedObraServiceServer
	db *sql.DB
}

func (s *obraServer) ObtenerObrasPorIds(
	ctx context.Context,
	req *museov1.ObrasPorIdsRequest,
) (*museov1.ObrasResponse, error) {

	query := `
		SELECT o.id, o.titulo, a.nombre, o.epoca, o.tecnica, 
		       CAST(o.anio_creacion AS CHAR), o.dimensiones, 
		       COALESCE(o.descripcion, ''), o.ubicacion, o.disponible
		FROM obras o
		LEFT JOIN artistas a ON o.id_artista = a.id
		WHERE o.id = ?
	`

	var obras []*museov1.Obra

	for _, id := range req.GetIds() {
		var o museov1.Obra
		err := s.db.QueryRowContext(ctx, query, id).Scan(
			&o.Id, &o.Titulo, &o.Artista, &o.Epoca, &o.Tecnica,
			&o.AnioCreacion, &o.Dimensiones, &o.Descripcion, &o.Ubicacion, &o.Disponible,
		)

		if err != nil {
			log.Printf("Error al buscar o escanear la obra con ID %d: %v", id, err)
			continue
		}
		obras = append(obras, &o)
	}

	return &museov1.ObrasResponse{Obras: obras}, nil
}

func (s *obraServer) BuscarObras(
	ctx context.Context,
	req *museov1.BuscarObrasRequest,
) (*museov1.ObrasResponse, error) {
	query := `
		SELECT 
			o.id, o.titulo, COALESCE(a.nombre, 'Autor desconocido'), o.epoca, o.tecnica, 
			CONCAT(o.anio_creacion, ''), o.dimensiones, 
			COALESCE(o.descripcion, ''), o.ubicacion, o.disponible
		FROM obras o
		LEFT JOIN artistas a ON o.id_artista = a.id
		WHERE (? = '' OR o.epoca = ?)
		  AND (? = '' OR o.tecnica = ?)
		  AND (? = '' OR o.ubicacion = ?)
		  AND (? = '' OR o.titulo LIKE CONCAT('%', ?, '%'))
	`

	rows, err := s.db.QueryContext(ctx, query,
		req.GetEpoca(), req.GetEpoca(),
		req.GetTecnica(), req.GetTecnica(),
		req.GetUbicacion(), req.GetUbicacion(),
		req.GetPalabraClave(), req.GetPalabraClave(),
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var obras []*museov1.Obra
	for rows.Next() {
		var o museov1.Obra
		if err := rows.Scan(
			&o.Id, &o.Titulo, &o.Artista, &o.Epoca, &o.Tecnica,
			&o.AnioCreacion, &o.Dimensiones, &o.Descripcion, &o.Ubicacion, &o.Disponible,
		); err == nil {

			obras = append(obras, &o)
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return &museov1.ObrasResponse{Obras: obras}, nil
}

func (s *obraServer) GenerarRecomendacion(
	ctx context.Context,
	req *museov1.RecomendacionRequest,
) (*museov1.RecomendacionResponse, error) {

	// Una sola consulta: cruza las obras con el texto de configuracion_filtros del usuario
	query := `
		SELECT DISTINCT
			o.id, 
			o.titulo, 
			COALESCE(a.nombre, 'Autor desconocido'),
			CONCAT('Basado en tu filtro favorito: ', f.nombre)
		FROM obras o
		LEFT JOIN artistas a ON o.id_artista = a.id
		JOIN filtros_favoritos f ON (
			f.configuracion_filtros LIKE CONCAT('%"', o.epoca, '"%')
			OR f.configuracion_filtros LIKE CONCAT('%"', o.tecnica, '"%')
			OR f.configuracion_filtros LIKE CONCAT('%"', a.nombre, '"%')
		)
		WHERE f.id_usuario = ?
		LIMIT 5
	`

	rows, err := s.db.QueryContext(ctx, query, req.GetIdUsuario())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var recomendadas []*museov1.ObraRecomendada
	for rows.Next() {
		var o museov1.ObraRecomendada
		if err := rows.Scan(&o.Id, &o.Titulo, &o.Artista, &o.Motivo); err == nil {
			recomendadas = append(recomendadas, &o)
		}
	}

	return &museov1.RecomendacionResponse{Recomendadas: recomendadas}, nil
}
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

	log.Println("Servidor gRPC escuchando en el puerto 50051")

	log.Fatal(grpcServer.Serve(listener))
}
