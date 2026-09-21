package com.example.rest.reportes.service;

import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.example.rest.reportes.dto.ReporteExcelRequest;

@Service
public class ExcelService {

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
            .withZone(ZoneId.of("America/Argentina/Buenos_Aires"));

    public byte[] generarExcel(List<ReporteExcelRequest> datos) {

        try (Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();) {

            Map<String, List<ReporteExcelRequest>> eventosPorTipo = new HashMap<>();

            for (ReporteExcelRequest evento : datos) {
                String tipo = evento.tipo();

                if (!eventosPorTipo.containsKey(tipo)) {
                    eventosPorTipo.put(tipo, new ArrayList<>());
                }

                eventosPorTipo.get(tipo).add(evento);
            }
            for (Map.Entry<String, List<ReporteExcelRequest>> entrada : eventosPorTipo.entrySet()) {

                String tipo = entrada.getKey();

                String nombreHoja = tipo.replace("_", " ");

                Sheet sheet = workbook.createSheet(nombreHoja);

                crearCabecera(sheet);
                cargarEventos(sheet, entrada.getValue());
            }

            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el archivo Excel", e);
        }
    }

    private void crearCabecera(Sheet sheet) {

        Row header = sheet.createRow(0);

        header.createCell(0).setCellValue("Fecha");
        header.createCell(1).setCellValue("Titulo");
        header.createCell(2).setCellValue("Curador");
        header.createCell(3).setCellValue("Inscriptos");
        header.createCell(4).setCellValue("Cupo Maximo");
        header.createCell(5).setCellValue("% Ocupacion");
    }

    private void cargarEventos(
            Sheet sheet,
            List<ReporteExcelRequest> eventos) {

        int fila = 1;

        for (ReporteExcelRequest evento : eventos) {

            Row row = sheet.createRow(fila++);

            row.createCell(0).setCellValue(
                    formatearFecha(evento.fecha()));

            row.createCell(1).setCellValue(evento.titulo());
            row.createCell(2).setCellValue(evento.curador());

            row.createCell(3).setCellValue(
                    evento.inscriptos());

            row.createCell(4).setCellValue(
                    evento.cupoMax());

            double ocupacion;
            if (evento.cupoMax() == 0) {
                ocupacion = 0;
            } else {
                ocupacion = (double) evento.inscriptos() / evento.cupoMax() * 100;
            }
            

            row.createCell(5).setCellValue(ocupacion);
        }

        for (int i = 0; i < 6; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private String formatearFecha(String timestamp) {

        long millis = Long.parseLong(timestamp);

        return FORMATO_FECHA.format(
                Instant.ofEpochMilli(millis));
    }
}
