package com.aep.backend.domain.departamento.entity;

import com.aep.backend.domain.abstraction.DefaultEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "departamento_destino")
@Getter
@Setter
@NoArgsConstructor
public class DepartamentoDestino extends DefaultEntity {

    @Column(unique = true, nullable = false)
    private String nome;

    private String descricao;

    @Column(nullable = false)
    private boolean ativo = true;

    public DepartamentoDestino(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }
}
