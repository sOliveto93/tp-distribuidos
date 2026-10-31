package com.example.rest.eventos.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.rest.entity.Evento;
import com.example.rest.entity.OutboxEvento;
import com.example.rest.enums.EstadoOutbox;
import com.example.rest.enums.TipoNovedad;
import com.example.rest.repository.OutboxEventoRepository;

@Service
public class OutboxService {

    private final OutboxEventoRepository outboxRepository;
    private final ObjectMapper objectMapper;

    public OutboxService(OutboxEventoRepository outboxRepository, ObjectMapper objectMapper) {
        this.outboxRepository = outboxRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public void guardarEvento(Evento evento, TipoNovedad tipoNovedad) {

        try {
            Map<String, Object> payload = new HashMap<>();

            payload.put("id", evento.getId());
            payload.put("titulo", evento.getTitulo());
            payload.put("descripcion", evento.getDescripcion());
            payload.put("fechaHora", evento.getFechaHora());
            payload.put("duracion", evento.getDuracion());
            payload.put("tipo", evento.getTipo());
            payload.put("cupoMax", evento.getCupoMax());

            OutboxEvento outbox = new OutboxEvento();

            outbox.setMessageId(UUID.randomUUID().toString());
            outbox.setTipoNovedad(tipoNovedad);
            outbox.setEventoId(evento.getId());

            if (evento.getCurador() != null) {
                outbox.setUsuarioResponsableId(evento.getCurador().getId());
            }

            outbox.setPayload(objectMapper.writeValueAsString(payload));
            outbox.setEstado(EstadoOutbox.PENDIENTE);
            outbox.setIntentos(0);
            outbox.setCreadoEn(LocalDateTime.now());
            outbox.setDisponibleEn(LocalDateTime.now());

            outboxRepository.save(outbox);

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error al serializar el evento", e);
        }
    }
}