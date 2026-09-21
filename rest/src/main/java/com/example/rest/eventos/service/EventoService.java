package com.example.rest.eventos.service;

import com.example.rest.entity.Evento;
import com.example.rest.entity.Usuario;
import com.example.rest.eventos.repository.EventoRepository;
import com.example.rest.usuario.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Evento> obtenerTodos() {
        return eventoRepository.findAll();
    }

    public Evento obtenerPorId(Integer id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Evento no encontrado con ID: " + id));
    }

    public Evento guardarEvento(Evento evento) {
        return eventoRepository.save(evento);
    }

    public void eliminarEvento(Integer id) {
        eventoRepository.deleteById(id);
    }

    @Transactional 
    public Evento inscribirVisitante(Integer idEvento, Integer idUsuario) {
        Evento evento = obtenerPorId(idEvento);
        
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Error: Usuario no encontrado"));

        if (evento.getUsuarios().size() >= evento.getCupoMax()) {
            throw new RuntimeException("No se puede inscribir: El evento ya alcanzó su cupo máximo de " + evento.getCupoMax() + " personas.");
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

    public List<Evento> obtenerConFiltros(String fecha, String tipo, Integer idCurador) {
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

        return eventos;
    }
}