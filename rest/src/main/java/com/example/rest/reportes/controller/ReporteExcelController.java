package com.example.rest.reportes.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rest.reportes.dto.FiltrosReporteRequestDto;
import com.example.rest.reportes.dto.ReporteExcelRequest;
import com.example.rest.reportes.service.ExcelService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@SecurityRequirement(name = "bearerAuth")
@RestController 
@RequestMapping ("/api/reportes")
public class ReporteExcelController {

    private ExcelService excelService;

    public ReporteExcelController(ExcelService excelService){
        this.excelService=excelService;
    }
//revisar no solo validacion por dto 
// considerar recibir identificadores de recursos, consumirlos desde bd y validar que el usuario 
//mediante authentication tenga permisos para consumirlos antes de crear el excel
    @PreAuthorize("hasAnyRole('CURADOR', 'ADMINISTRADOR')")
    @PostMapping ("/exportar")
    public ResponseEntity<byte[]> exportar(@Valid @RequestBody FiltrosReporteRequestDto filtros){
        byte[] excel = excelService.generarExcelConFiltros(filtros);

        return ResponseEntity.ok()
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=reporte.xlsx"
                )
                .contentType(
                    MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    )
                )
                .body(excel);
    }
}
