package com.example.rest.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.rest.auth.dto.AuthResponse;
import com.example.rest.auth.dto.LoginRequest;
import com.example.rest.auth.dto.RegisterRequest;
import com.example.rest.auth.service.AuthService;
import com.example.rest.usuario.dto.UsuarioResponseDTO;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    
    private AuthService authService;

    public AuthController(AuthService authService){
        
        this.authService=authService;
    }
   

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping ("/me")
    public ResponseEntity<UsuarioResponseDTO> me(Authentication auth) {
        String email= auth.getName();
        System.out.println(email);
        return  ResponseEntity.ok(authService.obtenerPerfil(email));
    }
    
}
