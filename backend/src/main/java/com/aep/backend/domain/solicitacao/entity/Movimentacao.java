package com.aep.backend.domain.solicitacao.entity;

import com.aep.backend.domain.abstraction.DefaultEntity;
import com.aep.backend.domain.enums.StatusSolicitacao;
import com.aep.backend.domain.usuario.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "movimentacao")
@Getter
@Setter
@NoArgsConstructor
public class Movimentacao extends DefaultEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "solicitacao_id")
    private Solicitacao solicitacao;

    @Enumerated(EnumType.STRING)
    private StatusSolicitacao statusAnterior;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao statusNovo;

    @Column(nullable = false, length = 2000)
    private String comentario;

    @ManyToOne
    @JoinColumn(name = "responsavel_id")
    private Usuario responsavel;

    @Column(length = 2000)
    private String justificativaAtraso;
}
