package com.example.rest.reportes.dto;

public record FiltrosReporteRequestDto(

        String agruparPor,
        String estado,
        String tipo,
        String fechaInicio,
        String fechaFin) {
}
