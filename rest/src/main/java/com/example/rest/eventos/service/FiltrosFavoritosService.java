package com.example.rest.eventos.service;

import com.example.rest.entity.FiltrosFavoritos;
import com.example.rest.entity.Usuario;
import com.example.rest.repository.FiltrosFavoritosRepository;
import com.example.rest.usuario.repository.UsuarioRepository;
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

    public FiltrosFavoritos actualizarFiltro(Integer idUsuario,Integer idFiltro, FiltrosFavoritos datosNuevos) {

        FiltrosFavoritos existente = filtrosRepository
           .findByIdAndUsuarioId(idFiltro, idUsuario)
            .orElseThrow(() -> new RuntimeException("Filtro no encontrado"));
       
       /*  se cambia porque no servia segun correcciones
       FiltrosFavoritos existente = filtrosRepository.findById(idFiltro)
                .orElseThrow(() -> new RuntimeException("Filtro no encontrado"));
        */
        existente.setNombre(datosNuevos.getNombre());
        existente.setDescripcion(datosNuevos.getDescripcion());
        existente.setConfiguracionFiltros(datosNuevos.getConfiguracionFiltros());
        
        return filtrosRepository.save(existente);
    }

    public void eliminarFiltro(Integer idUsuario,Integer idFiltro) {
         FiltrosFavoritos existente = filtrosRepository
           .findByIdAndUsuarioId(idFiltro, idUsuario)
            .orElseThrow(() -> new RuntimeException("Filtro no encontrado"));
        //se elimina porque por correcciones de seguridad
            /*if (!filtrosRepository.existsById(idFiltro)) {
            throw new RuntimeException("Filtro no encontrado");
        }
            filtrosRepository.deleteById(idFiltro);
            */
        filtrosRepository.delete(existente);
        
    }
}