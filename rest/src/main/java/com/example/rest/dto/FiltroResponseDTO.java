package com.example.rest.dto;

import java.util.Map;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class FiltroResponseDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Map<String, Object> configuracionFiltros;
}