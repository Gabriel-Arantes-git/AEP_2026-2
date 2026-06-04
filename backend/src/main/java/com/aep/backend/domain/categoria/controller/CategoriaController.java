package com.aep.backend.domain.categoria.controller;

import com.aep.backend.domain.abstraction.DefaultCrudController;
import com.aep.backend.domain.categoria.entity.Categoria;
import com.aep.backend.domain.categoria.repository.CategoriaRepository;
import com.aep.backend.domain.categoria.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
public class CategoriaController extends DefaultCrudController<CategoriaService, CategoriaRepository, Categoria> {

    private final CategoriaService categoriaService;

    @Override
    protected CategoriaService getService() {
        return categoriaService;
    }

    @GetMapping("/ativas")
    public ResponseEntity<List<Categoria>> listarAtivas() {
        return ResponseEntity.ok(categoriaService.listarAtivas());
    }
}
