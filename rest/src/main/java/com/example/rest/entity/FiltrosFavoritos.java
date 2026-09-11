package com.example.rest.entity;

import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
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
@Table (name = "filtros_favoritos")
public class FiltrosFavoritos {

    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String descripcion;
    
    @JdbcTypeCode (SqlTypes.JSON)
    @Column (name = "configuracion_filtros", columnDefinition = "json")
    private Map<String,Object>configuracionFiltros;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn (name = "id_usuario")
    private Usuario usuario;
}
