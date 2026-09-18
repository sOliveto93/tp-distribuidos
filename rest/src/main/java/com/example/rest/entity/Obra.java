package com.example.rest.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
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
@Table (name = "obras")
public class Obra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String titulo;
    private String descripcion;

    @Column(name = "anio_creacion")
    private LocalDate anioCreacion;
    private String epoca;
    private String tecnica;
    private String ubicacion;
    private boolean disponible;

    @Column(name = "imagen_url")
    private String imagenURL;
    private String dimensiones;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn (name = "id_artista")
    @JsonIgnore
    private Artista artista;
    
    @OneToMany (mappedBy = "obra",fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Comentario> comentarios;

    @ManyToMany (mappedBy = "obras",fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Evento> eventos;
}
