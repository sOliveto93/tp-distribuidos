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

type eventoServer struct {
	museov1.UnimplementedEventoServiceServer
	db *sql.DB
}

func (s *obraServer) ObtenerObrasPorIds(
	ctx context.Context,
	req *museov1.ObrasPorIdsRequest,
) (*museov1.ObrasResponse, error) {

	log.Printf("IDs recibidos en la petición: %v", req.GetIds())
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
            o.id,
            o.titulo,
            COALESCE(a.nombre, ''),
            o.epoca,
            o.tecnica,
            CAST(o.anio_creacion AS CHAR),
            COALESCE(o.dimensiones, ''),
            COALESCE(o.descripcion, ''),
            COALESCE(o.ubicacion, ''),
            o.disponible
        FROM obras o
        LEFT JOIN artistas a ON o.id_artista = a.id
        WHERE (? = '' OR o.titulo LIKE CONCAT('%', ?, '%')
                       OR a.nombre LIKE CONCAT('%', ?, '%'))
          AND (? = '' OR o.epoca = ?)
          AND (? = '' OR o.tecnica = ?)
          AND (? = '' OR o.ubicacion = ?)
        ORDER BY o.id
    `

	palabra := req.GetPalabraClave()
	epoca := req.GetEpoca()
	tecnica := req.GetTecnica()
	ubicacion := req.GetUbicacion()

	filas, err := s.db.QueryContext(
		ctx,
		query,
		palabra, palabra, palabra,
		epoca, epoca,
		tecnica, tecnica,
		ubicacion, ubicacion,
	)
	if err != nil {
		return nil, err
	}
	defer filas.Close()

	respuesta := &museov1.ObrasResponse{}

	for filas.Next() {
		obra := &museov1.Obra{}

		err := filas.Scan(
			&obra.Id,
			&obra.Titulo,
			&obra.Artista,
			&obra.Epoca,
			&obra.Tecnica,
			&obra.AnioCreacion,
			&obra.Dimensiones,
			&obra.Descripcion,
			&obra.Ubicacion,
			&obra.Disponible,
		)
		if err != nil {
			return nil, err
		}

		respuesta.Obras = append(respuesta.Obras, obra)

		if req.GetCantidadMaxima() > 0 &&
			int32(len(respuesta.Obras)) >= req.GetCantidadMaxima() {
			break
		}
	}

	if err := filas.Err(); err != nil {
		return nil, err
	}

	return respuesta, nil
}

func (s *obraServer) GenerarRecorrido(
	ctx context.Context,
	req *museov1.GenerarRecorridoRequest,
) (*museov1.ObrasResponse, error) {

	log.Printf("Generando recorrido - Época: %q, Técnica: %q, Límite: %d",
		req.GetEpoca(), req.GetTecnica(), req.GetCantidadObras())

	query := `
		SELECT 
			o.id, 
			o.titulo, 
			COALESCE(a.nombre, 'Autor desconocido'), 
			o.epoca, 
			o.tecnica,
			CAST(o.anio_creacion AS CHAR), 
			COALESCE(o.dimensiones, ''), 
			COALESCE(o.descripcion, ''), 
			COALESCE(o.ubicacion, ''), 
			o.disponible
		FROM obras o
		LEFT JOIN artistas a ON o.id_artista = a.id
		WHERE (? = '' OR o.epoca = ?)
		  AND (? = '' OR o.tecnica = ?)
		ORDER BY o.id
		LIMIT ?
	`

	epoca := req.GetEpoca()
	tecnica := req.GetTecnica()
	limite := req.GetCantidadObras()

	if limite <= 0 {
		limite = 5
	}

	filas, err := s.db.QueryContext(
		ctx,
		query,
		epoca, epoca,
		tecnica, tecnica,
		limite,
	)
	if err != nil {
		return nil, err
	}
	defer filas.Close()

	var obras []*museov1.Obra
	for filas.Next() {
		var o museov1.Obra
		err := filas.Scan(
			&o.Id,
			&o.Titulo,
			&o.Artista,
			&o.Epoca,
			&o.Tecnica,
			&o.AnioCreacion,
			&o.Dimensiones,
			&o.Descripcion,
			&o.Ubicacion,
			&o.Disponible,
		)
		if err != nil {
			return nil, err
		}
		obras = append(obras, &o)
	}

	if err := filas.Err(); err != nil {
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
func (s *eventoServer) BuscarEventos(
	ctx context.Context,
	req *museov1.BuscarEventosRequest,
) (*museov1.EventosResponse, error) {

	log.Printf("Request nil: %v", req == nil)

	if req != nil {
		log.Printf("Request: %s", req.String())
		log.Printf("Epoca: %q", req.GetEpocaRelacionada())
		log.Printf("Tipo: %q", req.GetTipo())
	}

	query := `
        SELECT
            e.id,
            e.titulo,
            COALESCE(e.descripcion, ''),
            e.tipo,
            COALESCE(GROUP_CONCAT(DISTINCT o.epoca SEPARATOR ', '), '')
        FROM eventos e
        INNER JOIN evento_obra eo ON eo.id_evento = e.id
        INNER JOIN obras o ON o.id = eo.id_obra
        WHERE (? = '' OR o.epoca = ?)
          AND (? = '' OR e.tipo = ?)
        GROUP BY e.id, e.titulo, e.descripcion, e.tipo
        ORDER BY e.id
    `

	filas, err := s.db.QueryContext(
		ctx,
		query,
		req.GetEpocaRelacionada(),
		req.GetEpocaRelacionada(),
		req.GetTipo(),
		req.GetTipo(),
	)
	if err != nil {
		return nil, err
	}
	defer filas.Close()

	respuesta := &museov1.EventosResponse{}

	for filas.Next() {
		evento := &museov1.Evento{}

		err := filas.Scan(
			&evento.Id,
			&evento.Nombre,
			&evento.Descripcion,
			&evento.Tipo,
			&evento.EpocaRelacionada,
		)
		if err != nil {
			return nil, err
		}

		respuesta.Eventos = append(respuesta.Eventos, evento)
	}

	if err := filas.Err(); err != nil {
		return nil, err
	}

	return respuesta, nil
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
	museov1.RegisterEventoServiceServer(grpcServer, &eventoServer{db: db})

	log.Println("Servidor gRPC escuchando en el puerto 50051")

	log.Fatal(grpcServer.Serve(listener))
}
