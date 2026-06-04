package com.aep.backend.domain.log.entity;

import com.aep.backend.domain.abstraction.DefaultEntity;
import com.aep.backend.domain.usuario.entity.Usuario;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "log_acao")
@Getter
@Setter
@NoArgsConstructor
public class LogAcao extends DefaultEntity {

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(nullable = false, length = 100)
    private String acao;

    @Column(length = 100)
    private String entidade;

    private Long entidadeId;

    @Column(length = 1000)
    private String detalhes;

    public LogAcao(Usuario usuario, String acao, String entidade, Long entidadeId, String detalhes) {
        this.usuario = usuario;
        this.acao = acao;
        this.entidade = entidade;
        this.entidadeId = entidadeId;
        this.detalhes = detalhes;
    }
}
