package com.example.rest.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
@Table(name = "eventos")
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String titulo;
    private String descripcion;
    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;
    private int duracion;
    private String tipo;
    @Column(name = "cupo_max")
    private int cupoMax;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_curador")
    private Usuario curador;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "evento_obra", joinColumns = @JoinColumn(name = "id_evento"), inverseJoinColumns = @JoinColumn(name = "id_obra"))
    private List<Obra> obras;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "evento_usuario", joinColumns = @JoinColumn(name = "id_evento"), inverseJoinColumns = @JoinColumn(name = "id_usuario"))
    private List<Usuario> usuarios;

}
