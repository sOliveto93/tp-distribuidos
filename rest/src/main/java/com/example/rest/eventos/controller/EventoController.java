package com.example.rest.eventos.controller;

import com.example.rest.entity.Evento;
import com.example.rest.eventos.dto.EventoResponseDTO;
import com.example.rest.eventos.service.EventoService;
import com.example.rest.usuario.dto.UsuarioResponseDTO;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping
    public List<EventoResponseDTO> listarTodos(
            @RequestParam(required = false) String fecha,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Integer idCurador) {
            
        return eventoService.obtenerConFiltros(fecha, tipo, idCurador).stream()
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
    @PreAuthorize("hasAnyRole('CURADOR', 'ADMINISTRADOR')")
    @PostMapping
    public Evento crearEvento(@RequestBody Evento evento) {
        return eventoService.guardarEvento(evento);
    }

    // (PUT a http://localhost:8080/api/eventos/1)
    @PreAuthorize("hasAnyRole('CURADOR', 'ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> modificarEvento(@PathVariable Integer id, @RequestBody Evento eventoActualizado) {
        try {
            Evento evento = eventoService.actualizarEvento(id, eventoActualizado);
            return ResponseEntity.ok(mapearAEventoDTO(evento));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: El evento no existe o no se pudo modificar.");
        }
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
    @PreAuthorize("hasAnyRole('CURADOR', 'ADMINISTRADOR')")
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

        UsuarioResponseDTO curadorDTO = null;
        if (evento.getCurador() != null) {
            curadorDTO = UsuarioResponseDTO.builder()
                    .id(evento.getCurador().getId())
                    .nombre(evento.getCurador().getNombre())
                    .email(evento.getCurador().getEmail())
                    .rol(evento.getCurador().getRol())
                    .build();
        }

        return EventoResponseDTO.builder()
                .id(evento.getId())
                .titulo(evento.getTitulo())
                .descripcion(evento.getDescripcion())
                .fechaHora(evento.getFechaHora())
                .duracion(evento.getDuracion())
                .tipo(evento.getTipo())
                .cupoMax(evento.getCupoMax())
                .curador(curadorDTO)
                .usuarios(usuariosDTO)
                .build();
    }


}