import { Routes } from '@angular/router';
import { clinicalRbacGuard } from './core/guards/auth.guard';
import { AppShellComponent } from './shared/layout/app-shell.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'agenda',
  },
  {
    path: 'login',
    title: 'PsicoSafe — Acesso e Credenciamento Clínico',
    loadComponent: () =>
      import('./features/auth/containers/auth-page.component').then((m) => m.AuthPageComponent),
  },
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: 'agenda',
        title: 'PsicoSafe | Agenda Clínica e Sala de Espera',
        loadComponent: () =>
          import('./features/agenda/containers/agenda-page.component').then(
            (m) => m.AgendaPageComponent
          ),
      },
      {
        path: 'agenda-e',
        title: 'PsicoSafe | Agenda Clínica (Menu Recolhido)',
        loadComponent: () =>
          import('./features/agenda/containers/agenda-page.component').then(
            (m) => m.AgendaPageComponent
          ),
      },
      {
        path: 'gestao-e-cadastro',
        title: 'PsicoSafe | Gestão e Cadastro de Paciente',
        loadComponent: () =>
          import('./features/patients/containers/patient-registration-page.component').then(
            (m) => m.PatientRegistrationPageComponent
          ),
      },
      {
        path: 'gestao-e-cadastro-e',
        title: 'PsicoSafe | Gestão e Cadastro de Paciente (Menu Recolhido)',
        loadComponent: () =>
          import('./features/patients/containers/patient-registration-page.component').then(
            (m) => m.PatientRegistrationPageComponent
          ),
      },
      {
        path: 'painel-clinico',
        title: 'PsicoSafe | Painel de Atendimento Clínico & Prontuário',
        canActivate: [clinicalRbacGuard],
        loadComponent: () =>
          import('./features/clinical-panel/containers/clinical-panel-page.component').then(
            (m) => m.ClinicalPanelPageComponent
          ),
      },
      {
        path: 'painel-clinico-e',
        title: 'PsicoSafe | Painel de Atendimento Clínico (Menu Recolhido)',
        canActivate: [clinicalRbacGuard],
        loadComponent: () =>
          import('./features/clinical-panel/containers/clinical-panel-page.component').then(
            (m) => m.ClinicalPanelPageComponent
          ),
      },
      {
        path: 'faturamento',
        title: 'PsicoSafe | Gestão Financeira & Split de Pagamentos',
        loadComponent: () =>
          import('./features/billing/containers/billing-page.component').then(
            (m) => m.BillingPageComponent
          ),
      },
      {
        path: 'faturamento-e',
        title: 'PsicoSafe | Gestão Financeira & Split (Menu Recolhido)',
        loadComponent: () =>
          import('./features/billing/containers/billing-page.component').then(
            (m) => m.BillingPageComponent
          ),
      },
      {
        path: 'portal-privacidade',
        title: 'PsicoSafe | Portal de Privacidade, Exportação e Auditoria LGPD',
        canActivate: [clinicalRbacGuard],
        loadComponent: () =>
          import('./features/privacy/containers/privacy-portal-page.component').then(
            (m) => m.PrivacyPortalPageComponent
          ),
      },
      {
        path: 'portal-privacidade-e',
        title: 'PsicoSafe | Portal de Privacidade (Menu Recolhido)',
        canActivate: [clinicalRbacGuard],
        loadComponent: () =>
          import('./features/privacy/containers/privacy-portal-page.component').then(
            (m) => m.PrivacyPortalPageComponent
          ),
      },
      {
        path: 'perfil-profissional',
        title: 'PsicoSafe | Perfil e Habilitação Profissional (e-Psi)',
        loadComponent: () =>
          import('./features/profile/containers/profile-page.component').then(
            (m) => m.ProfilePageComponent
          ),
      },
      {
        path: 'perfil-profissional-e',
        title: 'PsicoSafe | Perfil Profissional (Menu Recolhido)',
        loadComponent: () =>
          import('./features/profile/containers/profile-page.component').then(
            (m) => m.ProfilePageComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'agenda',
  },
];
