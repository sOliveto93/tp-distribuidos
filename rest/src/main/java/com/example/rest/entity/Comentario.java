package com.example.rest.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table (name = "comentarios")
public class Comentario {

    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;
    private LocalDate fecha;
    private String texto;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn (name = "id_usuario")
    private Usuario usuario;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn (name = "id_obra")
    private Obra obra;
}
