package com.example.rest.entity;

import java.time.LocalDateTime;

import com.example.rest.enums.EstadoOutbox;
import com.example.rest.enums.TipoNovedad;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@NoArgsConstructor 
@Getter 
@Setter 
@Table(name = "outbox_eventos")
@Entity 
public class OutboxEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_id", nullable = false, length = 36)
    private String messageId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_novedad", nullable = false, length = 30)
    private TipoNovedad tipoNovedad;

    @Column(name = "evento_id", nullable = false)
    private Integer eventoId;

    @Column(name = "usuario_responsable_id")
    private Integer usuarioResponsableId;

    @Column(name = "payload", nullable = false, columnDefinition = "json")
    private String payload;


    @Column(nullable = false)
    private Integer intentos = 0;

    @Column(name = "disponible_en", nullable = false)
    private LocalDateTime disponibleEn;

    @Column(name = "bloqueado_hasta")
    private LocalDateTime bloqueadoHasta;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    @Column(name = "enviado_en")
    private LocalDateTime enviadoEn;

    @Column(name = "ultimo_error", length = 500)
    private String ultimoError;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoOutbox estado = EstadoOutbox.PENDIENTE;
}

