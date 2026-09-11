package com.example.rest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rest.dto.UsuarioResponseDTO;
import com.example.rest.entity.Usuario;
import com.example.rest.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    UsuarioRepository repo;

    @GetMapping("")
    public ResponseEntity<List<UsuarioResponseDTO>> getAll() {
        List<UsuarioResponseDTO> usuarios = repo.findAll()
                .stream()
                .map(usuario -> UsuarioResponseDTO.builder()
                        .id(usuario.getId())
                        .nombre(usuario.getNombre())
                        .email(usuario.getEmail())
                        .rol(usuario.getRol())
                        .build())
                .toList();
        return ResponseEntity.ok(usuarios);
    }
}
