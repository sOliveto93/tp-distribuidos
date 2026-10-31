
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
    public void guardarEvento(Evento evento, TipoNovedad tipoNovedad, Integer usuarioResponsableId) {

        try {
            Map<String, Object> payload = obtenerDatosEvento(evento);

            guardarOutbox(evento, tipoNovedad, usuarioResponsableId, payload);

        } catch (JsonProcessingException e) {
            throw new RuntimeException(
                    "Error al serializar el evento", e);
        }
    }

    @Transactional
    public void guardarEventoModificado(Evento evento, Map<String, Object> datosAnteriores,
            Integer usuarioResponsableId) {

        try {
            Map<String, Object> payload = new HashMap<>();

            payload.put("antes", datosAnteriores);
            payload.put("despues", obtenerDatosEvento(evento));

            guardarOutbox(evento, TipoNovedad.EVENTO_MODIFICADO, usuarioResponsableId, payload);

        } catch (JsonProcessingException e) {
            throw new RuntimeException(
                    "Error al serializar la modificación del evento", e);
        }
    }

    private void guardarOutbox(Evento evento, TipoNovedad tipoNovedad, Integer usuarioResponsableId,
            Map<String, Object> payload) throws JsonProcessingException {

        LocalDateTime ahora = LocalDateTime.now();

        OutboxEvento outbox = new OutboxEvento();

        outbox.setMessageId(UUID.randomUUID().toString());
        outbox.setTipoNovedad(tipoNovedad);
        outbox.setEventoId(evento.getId());
        outbox.setUsuarioResponsableId(usuarioResponsableId);
        outbox.setPayload(objectMapper.writeValueAsString(payload));
        outbox.setEstado(EstadoOutbox.PENDIENTE);
        outbox.setIntentos(0);
        outbox.setCreadoEn(ahora);
        //por las dudas si queremos que se espere para su publicacion en un futuro
        outbox.setDisponibleEn(ahora);

        outboxRepository.save(outbox);
    }

    public Map<String, Object> obtenerDatosEvento(Evento evento) {

        Map<String, Object> datos = new HashMap<>();

        datos.put("id", evento.getId());
        datos.put("titulo", evento.getTitulo());
        datos.put("descripcion", evento.getDescripcion());
        datos.put("fechaHora", evento.getFechaHora());
        datos.put("duracion", evento.getDuracion());
        datos.put("tipo", evento.getTipo());
        datos.put("cupoMax", evento.getCupoMax());

        if (evento.getCurador() != null) {
            datos.put("curadorId", evento.getCurador().getId());
        }

        return datos;
    }
}
