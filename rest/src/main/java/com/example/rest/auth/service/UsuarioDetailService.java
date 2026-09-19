package com.example.rest.auth.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.rest.entity.Usuario;
import com.example.rest.usuario.repository.UsuarioRepository;

@Service 
public class UsuarioDetailService implements UserDetailsService{

    private UsuarioRepository usuarioRepository;

    public UsuarioDetailService(UsuarioRepository usuarioRepository){
        this.usuarioRepository=usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("usuario con mail "+ email +" no encontrado"));
        
        return User
                .withUsername(usuario.getEmail())
                .password(usuario.getContrasenia())
                .roles(usuario.getRol().name())
                .build();

    
    }


}
