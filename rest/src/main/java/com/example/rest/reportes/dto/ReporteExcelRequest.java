package com.example.rest.reportes.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ReporteExcelRequest(
        @NotBlank
        String fecha,
        @NotBlank
        String titulo,
        @NotBlank
        String curador,
        @NotNull 
        @Min(0)
        Integer inscriptos,
        @NotNull 
        @Min(1)
        Integer cupoMax,
        @NotBlank 
        String tipo
) {}

