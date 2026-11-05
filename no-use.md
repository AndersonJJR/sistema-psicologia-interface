# Relatório de Limpeza de Código Sem Funcionalidade e Artefatos Sem Uso (`no-use.md`)

Este documento registra todos os elementos sem funcionalidade removidos do **Front-End (`sistema-psicologia-interface`)** e os artefatos sem uso identificados no **Back-End (`sistema-psicologia`)** durante a integração ponta a ponta entre as aplicações.

---

## 1. Elementos e Componentes Removidos no Front-End (`sistema-psicologia-interface`)

1. **`src/app/shared/components/badge/status-badge.component.ts` (`StatusBadgeComponent`)**
   - **Ação:** Removido do repositório.
   - **Motivo:** Componente presentacional órfão que não era importado por nenhum container ou componente da aplicação.
2. **Botões de Login Social/Institucional Simulados (`gov.br` e `Conselho CRP`)**
   - **Local:** `src/app/features/auth/components/sign-in-form/sign-in-form.component.ts` e `src/app/features/auth/containers/auth-page.component.ts` (`ssoRequested` / `onSsoAuth`).
   - **Ação:** Removidos.
   - **Motivo:** Não existe provedor OAuth2/Gov.br no back-end; a autenticação oficial opera via JWT (`POST /api/v1/auth/login` e `POST /api/v1/auth/registrar-psicologo`).
3. **Botão "Esqueceu a senha?" e Links `javascript:void(0)` nos Termos de Credenciamento**
   - **Local:** `src/app/features/auth/components/sign-in-form/sign-in-form.component.ts` e `src/app/features/auth/components/sign-up-form/sign-up-form.component.ts`.
   - **Ação:** Removidos/substituídos por texto normativo direto.
   - **Motivo:** Eram gatilhos visuais sem endpoint correspondente no servidor.
4. **Botão "Alterar Foto Oficial" e Placeholders Vazios no Perfil**
   - **Local:** `src/app/features/profile/components/civil-identification-card/civil-identification-card.component.ts` (`changePhotoRequested` / `onChangePhoto`) e `src/app/features/profile/containers/profile-page.component.ts`.
   - **Ação:** Removidos.
   - **Motivo:** Não há serviço de armazenamento de blobs de imagem de avatar no back-end.
5. **Botão de Ajuda Simulado e `div`s Vazias na Sidebar**
   - **Local:** `src/app/shared/components/sidebar/sidebar.component.ts` (`helpRequested` / `onHelpRequested`).
   - **Ação:** Removidos e substituídos pelo botão funcional de **Encerrar Sessão Segura (Logout JWT)**.

---

## 2. Artefatos Sem Uso Catalogados no Back-End (`/var/home/anderson/IdeaProjects/sistema-psicologia`)

1. **`src/main/java/com/anderson/sistemapsicologia/view/ApiResponseView.java`**
   - **Descrição:** Record genérico `ApiResponseView<T>` e método `ApiResponseView.ok(...)` sem referência em nenhum Controller REST (os controllers retornam `ResponseEntity<DTO>` diretamente).
2. **`src/main/resources/static/assets/auth.guard.ts`**
   - **Descrição:** Arquivo TypeScript estático demonstrativo nos recursos do Spring Boot, substituído pelos guardas reais do Angular em `src/app/core/guards/auth.guard.ts`.
3. **`src/main/resources/static/index.html`**
   - **Descrição:** Página estática demonstrativa servida pelo Spring Boot, substituída pela SPA Angular em `sistema-psicologia-interface`.
