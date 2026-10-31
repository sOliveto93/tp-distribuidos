package com.example.rest.eventos.controller;

import com.example.rest.entity.Evento;
import com.example.rest.entity.Usuario;
import com.example.rest.eventos.dto.EventoResponseDTO;
import com.example.rest.eventos.service.EventoService;
import com.example.rest.usuario.service.UsuarioService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;
    @Autowired
    private UsuarioService usuarioService;

    private boolean noEsDueño(Integer idUsuario, Authentication authentication) {
        String emailToken = authentication.getName();
        Usuario usuarioDeLaRuta = usuarioService.obtenerPorId(idUsuario); 
        return !usuarioDeLaRuta.getEmail().equals(emailToken);
    }

    @GetMapping
    public List<EventoResponseDTO> listarTodos(
            @RequestParam(required = false) String fecha,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Integer idCurador) {
            
        return eventoService.obtenerConFiltros(fecha, tipo, idCurador);
    }

    // (GET a http://localhost:8080/api/eventos/1)
    @GetMapping("/{id}")
    public ResponseEntity<EventoResponseDTO> obtenerPorId(@PathVariable Integer id) {
        try {
            Evento evento = eventoService.obtenerPorId(id);
            return ResponseEntity.ok(eventoService.mapearAEventoDTO(evento));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // (POST a http://localhost:8080/api/eventos)
    @PreAuthorize("hasAnyRole('CURADOR', 'ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<EventoResponseDTO> crearEvento(@RequestBody Evento evento, Authentication authentication) {
        EventoResponseDTO nuevoEvento = eventoService.guardarEvento(evento,authentication.getName());
        return ResponseEntity.ok(nuevoEvento);
    }

    // (PUT a http://localhost:8080/api/eventos/1)
    @PreAuthorize("hasAnyRole('CURADOR', 'ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<?> modificarEvento(@PathVariable Integer id, @RequestBody Evento eventoActualizado, Authentication authentication) {
        try {
            EventoResponseDTO evento = eventoService.actualizarEvento(id, eventoActualizado,authentication.getName());
            return ResponseEntity.ok(evento);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Error: El evento no existe o no se pudo modificar.");
        }
    }

    // (POST a http://localhost:8080/api/eventos/1/inscribir/3)
    @PostMapping("/{idEvento}/inscribir/{idUsuario}")
    public ResponseEntity<?> inscribir(@PathVariable Integer idEvento, @PathVariable Integer idUsuario, Authentication authentication) {
        if (noEsDueño(idUsuario, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: No puedes inscribir a otro usuario.");
        }
        
        try {
            Evento eventoActualizado = eventoService.inscribirVisitante(idEvento, idUsuario);
            return ResponseEntity.ok(eventoService.mapearAEventoDTO(eventoActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // (DELETE a http://localhost:8080/api/eventos/1/desinscribir/3)
    @DeleteMapping("/{idEvento}/desinscribir/{idUsuario}")
    public ResponseEntity<?> desinscribir(@PathVariable Integer idEvento, @PathVariable Integer idUsuario, Authentication authentication) {
        if (noEsDueño(idUsuario, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: No puedes desinscribir a otro usuario.");
        }
        
        try {
            Evento eventoActualizado = eventoService.desinscribirVisitante(idEvento, idUsuario);
            return ResponseEntity.ok(eventoService.mapearAEventoDTO(eventoActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // (DELETE a http://localhost:8080/api/eventos/1)
    @PreAuthorize("hasAnyRole('CURADOR', 'ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEvento(@PathVariable Integer id, Authentication authentication) {
        try {
            eventoService.eliminarEvento(id,authentication.getName());
            return ResponseEntity.ok("El evento fue eliminado exitosamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("No se pudo eliminar: Evento no encontrado con el ID especificado.");
        }
    }

   

}