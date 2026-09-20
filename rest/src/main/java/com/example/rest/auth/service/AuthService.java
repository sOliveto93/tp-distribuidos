package com.example.rest.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.example.rest.auth.configuration.JwtService;
import com.example.rest.auth.dto.AuthResponse;
import com.example.rest.auth.dto.LoginRequest;
import com.example.rest.auth.dto.RegisterRequest;
import com.example.rest.entity.Usuario;
import com.example.rest.usuario.dto.UsuarioResponseDTO;
import com.example.rest.usuario.service.UsuarioService;

@Service
public class AuthService {

    private  AuthenticationManager authenticationManager;
    private  JwtService jwtService;
    private  UsuarioService usuarioService;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService,UsuarioService usuarioService) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioService=usuarioService;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        String token = jwtService.generateToken(request.getEmail());

        return new AuthResponse(token);
    }
    public AuthResponse register(RegisterRequest request){
        Usuario usuario = usuarioService.registrar(request);
        String token = jwtService.generateToken(usuario.getEmail());

        return new AuthResponse(token);
    }
    public UsuarioResponseDTO obtenerPerfil(String email){
        Usuario usuario = usuarioService.obtenerPorEmail(email);
    
        return UsuarioResponseDTO.builder()
            .id(usuario.getId())
            .nombre(usuario.getNombre())
            .email(usuario.getEmail())
            .rol(usuario.getRol())
            .build();
    }

}
