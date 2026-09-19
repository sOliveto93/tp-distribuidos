package com.example.rest.reportes.dto;

public record ReporteExcelRequest(
        String fecha,
        String titulo,
        String curador,
        Integer inscriptos,
        Integer cupoMax,
        String tipo
) {}

