package com.example.rest.repository;

import com.example.rest.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Integer> {

    List<Evento> findByTipo(String tipo);

    List<Evento> findByCuradorId(Integer curadorId);

    List<Evento> findByFechaHoraAfter(LocalDateTime fechaHora);

    List<Evento> findByFechaHoraBefore(LocalDateTime fechaHora);
}