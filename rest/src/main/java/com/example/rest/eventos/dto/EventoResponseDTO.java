package com.example.rest.eventos.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class EventoResponseDTO {
    private Integer id;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaHora;
    private Integer duracion;
    private String tipo;
    private Integer cupoMax;
    
    private List<UsuarioResponseDTO> usuarios;
}