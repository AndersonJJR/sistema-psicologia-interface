---
name: Serene Clinical & Compliance
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3e4947'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#324c9c'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c65b6'
  on-tertiary-container: '#e6e9ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b6c4ff'
  on-tertiary-fixed: '#00164e'
  on-tertiary-fixed-variant: '#264191'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an environment of clinical rigor, therapeutic warmth, and uncompromising regulatory safety designed specifically for behavioral health, electronic health records (EHR), and telepsychology platforms conforming to CFP (Conselho Federal de Psicologia) and LGPD requirements.

The visual direction merges **Corporate Clinical Precision** with **Humanist Sanctuary Modernism**:
- **Tone & Mood:** Soothing, dignified, highly confidential, and medically precise. It eliminates clinical coldness without resorting to frivolous or overly casual consumer wellness tropes.
- **Target Audience:** Licensed psychologists, clinical supervisors, multidisciplinary mental health teams, and audited healthcare administrators.
- **Emotional Response:** Inspires psychological safety, legal assurance, focus during high-cognitive-load documentation, and immediate clarity during crisis interventions.

## Colors

The palette balances legal certainty with neuro-inclusive visual comfort:

- **Primary (`#0F766E` - Deep Clinical Teal):** Anchors primary clinical actions, main navigation structures, and focused patient-record workspaces. Communicates medical integrity, discretion, and calm authority.
- **Secondary (`#059669` - Therapeutic Emerald):** Signifies legal compliance, active e-Psi registration, encrypted tele-session connectivity, and successfully signed evolution records.
- **Tertiary (`#1E3A8A` - Deep Slate Royal):** Reserved for institutional governance markers, CFP normative cross-references, audit logs, and jurisdictional safeguards.
- **Emergency / Protocol Action (`#DC2626`):** Dedicated exclusively to critical patient risk mitigation, suicidal ideation protocol activation, emergency contact disclosures, and SAMU/CVV fast-dispatch mechanisms.
- **Neutrals & Canvas:** Backdrops leverage sterile, non-glare off-whites (`#F8FAFC`, `#F1F5F9`), crisp elevated card surfaces (`#FFFFFF`), structural boundaries (`#E2E8F0`), and optical-grade typography grays (`#0F172A`, `#334155`) to eliminate eye fatigue across long therapeutic logging sessions.

## Typography

The design system uses **Plus Jakarta Sans** uniformly to establish a welcoming yet disciplined posture. Its humanist geometry softens cold clinical interactions, while its tall x-height and sturdy letterforms ensure flawless legibility in dense electronic health records, psychiatric evaluation notes, and high-frequency audit logs.

Hierarchy principles:
- **Clinical Evolution & Prontuário:** Long-form patient narratives and subjective session notes utilize `body-lg` (16px / 26px line-height) to maintain visual rhythm during prolonged typing and reading.
- **Audit Tables & Tele-Logs:** Diagnostic codes (CID-11/DSM-5), timestamps, IP access records, and e-Psi registration metadata utilize `body-sm` and `label-md` for tabular clarity.
- **Responsive Handling:** Screen headings over 30px automatically step down on mobile viewports (`headline-lg-mobile`) to protect clinical data visibility above the fold.

## Layout & Spacing

A disciplined, adaptable fluid layout structure ensures patient sessions and charting workflows remain distraction-free:

- **Desktop Layout (≥ 1280px):** 12-column fluid grid, 2rem canvas margin, 1.5rem gutters. Dual-pane layout standard for telepsychology: video viewport (left 7 columns) and live real-time clinical notes / DSM-5 selector (right 5 columns).
- **Tablet Layout (768px – 1279px):** 8-column layout, 1.5rem margin, 1rem gutters. Sidebars fold into an off-canvas drawer with dedicated status indicators always visible.
- **Mobile Layout (< 768px):** 4-column layout, 1rem canvas margin, 0.75rem gutters. Patient cards and clinical timelines stack linearly, with emergency panic and call buttons pinned to sticky bottom app bars.
- **Component Flow:** Padding within patient charts, encrypted file upload dropzones, and compliance modules follows the base-8 modular steps: `space-xs` (4px), `space-sm` (8px), `space-md` (16px), `space-lg` (24px), and `space-xl` (40px).

