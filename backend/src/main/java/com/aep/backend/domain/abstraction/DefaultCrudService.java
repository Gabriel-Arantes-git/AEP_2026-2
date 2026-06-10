package com.aep.backend.domain.abstraction;

import java.util.List;
import java.util.Optional;

public abstract class DefaultCrudService<R extends DefaultCrudRepository<E>, E extends DefaultEntity> {

    protected abstract R getRepository();

    public E salvar(E entity) {
        return getRepository().save(entity);
    }

    public Optional<E> buscarPorId(Long id) {
        return getRepository().findById(id);
    }

    public List<E> listarTodos() {
        return getRepository().findAll();
    }

    public E atualizar(E entity) {
        return getRepository().save(entity);
    }

    public void deletar(Long id) {
        getRepository().findById(id).ifPresent(e -> {
            if (e instanceof Ativavel a) {
                a.setAtivo(false);
                getRepository().save(e);
            } else {
                getRepository().deleteById(id);
            }
        });
    }
}
