# Documentação Técnica — Sistema de Gestão Clínica & Telepsicologia (PsicoSafe)

Este documento descreve a arquitetura Front-end, o mapeamento completo de rotas e módulos em relação aos protótipos da pasta `interfaces/`, as instruções de execução local e as diretrizes de manutenibilidade da aplicação **PsicoSafe**.

---

## 1. Visão Geral da Arquitetura Front-end

A aplicação foi projetada sobre o ecossistema moderno do **Angular (Standalone Components)**, **TypeScript Estrito (`strict: true`)** e **Tailwind CSS**, seguindo os princípios **SOLID**, **DRY (Don't Repeat Yourself)** e **Clean Architecture** orientada a domínios/features.

### 1.1 Organização de Diretórios

```text
src/
├── index.html                  # Tipografia Plus Jakarta Sans e Material Symbols Outlined
├── styles.css                  # Design Tokens (@theme) Serene Clinical & Compliance + Tailwind CSS
└── app/
    ├── app.config.ts           # Configuração global de provedores e roteamento
    ├── app.routes.ts           # Definição de rotas com Lazy Loading (loadComponent)
    ├── core/                   # Camada de Domínio Central e Estado Reativo (Singleton)
    │   ├── models/             # Interfaces e Types estritos (zero uso de any)
    │   │   ├── agenda.model.ts
    │   │   ├── auth.model.ts
    │   │   ├── billing.model.ts
    │   │   ├── clinical-session.model.ts
    │   │   ├── navigation.model.ts
    │   │   ├── patient.model.ts
    │   │   ├── privacy.model.ts
    │   │   └── profile.model.ts
    │   └── services/           # Serviços reativos baseados em Angular Signals
    │       ├── clinical-store.service.ts
    │       └── layout.service.ts
    ├── shared/                 # Componentes Atômicos Reutilizáveis e Shell de Layout
    │   ├── components/
    │   │   ├── badge/
    │   │   │   └── status-badge.component.ts
    │   │   ├── modal/
    │   │   │   └── modal-shell.component.ts
    │   │   ├── sidebar/
    │   │   │   └── sidebar.component.ts
    │   │   ├── toast/
    │   │   │   └── toast-notification.component.ts
    │   │   └── topbar/
    │   │       └── topbar.component.ts
    │   └── layout/
    │       └── app-shell.component.ts
    └── features/               # Módulos de Negócio Isolados (Smart vs. Dumb Components)
        ├── auth/               # Autenticação e Credenciamento Clínico (e-Psi)
        │   ├── components/
        │   └── containers/
        ├── profile/            # Perfil do Psicólogo e Habilitação Profissional
        │   ├── components/
        │   └── containers/
        ├── patients/           # Gestão, Cadastro e Protocolo de Segurança de Pacientes
        │   ├── components/
        │   └── containers/
        ├── agenda/             # Agenda Clínica Semanal, Métricas e Novo Agendamento
        │   ├── components/
        │   └── containers/
        ├── clinical-panel/     # Painel de Atendimento Clínico, Prontuário CFP e Assinatura
        │   ├── components/
        │   └── containers/
        ├── billing/            # Gestão Financeira, Split Bancário (30%/70%) e Recibos
        │   ├── components/
        │   └── containers/
        └── privacy/            # Portal de Privacidade, Portabilidade HL7 FHIR e LGPD
            ├── components/
            └── containers/
```

### 1.2 Padrões Arquiteturais Adotados

1. **Segregação Smart vs. Dumb Components:**
   - **Smart Components (`containers/`):** Conectam-se aos serviços de estado (`ClinicalStoreService`, `LayoutService`) via `inject()`, gerenciam instâncias de `FormGroup` reativos, coordenam navegação e repassam dados para componentes filhos.
   - **Dumb/Presentational Components (`components/`):** Recebem dados exclusivamente via Signal Inputs (`input()`, `input.required()`) e emitem intenções de interação via Signal Outputs (`output()`), utilizando `ChangeDetectionStrategy.OnPush`.
2. **Reatividade com Signals (`signal`, `computed`, `effect`):**
   - Todo o estado da interface (modo de recolhimento da barra lateral, cálculos de split 30%/70%, filtros de faturamento, cronômetro de sessão, selagem imutável do prontuário e notificações Toast) é gerenciado de forma declarativa e síncrona com Signals.
3. **Formulários Reativos Tipados (`ReactiveFormsModule`):**
   - Todos os formulários utilizam `FormGroup<T>` com controles estritamente tipados (`FormControl<string>`, `FormControl<boolean>`, etc., com `nonNullable: true`), validadores síncronos (`Validators.required`, `Validators.email`, `Validators.minLength`, `Validators.min`) e feedback visual acessível (`role="alert"`).
4. **Design System "Serene Clinical & Compliance":**
   - A paleta de cores (`#005c55` Primary Deep Clinical Teal, `#006c4a` Secondary Therapeutic Emerald, `#324c9c` Tertiary Deep Slate Royal, `#ba1a1a` Protocol Emergency Crimson e superfícies tonais `#f8f9ff` a `#d3e4fe`), tipografia **Plus Jakarta Sans** e espaçamentos modulares (`space-xs` a `space-xl`, `gutter`, `margin`) foram centralizados em `src/styles.css`.

---

## 2. Mapeamento de Rotas e Telas

Cada subpasta presente em `interfaces/` (incluindo as variações `*E` que representam o estado com menu lateral recolhido / compacto) possui correspondência direta de rota e componentes na aplicação:

| Pasta em `interfaces/` | Rota Principal / Alias | Smart Container | Dumb / UI Components Principais | Descrição Funcional |
| :--- | :--- | :--- | :--- | :--- |
| `interfaces/login_e_cadastro` | `/login` (`/login-e-cadastro`) | `AuthPageComponent` | `SignInFormComponent`, `SignUpFormComponent`, `AuthOverlayComponent` | Autenticação segura, SSO (Google/Microsoft/Certificado A1) e credenciamento clínico com validação de CRP e e-Psi em painel deslizante. |
| `interfaces/perfilProfissional` | `/perfil-profissional` | `ProfilePageComponent` | `CivilIdentificationCardComponent`, `EpsiCredentialCardComponent`, `TelepsychologyRoomsCardComponent` | Gestão de dados civis da psicóloga, verificação e renovação de credencial e-Psi/CFP, matriz teórica e parâmetros de salas criptografadas (Menu Expandido `w-72`). |
| `interfaces/perfilProfissonalE` | `/perfil-profissional-e` | `ProfilePageComponent` | `SidebarComponent` (modo compacto `w-20`), `CivilIdentificationCardComponent`, `EpsiCredentialCardComponent`, `TelepsychologyRoomsCardComponent` | Visualização do Perfil Profissional com barra lateral recolhida, ações rápidas compactas no rodapé do menu e selo `Ambiente Homologado CFP`. |
| `interfaces/gestaoECadastro` | `/gestao-e-cadastro` (`/pacientes`) | `PatientRegistrationPageComponent` | `PersonalDataSectionComponent`, `SafetyProtocolSectionComponent`, `PatientSettingsSummaryComponent` | Cadastro civil do paciente (Seção 2.1), Protocolo de Segurança Mandatório CFP Res. 11/2018 (Seção 2.2), UPA georreferenciada, TCLE e plano terapêutico (Menu Expandido). |
| `interfaces/gestaoECadastroE` | `/gestao-e-cadastro-e` | `PatientRegistrationPageComponent` | `SidebarComponent` (modo compacto `w-20`), `PersonalDataSectionComponent`, `SafetyProtocolSectionComponent`, `PatientSettingsSummaryComponent` | Cadastro e Prontuário de Paciente com menu lateral recolhido para máxima área útil de formulário. |
| `interfaces/agenda` | `/agenda` | `AgendaPageComponent` | `AgendaMetricsBarComponent`, `TimetableGridComponent`, `AppointmentModalComponent` | Agenda clínica semanal (08:00 às 18:00), indicadores de ocupação, destaque de sessão ativa de telessaúde, alerta de recepção e modal reativo de novo agendamento (Menu Expandido). |
| `interfaces/agendaE` | `/agenda-e` | `AgendaPageComponent` | `SidebarComponent` (modo compacto `w-20`), `AgendaMetricsBarComponent`, `TimetableGridComponent`, `AppointmentModalComponent` | Grade horária semanal com barra lateral recolhida (`w-20`) e navegação rápida por ícones. |
| `interfaces/painelClinico` | `/painel-clinico` (`/atendimento-clinico`) | `ClinicalPanelPageComponent` | `SessionHeaderComponent`, `FormalRecordTabComponent`, `PrivateRecordTabComponent`, `SignatureModalComponent` | Painel de atendimento com cronômetro ativo, acionamento de Contato de Emergência (SAMU), segregação em 2 abas (Prontuário Formal vs. Registro Documental Privativo AES-256) e assinatura digital ICP-Brasil imutável. |
| `interfaces/painelClinicoE` | `/painel-clinico-e` | `ClinicalPanelPageComponent` | `SidebarComponent` (modo compacto `w-20`), `SessionHeaderComponent`, `FormalRecordTabComponent`, `PrivateRecordTabComponent`, `SignatureModalComponent` | Painel de Atendimento Clínico com menu lateral recolhido para foco total na evolução clínica. |
| `interfaces/faturamento` | `/faturamento` (`/faturamento-split`) | `BillingPageComponent` | `SplitConciliatorComponent`, `BilledSessionsTableComponent`, `PaymentModalComponent` | Gestão financeira com simulação e conciliação automática de Split (30% Clínica NFS-e / 70% Psicólogo Carnê-Leão), filtros contábeis, exportação de Livro Caixa e emissão de recibos. |
| `interfaces/faturamentoE` | `/faturamento-e` | `BillingPageComponent` | `SidebarComponent` (modo compacto `w-16`), `SplitConciliatorComponent`, `BilledSessionsTableComponent`, `PaymentModalComponent` | Gestão Financeira e Split com barra lateral compacta (`w-16`) e atalho de suporte fiscal/DPO. |
| `interfaces/portalPrivacidade` | `/portal-privacidade` (`/privacidade-lgpd`) | `PrivacyPortalPageComponent` | `PatientTargetSelectorComponent`, `PortabilityExportPanelComponent` | Portal LGPD e CFP com busca reativa de titular auditado, delimitação legal de sigilo (Art. 9º) e exportação criptográfica em PDF/A-1b (ISO 19005) + JSON Estruturado (HL7 FHIR). |
| `interfaces/portalPrivacidadeE` | `/portal-privacidade-e` | `PrivacyPortalPageComponent` | `SidebarComponent` (modo compacto `w-16`), `PatientTargetSelectorComponent`, `PortabilityExportPanelComponent` | Portal de Privacidade e Auditoria LGPD com barra lateral compacta (`w-16`). |

> **Nota sobre Interatividade do Menu Lateral:** Além das rotas diretas `*-e`, o botão **"Recolher Menu"** (ícone de menu hambúrguer no topo da barra lateral) permite alternar dinamicamente em tempo real entre o estado expandido (`X`) e o estado recolhido (`XE`) em qualquer tela da aplicação.

---

## 3. Guia de Execução Local

### 3.1 Pré-requisitos
- **Node.js:** versão `20.x` ou superior (`22.x` recomendado).
- **Gerenciador de Pacotes:** `npm` (versão `10.x` ou `11.x`).

### 3.2 Passo a Passo para Instalação e Execução

1. **Instale as dependências do projeto:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento local:**
   ```bash
   npm start
   ```
   A aplicação ficará disponível em `http://localhost:4200/` com *live-reload* ativado.

3. **Gerar build de produção (verificação de tipos e otimização de pacotes):**
   ```bash
   npm run build
   ```
   Os artefatos otimizados serão gerados no diretório `dist/sistema-psicologia-interface/`.

4. **Executar os testes unitários:**
   ```bash
   npx ng test --watch=false
   ```

---

## 4. Padrões de Manutenibilidade

Para adicionar novas telas, fluxos clínicos ou componentes mantendo o padrão visual e arquitetural consolidado:

### 4.1 Criação de um Novo Módulo de Domínio (`features/<novo-dominio>`)
1. **Modelagem Estrita (`src/app/core/models/<novo-dominio>.model.ts`):**
   - Defina todas as interfaces de dados e payloads de formulário utilizando propriedades `readonly` e tipos explícitos. Nunca utilize `any`.
   - Reexporte o modelo no barrel file `src/app/core/models/index.ts`.
2. **Estado Reativo com Signals (`src/app/core/services/`):**
   - Adicione sinais privados de estado (`signal<T>(...)`), exponha seletores somente-leitura (`asReadonly()`) ou derivados (`computed(...)`) e crie métodos públicos de mutação tipados.
3. **Componentes Presentacionais (`src/app/features/<novo-dominio>/components/`):**
   - Crie componentes Standalone com `ChangeDetectionStrategy.OnPush`.
   - Utilize `input.required<T>()` para receber dados/FormGroups e `output<T>()` para emitir eventos ao container pai.
4. **Container Inteligente (`src/app/features/<novo-dominio>/containers/`):**
   - Injete `ClinicalStoreService` e `LayoutService` via `inject()`.
   - Instancie `FormGroup` tipados com validações adequadas e conecte os eventos dos componentes presentacionais às ações de negócio e feedbacks via `layout.showToast(...)`.
5. **Registro de Rota (`src/app/app.routes.ts` e `LayoutService`):**
   - Registre a rota filha dentro do `AppShellComponent` usando carregamento sob demanda (`loadComponent: () => import(...)`) e inclua o item correspondente em `navItems` no `LayoutService` caso deva constar no menu principal.

### 4.2 Fidelidade ao Design System (`src/styles.css`)
- Utilize sempre os tokens semânticos configurados no `@theme` do Tailwind CSS:
  - **Superfícies:** `bg-background`, `bg-surface-container-lowest`, `bg-surface-container-low`, `bg-surface-container`, `bg-surface-container-high`.
  - **Cores de Ação e Status:** `bg-primary`, `bg-primary-container`, `text-primary`, `bg-secondary`, `text-secondary`, `bg-tertiary`, `text-tertiary`, `bg-error`, `bg-error-container`.
  - **Tipografia Clínica:** `font-headline-lg text-headline-lg`, `font-headline-md text-headline-md`, `font-headline-sm text-headline-sm`, `font-body-lg text-body-lg`, `font-body-md text-body-md`, `font-body-sm text-body-sm`, `font-label-lg text-label-lg`, `font-label-md text-label-md`, `font-label-sm text-label-sm`.
  - **Espaçamento Modular:** `p-space-lg`, `p-space-xl`, `gap-space-md`, `gap-space-lg`, `px-gutter`.
