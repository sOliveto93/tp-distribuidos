package com.example.rest.dto;

import com.example.rest.enums.Rol;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UsuarioResponseDTO {
    private Integer id;
    private String nombre;
    private String email;
    private Rol rol;
}
