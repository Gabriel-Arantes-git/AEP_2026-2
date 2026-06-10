package com.aep.backend.domain.abstraction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface DefaultCrudRepository<E extends DefaultEntity> extends JpaRepository<E, Long> {
}
