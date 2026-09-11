package com.example.rest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class RestApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestApplication.class, args);
		
		
	}
@EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        System.out.println("=== MUSEO - SPRING BOOT LEVANTADO ===");
    }
}
