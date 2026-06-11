package com.aep.backend.domain.enums.controller;

import com.aep.backend.domain.enums.Prioridade;
import com.aep.backend.domain.enums.StatusSolicitacao;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/enums")
public class EnumController {

    @GetMapping("/status-solicitacao")
    public ResponseEntity<List<String>> statusSolicitacao() {
        return ResponseEntity.ok(Arrays.stream(StatusSolicitacao.values()).map(Enum::name).toList());
    }

    @GetMapping("/prioridades")
    public ResponseEntity<List<String>> prioridades() {
        return ResponseEntity.ok(Arrays.stream(Prioridade.values()).map(Enum::name).toList());
    }
}
