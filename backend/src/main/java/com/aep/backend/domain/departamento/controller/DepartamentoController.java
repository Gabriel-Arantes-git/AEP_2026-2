package com.aep.backend.domain.departamento.controller;

import com.aep.backend.domain.abstraction.DefaultCrudController;
import com.aep.backend.domain.departamento.entity.DepartamentoDestino;
import com.aep.backend.domain.departamento.repository.DepartamentoRepository;
import com.aep.backend.domain.departamento.service.DepartamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departamentos")
@RequiredArgsConstructor
public class DepartamentoController extends DefaultCrudController<DepartamentoService, DepartamentoRepository, DepartamentoDestino> {

    private final DepartamentoService departamentoService;

    @Override
    protected DepartamentoService getService() {
        return departamentoService;
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<DepartamentoDestino>> listarAtivos() {
        return ResponseEntity.ok(departamentoService.listarAtivos());
    }
}
