package com.example.rest.reportes.controller;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rest.reportes.dto.ReporteExcelRequest;
import com.example.rest.reportes.service.ExcelService;

@RestController 
@RequestMapping ("/api/reportes")
public class ReporteExcelController {

    private ExcelService excelService;

    public ReporteExcelController(ExcelService excelService){
        this.excelService=excelService;
    }

    @PostMapping ("/exportar")
    public ResponseEntity<byte[]> exportar(@RequestBody List<ReporteExcelRequest> datos){
        byte[] excel = excelService.generarExcel(datos);

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
