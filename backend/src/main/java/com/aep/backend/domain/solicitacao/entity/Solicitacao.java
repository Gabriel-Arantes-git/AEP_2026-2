package com.aep.backend.domain.solicitacao.entity;

import com.aep.backend.domain.abstraction.DefaultEntity;
import com.aep.backend.domain.categoria.entity.Categoria;
import com.aep.backend.domain.departamento.entity.DepartamentoDestino;
import com.aep.backend.domain.enums.Prioridade;
import com.aep.backend.domain.enums.StatusSolicitacao;
import com.aep.backend.domain.usuario.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacao")
@Getter
@Setter
@NoArgsConstructor
public class Solicitacao extends DefaultEntity {

    @Column(unique = true, nullable = false)
    private String protocolo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Column(nullable = false, length = 2000)
    private String descricao;

    private String bairro;

    private String logradouro;

    private String referencia;

    private Double latitude;

    private Double longitude;

    private String cep;

    @Column(nullable = false)
    private boolean anonimo = false;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String nomeContato;

    private String emailContato;

    @Enumerated(EnumType.STRING)
    private Prioridade prioridade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao status = StatusSolicitacao.ABERTO;

    private LocalDateTime prazoAlvo;

    private LocalDateTime dataEncerramento;

    @ManyToOne
    @JoinColumn(name = "atendente_id")
    private Usuario atendente;

    @ManyToOne
    @JoinColumn(name = "departamento_id")
    private DepartamentoDestino departamento;
}
