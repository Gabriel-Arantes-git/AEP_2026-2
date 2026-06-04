# Sistema de Denúncias Urbanas — AEP 2026

Sistema web para registro e acompanhamento de denúncias de problemas urbanos (descarte irregular de lixo, queimadas, falhas de manutenção, etc.) e redirecionamento aos departamentos responsáveis.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 21 + Spring Boot 4.0.6 |
| Frontend | Angular 21 + TypeScript 5.9 |
| Banco de dados | H2 (in-memory) |
| Autenticação | JWT (jjwt 0.12.6) |
| Build backend | Maven (wrapper incluído) |
| Build frontend | Angular CLI 21 |

## Estrutura do projeto

```
AEP_2026-2/
├── backend/    # Spring Boot REST API
└── frontend/   # Angular SPA com SSR
```

## Pré-requisitos

- Java 21+
- Node.js 20+ e npm

## Como rodar

### Backend

```bash
cd backend
./mvnw spring-boot:run   # Linux/Mac
mvnw.cmd spring-boot:run # Windows
```

API disponível em `http://localhost:8080/api`  
Console H2 disponível em `http://localhost:8080/h2-console` (datasource: `jdbc:h2:mem:aepdb`)

### Frontend

```bash
cd frontend
npm install
npm start
```

Aplicação disponível em `http://localhost:4200`

---

## Funcionalidades

**Cidadão**
- Abertura de solicitação identificada ou anônima
- Consulta por protocolo com histórico completo de movimentações
- Cadastro de conta

**Atendente**
- Visualização da fila por status
- Triagem com definição de prioridade e encaminhamento para departamento destino (calcula prazo automaticamente via SLA)
- Atualização de status com comentário obrigatório

**Gestor**
- Painel geral com todas as solicitações
- Filtro por status
- Atualização de status e encerramento de solicitações

---

## Fluxo de Status

```
ABERTO → TRIAGEM → EM_EXECUCAO → RESOLVIDO → ENCERRADO
                ↘                            ↗
                         ENCERRADO
                   (gestor pode encerrar direto da triagem)
```

Transições seguem fluxo fixo — retroceder status não é permitido.

---

## SLA (Prazo por Prioridade)

| Prioridade | Prazo  | Uso |
|------------|--------|-----|
| BAIXA | 7 dias | Impacto local e baixo risco |
| MEDIA | 3 dias | Impacto moderado |
| ALTA | 24h | Risco à saúde ou segurança |
| CRITICA | 4h | Risco imediato — emergência |

O prazo é calculado automaticamente no momento da triagem e armazenado em `prazo_alvo` na solicitação.

---

## Protocolo

Formato: `DEN-YYYY-NNNNN` (ex.: `DEN-2026-00001`)

Gerado automaticamente na abertura. Para denúncias anônimas, é o único meio de acompanhamento.

---

## Regras de Negócio

- Denúncias anônimas exigem descrição com no mínimo 50 caracteres
- Comentário obrigatório em toda movimentação de status
- Solicitações nunca são deletadas — apenas encerradas

---

## Departamentos Destino

| Departamento | Responsabilidade |
|---|---|
| Prefeitura Municipal | Infraestrutura urbana geral |
| COPEL | Energia elétrica |
| SANEPAR | Saneamento básico |
| COMPAGAS | Distribuição de gás |
| SESP | Segurança pública |
| SEMA | Meio ambiente |

---

## Autenticação

O backend inicializa dois usuários padrão:

| E-mail | Senha | Perfil |
|--------|-------|--------|
| admin@aep.gov | admin123 | GESTOR |
| atendente@aep.gov | atendente123 | ATENDENTE |

Login retorna um JWT Bearer token com validade de 24h. O frontend armazena o token no `localStorage` e o envia automaticamente em todas as requisições via interceptor.

---

## Arquitetura do Backend

Utiliza camada de abstração genérica (`DefaultCrudController`, `DefaultCrudService`, `DefaultCrudRepository`) que padroniza operações CRUD. Novas entidades herdam dessas classes e recebem os endpoints base automaticamente.

```
domain/
├── abstraction/   # CRUD genérico (entity, repository, service, controller)
├── enums/         # PerfilUsuario, StatusSolicitacao, Prioridade
└── usuario/       # Módulo de usuários (entity, dto, repository, service, controller)

infra/
├── config/        # SecurityConfig, DataInitializer
└── security/      # JwtTokenProvider, JwtAuthFilter, UserDetailsServiceImpl
```

### Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Autenticação, retorna JWT |
| GET | `/api/usuarios` | Lista usuários |
| POST | `/api/usuarios/cadastrar` | Cadastra novo usuário |
| PUT | `/api/usuarios/{id}` | Atualiza usuário |
| DELETE | `/api/usuarios/{id}` | Remove usuário |

---

## Arquitetura do Frontend

Componentes standalone (sem NgModules), com SSR configurado via Angular Universal.

```
src/app/
├── core/
│   ├── guards/       # AuthGuard — protege rotas autenticadas
│   ├── interceptors/ # AuthInterceptor — injeta Bearer token
│   ├── models/       # Interfaces de autenticação
│   └── services/     # AuthService
└── features/
    ├── auth/login/   # Tela de login
    └── dashboard/    # Tela inicial pós-login
```

### Rotas

| Rota | Componente | Proteção |
|------|-----------|----------|
| `/login` | LoginComponent | Pública |
| `/dashboard` | DashboardComponent | AuthGuard |
| `*` | — | Redireciona para `/login` |
