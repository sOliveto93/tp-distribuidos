package com.example.rest.service;

import com.example.rest.entity.FiltrosFavoritos;
import com.example.rest.entity.Usuario;
import com.example.rest.repository.FiltrosFavoritosRepository;
import com.example.rest.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FiltrosFavoritosService {

    @Autowired
    private FiltrosFavoritosRepository filtrosRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<FiltrosFavoritos> obtenerPorUsuario(Integer idUsuario) {
        return filtrosRepository.findByUsuarioId(idUsuario);
    }

    public FiltrosFavoritos guardarFiltro(Integer idUsuario, FiltrosFavoritos filtro) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        filtro.setUsuario(usuario);
        return filtrosRepository.save(filtro);
    }

    public FiltrosFavoritos actualizarFiltro(Integer idFiltro, FiltrosFavoritos datosNuevos) {
        FiltrosFavoritos existente = filtrosRepository.findById(idFiltro)
                .orElseThrow(() -> new RuntimeException("Filtro no encontrado"));
        
        existente.setNombre(datosNuevos.getNombre());
        existente.setDescripcion(datosNuevos.getDescripcion());
        existente.setConfiguracionFiltros(datosNuevos.getConfiguracionFiltros());
        
        return filtrosRepository.save(existente);
    }

    public void eliminarFiltro(Integer idFiltro) {
        if (!filtrosRepository.existsById(idFiltro)) {
            throw new RuntimeException("Filtro no encontrado");
        }
        filtrosRepository.deleteById(idFiltro);
    }
}