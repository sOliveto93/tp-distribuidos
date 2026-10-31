package com.example.rest.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.rest.entity.OutboxEvento;

public interface OutboxEventoRepository extends JpaRepository<OutboxEvento,Long> { 

}
