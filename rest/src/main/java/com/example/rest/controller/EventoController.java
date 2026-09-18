package com.example.rest.controller;

import com.example.rest.dto.EventoResponseDTO;
import com.example.rest.dto.UsuarioResponseDTO;
import com.example.rest.entity.Evento;
import com.example.rest.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping
    public List<EventoResponseDTO> listarTodos() {
        return eventoService.obtenerTodos().stream()
                .map(this::mapearAEventoDTO)
                .toList();
    }

    // (GET a http://localhost:8080/api/eventos/1)
    @GetMapping("/{id}")
    public ResponseEntity<EventoResponseDTO> obtenerPorId(@PathVariable Integer id) {
        try {
            Evento evento = eventoService.obtenerPorId(id);
            return ResponseEntity.ok(mapearAEventoDTO(evento));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // (POST a http://localhost:8080/api/eventos)
    @PostMapping
    public Evento crearEvento(@RequestBody Evento evento) {
        return eventoService.guardarEvento(evento);
    }

    // (POST a http://localhost:8080/api/eventos/1/inscribir/3)
    @PostMapping("/{idEvento}/inscribir/{idUsuario}")
    public ResponseEntity<?> inscribir(@PathVariable Integer idEvento, @PathVariable Integer idUsuario) {
        try {
            Evento eventoActualizado = eventoService.inscribirVisitante(idEvento, idUsuario);
            return ResponseEntity.ok(eventoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // (DELETE a http://localhost:8080/api/eventos/1/desinscribir/3)
    @DeleteMapping("/{idEvento}/desinscribir/{idUsuario}")
    public ResponseEntity<?> desinscribir(@PathVariable Integer idEvento, @PathVariable Integer idUsuario) {
        try {
            Evento eventoActualizado = eventoService.desinscribirVisitante(idEvento, idUsuario);
            return ResponseEntity.ok(eventoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // (DELETE a http://localhost:8080/api/eventos/1)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEvento(@PathVariable Integer id) {
        try {
            eventoService.eliminarEvento(id);
            return ResponseEntity.ok("El evento fue eliminado exitosamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("No se pudo eliminar: Evento no encontrado con el ID especificado.");
        }
    }

    private EventoResponseDTO mapearAEventoDTO(Evento evento) {
        List<UsuarioResponseDTO> usuariosDTO = evento.getUsuarios().stream()
                .map(u -> UsuarioResponseDTO.builder()
                        .id(u.getId())
                        .nombre(u.getNombre())
                        .email(u.getEmail())
                        .rol(u.getRol())
                        .build())
                .toList();

        return EventoResponseDTO.builder()
                .id(evento.getId())
                .titulo(evento.getTitulo())
                .descripcion(evento.getDescripcion())
                .fechaHora(evento.getFechaHora())
                .duracion(evento.getDuracion())
                .tipo(evento.getTipo())
                .cupoMax(evento.getCupoMax())
                .usuarios(usuariosDTO)
                .build();
    }
}