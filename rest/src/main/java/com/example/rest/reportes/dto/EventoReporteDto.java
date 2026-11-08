package com.example.rest.reportes.dto;

import java.time.LocalDateTime;

public record EventoReporteDto (

    Integer id,
    String titulo,
    LocalDateTime fechaHora,
    String tipo,
    Integer cupoMax,
    String curador,
    Long cantidadInscriptos
) {}

