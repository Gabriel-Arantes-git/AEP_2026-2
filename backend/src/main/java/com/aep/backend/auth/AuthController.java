package com.aep.backend.auth;

import com.aep.backend.auth.dto.AuthResponse;
import com.aep.backend.auth.dto.LoginRequest;
import com.aep.backend.domain.usuario.entity.Usuario;
import com.aep.backend.infra.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha()));
        String token = jwtTokenProvider.generateToken(request.email());
        Usuario usuario = (Usuario) auth.getPrincipal();
        return ResponseEntity.ok(new AuthResponse(token, usuario.getEmail(), usuario.getNome(), usuario.getPerfil().name()));
    }
}
