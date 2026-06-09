package com.aep.backend.domain.usuario.controller;

import com.aep.backend.domain.abstraction.DefaultCrudController;
import com.aep.backend.domain.usuario.dto.UsuarioRequest;
import com.aep.backend.domain.usuario.dto.UsuarioResponse;
import com.aep.backend.domain.usuario.entity.Usuario;
import com.aep.backend.domain.usuario.repository.UsuarioRepository;
import com.aep.backend.domain.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController extends DefaultCrudController<UsuarioService, UsuarioRepository, Usuario> {

    private final UsuarioService usuarioService;

    @Override
    protected UsuarioService getService() {
        return usuarioService;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<UsuarioResponse> cadastrar(@RequestBody @Valid UsuarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioResponse.from(usuarioService.cadastrar(request)));
    }
}
