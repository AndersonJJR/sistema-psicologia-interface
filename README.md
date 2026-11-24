# PsicoSafe Interface — Front-End de Gestão Clínica & Telepsicologia

Aplicação Web Single-Page Application (SPA) desenvolvida em **Angular 22**, **TypeScript Estrito** e **Tailwind CSS 4**, projetada sob o Design System *"Serene Clinical & Compliance"* e integrada à API REST `sistema-psicologia`.

---

## 1. Principais Módulos e Funcionalidades

- **Início / Dashboard Clínico & Financeiro (`/inicio`, `/inicio-e`):**
  - Indicadores em tempo real (Repasse Líquido Carnê-Leão com sparkline, Consultas Marcadas Hoje e Taxa de Assiduidade).
  - Lista de agendamentos do dia, atendimentos recentes com status de prontuário e modal de **Novo Agendamento Clínico** com fluxo integrado de **Cadastro Rápido de Paciente**.
- **Autenticação & Credenciamento Profissional (`/login`):**
  - Login JWT com RBAC (`PSICOLOGO`, `RECEPCAO`, `ADMIN`) e cadastro de psicólogo titular com validação de registro CRP.
- **Perfil do Psicólogo & Habilitação (`/perfil-profissional`, `/perfil-profissional-e`):**
  - Identificação civil, upload de foto oficial, credencial CRP/CFP, abordagem teórica e parâmetros de sala criptografada de telepsicologia.
- **Gestão e Cadastro de Pacientes (`/gestao-e-cadastro`, `/gestao-e-cadastro-e`):**
  - Prontuário cadastral com isolamento de foto por paciente, Protocolo de Segurança Mandatório para Telessaúde (Res. CFP nº 11/2018), status ativo/inativo (*Soft Delete*) e impressão de ficha cadastral.
- **Agenda Clínica Diária, Semanal e Mensal (`/agenda`, `/agenda-e`):**
  - Alternância reativa entre visões **Diária**, **Semanal** e **Mensal**, métricas de ocupação e criação de horários presenciais ou teleconsulta.
- **Atendimentos & Registro Pós-Sessão (`/painel-clinico`, `/painel-clinico-e`):**
  - Lista de sessões realizadas com pendência documental e segregação normativa (Res. CFP nº 001/2009) em duas guias: **Prontuário Psicológico Formal** e **Registro Documental Privativo (AES-256-GCM)**, com assinatura digital SHA-256 imutável.
- **Faturamento & Split de Pagamentos (`/faturamento`, `/faturamento-e`):**
  - Conciliação automática de split tributário (**30% Clínica NFS-e / 70% Psicólogo Carnê-Leão**), liquidação D+1, exportação CSV para Carnê-Leão e download de comprovante XML.
- **Portal de Privacidade, Exportação e Auditoria LGPD (`/portal-privacidade`, `/portal-privacidade-e`):**
  - Busca de titular, exportação criptográfica em lote (**PDF/A-1b ISO 19005-1 + JSON Estruturado**) e visualização em tempo real da trilha `LOGS_AUDITORIA`.

> Para detalhes completos da arquitetura de componentes e design tokens, consulte [documentation.md](file:///home/anderson/IdeaProjects/sistema-psicologia-interface/documentation.md).

---

## 2. Arquitetura Técnica & Segurança

- **Standalone Components & Lazy Loading:** Todas as rotas são carregadas sob demanda (`loadComponent`) com `ChangeDetectionStrategy.OnPush`.
- **Estado Reativo com Angular Signals:** Gerenciamento centralizado em `ClinicalStoreService`, `AuthService` e `LayoutService` usando `signal()`, `computed()` e `effect()`.
- **Segurança JWT & RBAC no Cliente:**
  - `authInterceptor`: Anexa automaticamente `Authorization: Bearer <token>` nas requisições para `/api/v1/**`.
  - `clinicalRbacGuard`: Restringe o acesso do perfil `RECEPCAO` aos módulos clínicos e de exportação LGPD.

---

## 3. Execução via Docker Compose (Full-Stack)

O projeto conta com [Dockerfile](file:///home/anderson/IdeaProjects/sistema-psicologia-interface/Dockerfile) multi-stage (Node 22 Alpine + Nginx 1.27 Alpine), [nginx.conf](file:///home/anderson/IdeaProjects/sistema-psicologia-interface/nginx.conf) configurado com proxy reverso para `/api/` e `/uploads/`, e [docker-compose.yml](file:///home/anderson/IdeaProjects/sistema-psicologia-interface/docker-compose.yml) integrado ao back-end e ao MySQL 8.4:

```bash
docker compose up --build -d
```

- **Front-End (Nginx + Angular):** `http://localhost:4200`
- **Back-End (Spring Boot API):** `http://localhost:8080`
- **MySQL 8.4:** `localhost:3306`

---

## 4. Desenvolvimento Local e Testes

### Pré-requisitos
- Node.js `20.x` ou `22.x`
- npm `10.x` ou `11.x`

### Comandos
```bash
# 1. Instalar dependências
npm install

# 2. Servidor de desenvolvimento com proxy para http://localhost:8080 (proxy.conf.json)
npm start

# 3. Build otimizado de produção (dist/sistema-psicologia-interface/browser)
npm run build

# 4. Executar suíte de testes unitários e de integração (Vitest)
npx ng test --watch=false
```
