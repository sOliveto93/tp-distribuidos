package com.example.rest.eventos.controller;

import com.example.rest.dto.FiltroResponseDTO;
import com.example.rest.entity.FiltrosFavoritos;
import com.example.rest.entity.Usuario;
import com.example.rest.eventos.service.FiltrosFavoritosService;
import com.example.rest.usuario.service.UsuarioService; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios/{idUsuario}/filtros")
public class FiltrosFavoritosController {

    @Autowired
    private FiltrosFavoritosService filtrosService;

    @Autowired
    private UsuarioService usuarioService;

    private FiltroResponseDTO mapearADTO(FiltrosFavoritos filtro) {
        return FiltroResponseDTO.builder()
            .id(filtro.getId())
            .nombre(filtro.getNombre())
            .descripcion(filtro.getDescripcion())
            .configuracionFiltros(filtro.getConfiguracionFiltros())
            .build();
    }

    // --- ESCUDO DE SEGURIDAD ---
    private boolean noEsDueño(Integer idUsuario, Authentication authentication) {
        String emailToken = authentication.getName();
        Usuario usuarioDeLaRuta = usuarioService.obtenerPorId(idUsuario); 
        
        return !usuarioDeLaRuta.getEmail().equals(emailToken);
    }

    @GetMapping
    public ResponseEntity<?> listarFiltros(@PathVariable Integer idUsuario, Authentication authentication) {
        if (noEsDueño(idUsuario, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: No puedes ver filtros de otro usuario.");
        }

        List<FiltroResponseDTO> filtros = filtrosService.obtenerPorUsuario(idUsuario).stream()
                .map(this::mapearADTO)
                .toList();
        return ResponseEntity.ok(filtros);
    }

    @PostMapping
    public ResponseEntity<?> crearFiltro(@PathVariable Integer idUsuario, @RequestBody FiltrosFavoritos filtro, Authentication authentication) {
        if (noEsDueño(idUsuario, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: No puedes crear filtros para otro usuario.");
        }

        try {
            FiltrosFavoritos guardado = filtrosService.guardarFiltro(idUsuario, filtro);
            return ResponseEntity.ok(mapearADTO(guardado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{idFiltro}")
    public ResponseEntity<?> actualizarFiltro(@PathVariable Integer idUsuario, @PathVariable Integer idFiltro, @RequestBody FiltrosFavoritos filtro, Authentication authentication) {
        if (noEsDueño(idUsuario, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: No puedes modificar filtros de otro usuario.");
        }

        try {
            FiltrosFavoritos actualizado = filtrosService.actualizarFiltro(idFiltro, filtro);
            return ResponseEntity.ok(mapearADTO(actualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{idFiltro}")
    public ResponseEntity<String> eliminarFiltro(@PathVariable Integer idUsuario, @PathVariable Integer idFiltro, Authentication authentication) {
        if (noEsDueño(idUsuario, authentication)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado: No puedes eliminar filtros de otro usuario.");
        }

        try {
            filtrosService.eliminarFiltro(idFiltro);
            return ResponseEntity.ok("El filtro favorito fue eliminado con éxito.");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Error: El filtro no fue encontrado o ya se eliminó previamente.");
        }
    }
}