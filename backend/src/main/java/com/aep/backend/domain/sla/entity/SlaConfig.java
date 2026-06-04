package com.aep.backend.domain.sla.entity;

import com.aep.backend.domain.abstraction.DefaultEntity;
import com.aep.backend.domain.enums.Prioridade;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sla_config")
@Getter
@Setter
@NoArgsConstructor
public class SlaConfig extends DefaultEntity {

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private Prioridade prioridade;

    @Column(nullable = false)
    private int prazoHoras;

    private String descricao;

    public SlaConfig(Prioridade prioridade, int prazoHoras, String descricao) {
        this.prioridade = prioridade;
        this.prazoHoras = prazoHoras;
        this.descricao = descricao;
    }
}
