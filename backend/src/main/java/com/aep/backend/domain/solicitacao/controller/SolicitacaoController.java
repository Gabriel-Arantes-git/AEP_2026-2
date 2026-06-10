package com.aep.backend.domain.solicitacao.controller;

import com.aep.backend.domain.enums.StatusSolicitacao;
import com.aep.backend.domain.solicitacao.dto.*;
import com.aep.backend.domain.solicitacao.service.SolicitacaoService;
import com.aep.backend.domain.usuario.entity.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    @PostMapping
    public ResponseEntity<SolicitacaoResponse> criar(
            @RequestBody @Valid SolicitacaoRequest req,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SolicitacaoResponse.from(solicitacaoService.criar(req, usuario)));
    }

    @PostMapping("/anonima")
    public ResponseEntity<SolicitacaoResponse> criarAnonima(@RequestBody @Valid SolicitacaoRequest req) {
        SolicitacaoRequest reqAnonima = new SolicitacaoRequest(
                req.categoriaId(), req.descricao(), req.bairro(),
                req.logradouro(), req.referencia(), true,
                req.nomeContato(), req.emailContato()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SolicitacaoResponse.from(solicitacaoService.criar(reqAnonima, null)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ATENDENTE', 'GESTOR')")
    public ResponseEntity<List<SolicitacaoResponse>> listar(
            @RequestParam(required = false) StatusSolicitacao status) {
        List<SolicitacaoResponse> lista = status != null
                ? solicitacaoService.listarPorStatus(status).stream().map(SolicitacaoResponse::from).toList()
                : solicitacaoService.listarTodas().stream().map(SolicitacaoResponse::from).toList();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/protocolo/{protocolo}")
    public ResponseEntity<SolicitacaoResponse> buscarPorProtocolo(@PathVariable String protocolo) {
        return ResponseEntity.ok(SolicitacaoResponse.from(solicitacaoService.buscarPorProtocolo(protocolo)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ATENDENTE', 'GESTOR')")
    public ResponseEntity<Void> moverStatus(
            @PathVariable Long id,
            @RequestBody @Valid MoverStatusRequest req,
            @AuthenticationPrincipal Usuario responsavel) {
        solicitacaoService.moverStatus(id, req, responsavel);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/movimentacoes")
    public ResponseEntity<List<MovimentacaoResponse>> historico(@PathVariable Long id) {
        return ResponseEntity.ok(
                solicitacaoService.buscarHistorico(id).stream().map(MovimentacaoResponse::from).toList());
    }

    @GetMapping("/{id}/logs")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<List<LogAcaoResponse>> logs(@PathVariable Long id) {
        return ResponseEntity.ok(
                solicitacaoService.buscarLogs(id).stream().map(LogAcaoResponse::from).toList());
    }
}
