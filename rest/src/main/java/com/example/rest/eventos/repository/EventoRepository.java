package com.example.rest.eventos.repository;

import com.example.rest.entity.Evento;
import com.example.rest.reportes.dto.EventoReporteDto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Integer> {

    List<Evento> findByTipo(String tipo);

    List<Evento> findByCuradorId(Integer curadorId);

    List<Evento> findByFechaHoraAfter(LocalDateTime fechaHora);

    List<Evento> findByFechaHoraBefore(LocalDateTime fechaHora);

    List<Evento> findByActivoTrue();

    List<Evento> findByActivoFalse();

    //validamos los datos y utilizamos la misma logica que grapql para obtener los eventos
    @Query("""
            SELECT new com.example.rest.reportes.dto.EventoReporteDto(
                e.id,
                e.titulo,
                e.fechaHora,
                e.tipo,
                e.cupoMax,
                u.nombre,
                COUNT(inscripto.id)
            )
            FROM Evento e
            LEFT JOIN e.curador u
            LEFT JOIN e.usuarios inscripto
            WHERE (:fechaInicio IS NULL OR e.fechaHora >= :fechaInicio)
              AND (:fechaFin IS NULL OR e.fechaHora <= :fechaFin)
              AND (:tipo IS NULL OR :tipo = '' OR e.tipo = :tipo)
              AND (:estado IS NULL OR :estado = 'TODOS'
                   OR (:estado = 'PASADOS' AND e.fechaHora < CURRENT_TIMESTAMP)
                   OR (:estado = 'FUTUROS' AND e.fechaHora >= CURRENT_TIMESTAMP))
            GROUP BY e.id, e.titulo, e.fechaHora, e.tipo, e.cupoMax, u.nombre
            """)
    List<EventoReporteDto> obtenerEventosParaExcel(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin,
            @Param("tipo") String tipo,
            @Param("estado") String estado);
}