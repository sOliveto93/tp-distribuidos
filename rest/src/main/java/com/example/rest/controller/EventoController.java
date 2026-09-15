package com.example.rest.controller;

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
    public List<Evento> listarTodos() {
        return eventoService.obtenerTodos();
    }

    // (GET a http://localhost:8080/api/eventos/1)
    @GetMapping("/{id}")
    public ResponseEntity<Evento> obtenerPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(eventoService.obtenerPorId(id));
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
        eventoService.eliminarEvento(id);
        return ResponseEntity.ok().build();
    }
}