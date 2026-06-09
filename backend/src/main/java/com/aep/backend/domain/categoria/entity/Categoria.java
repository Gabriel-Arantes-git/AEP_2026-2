package com.aep.backend.domain.categoria.entity;

import com.aep.backend.domain.abstraction.Ativavel;
import com.aep.backend.domain.abstraction.DefaultEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categoria")
@Getter
@Setter
@NoArgsConstructor
public class Categoria extends DefaultEntity implements Ativavel {

    @Column(unique = true, nullable = false)
    private String nome;

    private String descricao;

    @Column(nullable = false)
    private boolean ativo = true;

    public Categoria(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }
}
