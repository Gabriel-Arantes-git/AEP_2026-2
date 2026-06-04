package com.aep.backend.domain.solicitacao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SolicitacaoRequest(
        @NotNull Long categoriaId,
        @NotBlank String descricao,
        @NotBlank String bairro,
        String logradouro,
        String referencia,
        boolean anonimo,
        String nomeContato,
        String emailContato
) {}
