package com.example.rest.usuario.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.rest.auth.dto.RegisterRequest;
import com.example.rest.auth.exception.EmailYaRegistradoException;
import com.example.rest.auth.exception.UsuarioNoEncontradoException;
import com.example.rest.entity.Usuario;
import com.example.rest.enums.Rol;
import com.example.rest.usuario.repository.UsuarioRepository;

@Service
public class UsuarioService {


    UsuarioRepository usuarioRepository;
    private  PasswordEncoder passwordEncoder;
    public UsuarioService(UsuarioRepository usuarioRepository,PasswordEncoder passwordEncoder){
        this.usuarioRepository=usuarioRepository;
        this.passwordEncoder=passwordEncoder;
    }


    public Usuario obtenerPorEmail(String email){
        return usuarioRepository.findByEmail(email).orElseThrow(
            () -> new UsuarioNoEncontradoException("No se encontró usuario con ese email")
        );
    }


    public Usuario registrar(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new EmailYaRegistradoException(
                    "El email ya está registrado");
        }

        Usuario usuario = new Usuario();

        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setContrasenia(
                passwordEncoder.encode(request.getPassword()));
        usuario.setRol(Rol.VISITANTE);

        return usuarioRepository.save(usuario);
    }
}
