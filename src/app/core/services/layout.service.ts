import { Injectable, computed, effect, signal } from '@angular/core';
import { SidebarNavItem, ToastMessage } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly sidebarCollapsedState = signal<boolean>(false);
  private readonly activeRoutePathState = signal<string>('/agenda');
  private readonly toastState = signal<ToastMessage | null>(null);
  private readonly profileSaveTriggerState = signal<number>(0);
  private readonly profileSavingState = signal<boolean>(false);

  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  public readonly isSidebarCollapsed = this.sidebarCollapsedState.asReadonly();
  public readonly activeRoutePath = this.activeRoutePathState.asReadonly();
  public readonly activeToast = this.toastState.asReadonly();
  public readonly profileSaveTrigger = this.profileSaveTriggerState.asReadonly();
  public readonly isSavingProfile = this.profileSavingState.asReadonly();

  public readonly navItems = signal<readonly SidebarNavItem[]>([
    {
      id: 'perfil-profissional',
      label: 'Perfil Profissional',
      icon: 'badge',
      route: '/perfil-profissional',
      matchRoutes: ['/perfil-profissional', '/perfil-profissional-e'],
    },
    {
      id: 'pacientes',
      label: 'Pacientes',
      icon: 'group',
      route: '/gestao-e-cadastro',
      matchRoutes: ['/gestao-e-cadastro', '/gestao-e-cadastro-e', '/pacientes'],
    },
    {
      id: 'agenda',
      label: 'Agenda',
      icon: 'calendar_month',
      route: '/agenda',
      matchRoutes: ['/agenda', '/agenda-e'],
    },
    {
      id: 'atendimento-clinico',
      label: 'Atendimento Clínico',
      icon: 'clinical_notes',
      route: '/painel-clinico',
      matchRoutes: ['/painel-clinico', '/painel-clinico-e', '/atendimento-clinico'],
    },
    {
      id: 'faturamento-split',
      label: 'Faturamento & Split',
      icon: 'payments',
      route: '/faturamento',
      matchRoutes: ['/faturamento', '/faturamento-e', '/faturamento-split'],
    },
    {
      id: 'privacidade-lgpd',
      label: 'Privacidade & LGPD',
      icon: 'shield_lock',
      route: '/portal-privacidade',
      matchRoutes: ['/portal-privacidade', '/portal-privacidade-e', '/privacidade-lgpd'],
    },
  ]);

  public readonly isProfileRoute = computed<boolean>(() => {
    const path = this.activeRoutePathState();
    return path.startsWith('/perfil-profissional');
  });

  public readonly isCompact16Route = computed<boolean>(() => {
    const path = this.activeRoutePathState();
    return path.startsWith('/faturamento') || path.startsWith('/portal-privacidade');
  });

  constructor() {
    effect(() => {
      const path = this.activeRoutePathState();
      if (path.endsWith('-e')) {
        this.sidebarCollapsedState.set(true);
      }
    });
  }

  public toggleSidebar(): void {
    this.sidebarCollapsedState.update((collapsed) => !collapsed);
  }

  public setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsedState.set(collapsed);
  }

  public setActiveRoutePath(path: string): void {
    this.activeRoutePathState.set(path);
  }

  public requestProfileSave(): void {
    this.profileSaveTriggerState.update((n) => n + 1);
  }

  public setProfileSaving(saving: boolean): void {
    this.profileSavingState.set(saving);
  }

  public showToast(title: string, description: string, icon = 'task_alt', durationMs = 4000): void {
    if (this.toastTimeoutId !== null) {
      clearTimeout(this.toastTimeoutId);
    }

    this.toastState.set({
      id: `${Date.now()}`,
      title,
      description,
      icon,
    });

    this.toastTimeoutId = setTimeout(() => {
      this.toastState.set(null);
      this.toastTimeoutId = null;
    }, durationMs);
  }

  public dismissToast(): void {
    if (this.toastTimeoutId !== null) {
      clearTimeout(this.toastTimeoutId);
      this.toastTimeoutId = null;
    }
    this.toastState.set(null);
  }
}
