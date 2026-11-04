import { Routes } from '@angular/router';
import { AppShellComponent } from './shared/layout/app-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    title: 'PsicoSafe — Autenticação e Credenciamento e-Psi',
    loadComponent: () =>
      import('./features/auth/containers/auth-page.component').then((m) => m.AuthPageComponent),
  },
  {
    path: 'login-e-cadastro',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'agenda',
        pathMatch: 'full',
      },
      {
        path: 'perfil-profissional',
        title: 'PsicoSafe — Perfil do Psicólogo & Habilitação Profissional',
        loadComponent: () =>
          import('./features/profile/containers/profile-page.component').then(
            (m) => m.ProfilePageComponent
          ),
      },
      {
        path: 'perfil-profissional-e',
        title: 'PsicoSafe — Perfil do Psicólogo (Menu Recolhido)',
        loadComponent: () =>
          import('./features/profile/containers/profile-page.component').then(
            (m) => m.ProfilePageComponent
          ),
      },
      {
        path: 'gestao-e-cadastro',
        title: 'PsicoSafe — Cadastro e Prontuário de Paciente',
        loadComponent: () =>
          import('./features/patients/containers/patient-registration-page.component').then(
            (m) => m.PatientRegistrationPageComponent
          ),
      },
      {
        path: 'gestao-e-cadastro-e',
        title: 'PsicoSafe — Cadastro e Prontuário de Paciente (Menu Recolhido)',
        loadComponent: () =>
          import('./features/patients/containers/patient-registration-page.component').then(
            (m) => m.PatientRegistrationPageComponent
          ),
      },
      {
        path: 'pacientes',
        redirectTo: 'gestao-e-cadastro',
        pathMatch: 'full',
      },
      {
        path: 'agenda',
        title: 'PsicoSafe — Agenda Clínica Semanal',
        loadComponent: () =>
          import('./features/agenda/containers/agenda-page.component').then(
            (m) => m.AgendaPageComponent
          ),
      },
      {
        path: 'agenda-e',
        title: 'PsicoSafe — Agenda Clínica (Menu Recolhido)',
        loadComponent: () =>
          import('./features/agenda/containers/agenda-page.component').then(
            (m) => m.AgendaPageComponent
          ),
      },
      {
        path: 'painel-clinico',
        title: 'PsicoSafe — Painel de Atendimento Clínico & Prontuário CFP',
        loadComponent: () =>
          import('./features/clinical-panel/containers/clinical-panel-page.component').then(
            (m) => m.ClinicalPanelPageComponent
          ),
      },
      {
        path: 'painel-clinico-e',
        title: 'PsicoSafe — Painel de Atendimento Clínico (Menu Recolhido)',
        loadComponent: () =>
          import('./features/clinical-panel/containers/clinical-panel-page.component').then(
            (m) => m.ClinicalPanelPageComponent
          ),
      },
      {
        path: 'atendimento-clinico',
        redirectTo: 'painel-clinico',
        pathMatch: 'full',
      },
      {
        path: 'faturamento',
        title: 'PsicoSafe — Gestão Financeira & Split de Pagamentos',
        loadComponent: () =>
          import('./features/billing/containers/billing-page.component').then(
            (m) => m.BillingPageComponent
          ),
      },
      {
        path: 'faturamento-e',
        title: 'PsicoSafe — Gestão Financeira & Split (Menu Recolhido)',
        loadComponent: () =>
          import('./features/billing/containers/billing-page.component').then(
            (m) => m.BillingPageComponent
          ),
      },
      {
        path: 'faturamento-split',
        redirectTo: 'faturamento',
        pathMatch: 'full',
      },
      {
        path: 'portal-privacidade',
        title: 'PsicoSafe — Portal de Privacidade, Exportação e Auditoria LGPD',
        loadComponent: () =>
          import('./features/privacy/containers/privacy-portal-page.component').then(
            (m) => m.PrivacyPortalPageComponent
          ),
      },
      {
        path: 'portal-privacidade-e',
        title: 'PsicoSafe — Portal de Privacidade & LGPD (Menu Recolhido)',
        loadComponent: () =>
          import('./features/privacy/containers/privacy-portal-page.component').then(
            (m) => m.PrivacyPortalPageComponent
          ),
      },
      {
        path: 'privacidade-lgpd',
        redirectTo: 'portal-privacidade',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'agenda',
  },
];