## Elevation & Depth

To protect clinical clarity, depth is communicated through **tonal surface stacking** combined with **subtle, diffused ambient shadows**:

- **Layer 0 (Canvas Base):** `#F8FAFC` flat surface. No elevation.
- **Layer 1 (Cards, Charts, Records):** `#FFFFFF` surface framed with a crisp low-contrast border (`1px solid #E2E8F0`) and an ultra-soft ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Layer 2 (Dropdowns, Clinical Context Menus, Hover States):** `#FFFFFF` elevated with `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Layer 3 (Modals, Crisis Intervention Confirmations, E-Signature Sheets):** `#FFFFFF` with `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)` over an accessible, non-jarring backdrop blur (`rgba(15, 23, 42, 0.45)` with `backdrop-filter: blur(4px)`).

## Shapes

The design system adopts a **Rounded (`roundedness: 2`)** geometry:
- Standard interactive elements (inputs, action buttons, regulatory chips) use `0.5rem` (8px) border-radius.
- Cards, patient chart containers, and consultation windows utilize `1rem` (16px, `rounded-lg`).
- Floating compliance toolbars, crisis emergency panels, and tele-session control docks utilize `1.5rem` (24px, `rounded-xl`).
- Status dots, tele-signal indicators, and quick-filter pills utilize fully pill-shaped styling (`9999px`).

This subtle rounding communicates empathetic accessibility, actively counteracting the bureaucratic, rigid demeanor of traditional enterprise hospital software.

## Components

### Buttons
- **Primary Action (Salvar Prontuário, Iniciar Sessão):** Deep clinical teal background (`#0F766E`), white text, semi-bold. Focus ring: 3px teal with 20% opacity.
- **Secondary Action (Exportar Laudo, Visualizar Histórico):** Bordered with `#CBD5E1`, text `#0F766E`, hover state `#F0FDFA`.
- **Emergency Action (Protocolo de Risco / SAMU / Contato de Emergência):** Crimson `#DC2626` background with high-contrast white text, elevated hover depth, requiring explicit 2-step verification or sustained hold gesture.

### Regulatory & Status Badges
- **e-Psi Ativo / CFP Válido:** Emerald background tint (`#ECFDF5`), deep emerald text (`#047857`), emerald border (`#A7F3D0`), prepended by an authenticated shield icon.
- **LGPD / Dados Sensíveis Criptografados:** Indigo tint (`#EEF2FF`), royal blue text (`#1E3A8A`), lock icon, uppercase `label-sm`.
- **Sessão em Andamento / Criptografia Ponta-a-Ponta:** Subtle teal pill badge with a pulsing live status dot.

### Confidentiality & Compliance Banners
- **Aviso de Sigilo Profissional (Artigo 9º CFP):** Background `#F8FAFC`, robust 4px left-border `#0F766E`, subtle slate text, and dedicated dismiss/acknowledge toggles for auditing.

### Input Fields & Clinical Notes
- **Text Inputs & Date Pickers:** Height 44px (touch-compliant), border `#CBD5E1`, background `#FFFFFF`, text `#0F172A`. On focus: border shifts to `#0F766E` with subtle ambient ring.
- **Evolução Clínica Editor:** Rich-text container with subtle line guide, automated draft saving indicator, and watermarked background indicating digital signature readiness.

### Clinical Cards & Records
- **Prontuário Card:** `#FFFFFF` surface, `1rem` roundedness, light outline (`#E2E8F0`), partitioned into patient demographics header, CID-11 tagging area, and chronological timeline logs.

### Checkboxes & Radios
- Rounded `0.25rem` checkbox edges, `#0F766E` checked state, high-contrast check mark in white. Radio buttons utilize concentric teal indicators.