package com.example.rest.auth.configuration;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.rest.usuario.repository.UsuarioRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Service 
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKeyString;

    private SecretKey secretKey;

    private UsuarioRepository usuarioRepository;

    private static final long EXPIRATION_MS = 3600000; // 1 hora

    public JwtService(UsuarioRepository usuarioRepository){
        this.usuarioRepository=usuarioRepository;
    }

     @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

     public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                 .claim("role", usuarioRepository.findByEmail(username).get().getRol().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }
    public boolean validateToken(String token, String username) {
        final String tokenUsername = extractClaims(token).getSubject();
        return (tokenUsername.equals(username)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
