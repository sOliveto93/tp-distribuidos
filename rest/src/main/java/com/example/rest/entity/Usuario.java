package com.example.rest.entity;

import java.util.List;

import com.example.rest.enums.Rol;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor 
@AllArgsConstructor 
@Getter 
@Setter 
@Builder 
@Entity 
@Table (name = "usuarios")
public class Usuario {

    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String email;
    private String contrasenia;
    @Enumerated (EnumType.STRING)
    private Rol rol;

    @OneToMany (mappedBy = "usuario" ,fetch = FetchType.LAZY)
    @JsonIgnore
    private List<FiltrosFavoritos> filtrosFavoritos;

    @OneToMany (mappedBy = "usuario" ,fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Comentario> comentarios;
}
