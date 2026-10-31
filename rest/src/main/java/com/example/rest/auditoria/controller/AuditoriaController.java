package com.example.rest.auditoria.controller;

import com.example.rest.entity.Auditoria;
import com.example.rest.auditoria.repository.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
@CrossOrigin(origins = "*")
public class AuditoriaController {

    @Autowired
    private AuditoriaRepository auditoriaRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('CURADOR', 'ADMINISTRADOR')") 
    public ResponseEntity<List<Auditoria>> obtenerAuditoria() {
        return ResponseEntity.ok(auditoriaRepository.findAll());
    }
}