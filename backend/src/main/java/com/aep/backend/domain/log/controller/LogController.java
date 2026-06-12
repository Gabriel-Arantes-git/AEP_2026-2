package com.aep.backend.domain.log.controller;

import com.aep.backend.domain.log.service.LogService;
import com.aep.backend.domain.solicitacao.dto.LogAcaoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;

    @GetMapping
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<List<LogAcaoResponse>> listar() {
        return ResponseEntity.ok(logService.listarTodos().stream().map(LogAcaoResponse::from).toList());
    }
}
