package com.example.rest.eventos.controller;

import com.example.rest.dto.FiltroResponseDTO;
import com.example.rest.entity.FiltrosFavoritos;
import com.example.rest.eventos.service.FiltrosFavoritosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios/{idUsuario}/filtros")
public class FiltrosFavoritosController {

    @Autowired
    private FiltrosFavoritosService filtrosService;

    private FiltroResponseDTO mapearADTO(FiltrosFavoritos filtro) {
        return FiltroResponseDTO.builder()
                .id(filtro.getId())
                .nombre(filtro.getNombre())
                .descripcion(filtro.getDescripcion())
                .configuracionFiltros(filtro.getConfiguracionFiltros())
                .build();
    }

    @GetMapping
    public List<FiltroResponseDTO> listarFiltros(@PathVariable Integer idUsuario) {
        return filtrosService.obtenerPorUsuario(idUsuario).stream()
                .map(this::mapearADTO)
                .toList();
    }

    @PostMapping
    public ResponseEntity<FiltroResponseDTO> crearFiltro(@PathVariable Integer idUsuario, @RequestBody FiltrosFavoritos filtro) {
        try {
            FiltrosFavoritos guardado = filtrosService.guardarFiltro(idUsuario, filtro);
            return ResponseEntity.ok(mapearADTO(guardado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{idFiltro}")
    public ResponseEntity<FiltroResponseDTO> actualizarFiltro(@PathVariable Integer idUsuario, @PathVariable Integer idFiltro, @RequestBody FiltrosFavoritos filtro) {
        try {
            FiltrosFavoritos actualizado = filtrosService.actualizarFiltro(idFiltro, filtro);
            return ResponseEntity.ok(mapearADTO(actualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{idFiltro}")
    public ResponseEntity<String> eliminarFiltro(@PathVariable Integer idUsuario, @PathVariable Integer idFiltro) {
        try {
            filtrosService.eliminarFiltro(idFiltro);
            return ResponseEntity.ok("El filtro favorito fue eliminado con éxito.");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Error: El filtro no fue encontrado o ya se eliminó previamente.");
        }
    }
}