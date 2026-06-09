package com.aep.backend.domain.solicitacao.dto;

import com.aep.backend.domain.solicitacao.entity.Solicitacao;

import java.time.LocalDateTime;

public record SolicitacaoResponse(
        Long id,
        String protocolo,
        String status,
        String prioridade,
        LocalDateTime dataAbertura,
        LocalDateTime prazoAlvo,
        LocalDateTime dataEncerramento,
        String descricao,
        String bairro,
        String logradouro,
        String referencia,
        boolean anonimo,
        String nomeContato,
        String emailContato,
        CategoriaInfo categoria,
        DepartamentoInfo departamento,
        UsuarioInfo atendente
) {
    public record CategoriaInfo(Long id, String nome) {}
    public record DepartamentoInfo(Long id, String nome) {}
    public record UsuarioInfo(Long id, String nome) {}

    public static SolicitacaoResponse from(Solicitacao s) {
        return new SolicitacaoResponse(
                s.getId(),
                s.getProtocolo(),
                s.getStatus().name(),
                s.getPrioridade() != null ? s.getPrioridade().name() : null,
                s.getDataCadastro(),
                s.getPrazoAlvo(),
                s.getDataEncerramento(),
                s.getDescricao(),
                s.getBairro(),
                s.getLogradouro(),
                s.getReferencia(),
                s.isAnonimo(),
                s.getNomeContato(),
                s.getEmailContato(),
                new CategoriaInfo(s.getCategoria().getId(), s.getCategoria().getNome()),
                s.getDepartamento() != null
                        ? new DepartamentoInfo(s.getDepartamento().getId(), s.getDepartamento().getNome())
                        : null,
                s.getAtendente() != null
                        ? new UsuarioInfo(s.getAtendente().getId(), s.getAtendente().getNome())
                        : null
        );
    }
}
