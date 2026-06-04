package com.aep.backend.infra.config;

import com.aep.backend.domain.enums.PerfilUsuario;
import com.aep.backend.domain.usuario.entity.Usuario;
import com.aep.backend.domain.usuario.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        criarUsuario("Administrador AEP", "admin@aep.gov", "00000000000", "admin123", PerfilUsuario.GESTOR);
        criarUsuario("Atendente AEP", "atendente@aep.gov", "00000000001", "atendente123", PerfilUsuario.ATENDENTE);
    }

    private void criarUsuario(String nome, String email, String cpf, String senha, PerfilUsuario perfil) {
        if (usuarioRepository.findByEmail(email).isPresent()) return;
        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setCpf(cpf);
        usuario.setSenhaHash(passwordEncoder.encode(senha));
        usuario.setPerfil(perfil);
        usuarioRepository.save(usuario);
    }
}
