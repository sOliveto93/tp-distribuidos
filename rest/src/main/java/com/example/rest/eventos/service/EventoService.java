package com.example.rest.eventos.service;

import com.example.rest.entity.Evento;
import com.example.rest.entity.Usuario;
import com.example.rest.enums.TipoNovedad;
import com.example.rest.eventos.dto.EventoResponseDTO;
import com.example.rest.eventos.repository.EventoRepository;
import com.example.rest.usuario.dto.UsuarioResponseDTO;
import com.example.rest.usuario.repository.UsuarioRepository;
import com.example.rest.usuario.service.UsuarioService;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Map;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private OutboxService outboxService;

    @Autowired 
    private UsuarioService usuarioService;

    public List<Evento> obtenerTodos() {
        return eventoRepository.findAll();
    }

    public Evento obtenerPorId(Integer id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Evento no encontrado con ID: " + id));
    }

    @Transactional
    public EventoResponseDTO guardarEvento(Evento evento,String username) {
        Evento eventoNuevo = eventoRepository.save(evento);
        Usuario responsable = usuarioService.obtenerPorEmail(username);
        outboxService.guardarEvento(eventoNuevo, TipoNovedad.EVENTO_CREADO,responsable.getId());

        return mapearAEventoDTO(eventoNuevo);

    }

    @Transactional
    public EventoResponseDTO actualizarEvento(Integer id, Evento eventoActualizado,String username) {
        Evento eventoExistente = obtenerPorId(id);

        Map<String, Object> datosAnteriores = outboxService.obtenerDatosEvento(eventoExistente);

        eventoExistente.setTitulo(eventoActualizado.getTitulo());
        eventoExistente.setDescripcion(eventoActualizado.getDescripcion());
        eventoExistente.setFechaHora(eventoActualizado.getFechaHora());
        eventoExistente.setDuracion(eventoActualizado.getDuracion());
        eventoExistente.setTipo(eventoActualizado.getTipo());
        eventoExistente.setCupoMax(eventoActualizado.getCupoMax());

        if (eventoActualizado.getCurador() != null) {
            eventoExistente.setCurador(eventoActualizado.getCurador());
        }

        Evento eventoGuardado = eventoRepository.save(eventoExistente);

        Usuario responsable = usuarioService.obtenerPorEmail(username);

        outboxService.guardarEventoModificado(eventoGuardado, datosAnteriores,responsable.getId());

        return mapearAEventoDTO(eventoGuardado);
    }

    //revisar esto es baja logica por si piden que se cancele simplemente logicamente
    @Transactional
    public void eliminarEvento(Integer id,String username) {
        
        Evento evento = obtenerPorId(id);

        Usuario responsable = usuarioService.obtenerPorEmail(username);
        outboxService.guardarEvento(evento, TipoNovedad.EVENTO_CANCELADO,responsable.getId());

        eventoRepository.delete(evento);
    }

    @Transactional
    public Evento inscribirVisitante(Integer idEvento, Integer idUsuario) {
        Evento evento = obtenerPorId(idEvento);

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Error: Usuario no encontrado"));

        if (evento.getUsuarios().size() >= evento.getCupoMax()) {
            throw new RuntimeException("No se puede inscribir: El evento ya alcanzó su cupo máximo de "
                    + evento.getCupoMax() + " personas.");
        }

        if (evento.getUsuarios().contains(usuario)) {
            throw new RuntimeException("El usuario ya se encuentra inscripto en este evento.");
        }

        evento.getUsuarios().add(usuario);
        return eventoRepository.save(evento);
    }

    @Transactional
    public Evento desinscribirVisitante(Integer idEvento, Integer idUsuario) {
        Evento evento = obtenerPorId(idEvento);
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Error: Usuario no encontrado"));

        evento.getUsuarios().remove(usuario);
        return eventoRepository.save(evento);
    }

    public List<EventoResponseDTO> obtenerConFiltros(String fecha, String tipo, Integer idCurador) {
        List<Evento> eventos = eventoRepository.findAll();

        if (tipo != null && !tipo.isEmpty()) {
            eventos = eventos.stream()
                    .filter(e -> e.getTipo().equalsIgnoreCase(tipo))
                    .toList();
        }

        if (idCurador != null) {
            eventos = eventos.stream()
                    .filter(e -> e.getCurador() != null && e.getCurador().getId().equals(idCurador))
                    .toList();
        }

        if (fecha != null && !fecha.isEmpty()) {
            eventos = eventos.stream()
                    .filter(e -> e.getFechaHora().toLocalDate().toString().equals(fecha))
                    .toList();
        }

        return eventos.stream()
                .map(this::mapearAEventoDTO)
                .toList();
    }


public EventoResponseDTO mapearAEventoDTO(Evento evento) {
    List<UsuarioResponseDTO> usuariosDTO = evento.getUsuarios() == null
            ? List.of()
            : evento.getUsuarios().stream()
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