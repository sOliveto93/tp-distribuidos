package main

import (
	"context"
	"database/sql"
	"log"
	museov1 "server/proto/museov1"
)
type eventoServer struct {
	museov1.UnimplementedEventoServiceServer
	db *sql.DB
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
