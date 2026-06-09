package com.aep.backend.domain.sla.controller;

import com.aep.backend.domain.sla.entity.SlaConfig;
import com.aep.backend.domain.sla.service.SlaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sla")
@RequiredArgsConstructor
public class SlaController {

    private final SlaService slaService;

    @GetMapping
    public ResponseEntity<List<SlaConfig>> listar() {
        return ResponseEntity.ok(slaService.listarTodos());
    }
}
