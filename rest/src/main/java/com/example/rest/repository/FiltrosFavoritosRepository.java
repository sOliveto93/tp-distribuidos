package com.example.rest.repository;

import com.example.rest.entity.FiltrosFavoritos;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FiltrosFavoritosRepository extends JpaRepository<FiltrosFavoritos, Integer> {
    List<FiltrosFavoritos> findByUsuarioId(Integer idUsuario);
}