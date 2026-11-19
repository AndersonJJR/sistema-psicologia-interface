import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClinicalStoreService } from '../../core/services/clinical-store.service';
import { LayoutService } from '../../core/services/layout.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { ToastNotificationComponent } from '../components/toast/toast-notification.component';
import { ModalShellComponent } from '../components/modal/modal-shell.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopbarComponent,
    ToastNotificationComponent,
    ModalShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-sidebar
      [navItems]="layout.navItems()"
      [activePath]="layout.activeRoutePath()"
      [collapsed]="layout.isSidebarCollapsed()"
      [compact16]="layout.isCompact16Route()"
      [showProfileActions]="layout.isProfileRoute()"
      [savingProfile]="layout.isSavingProfile()"
      [lastModifiedLabel]="store.profile().lastModifiedLabel"
      [logoUrl]="store.logoUrl"
      (toggleSidebar)="layout.toggleSidebar()"
      (saveProfile)="layout.requestProfileSave()"
      (openHelp)="layout.openHelpModal()"
    />

    <div [class]="contentWrapperClasses()">
      <app-topbar
        [collapsed]="layout.isSidebarCollapsed()"
        [compact16]="layout.isCompact16Route()"
        [logoUrl]="store.logoUrl"
        [dateLabel]="store.currentDateHeaderLabel()"
        [professionalName]="store.profile().shortDisplayName || 'Psicólogo(a)'"
        [professionalCrp]="store.profile().crpRegistration ? 'CRP ' + store.profile().crpRegistration.split(' ')[0] : 'CFP Regular'"
        [avatarUrl]="store.profile().avatarUrl"
      />

      <main class="w-full pt-16 bg-background min-h-screen px-gutter py-space-lg">
        <router-outlet />
      </main>
    </div>

    <app-toast-notification
      [toast]="layout.activeToast()"
      (dismiss)="layout.dismissToast()"
    />

    <app-modal-shell
      [isOpen]="layout.isHelpModalOpen()"
      title="Central de Ajuda & Suporte Clínico"
      subtitle="Conformidade CFP, LGPD e suporte operacional PsicoSafe"
      icon="help_center"
      modalTitleId="help-support-modal-title"
      (closed)="layout.closeHelpModal()"
    >
      <div class="flex flex-col gap-space-md text-body-sm text-on-surface-variant">
        <div class="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1.5">
          <span class="font-label-md text-on-surface font-semibold">Guarda e Sigilo de Prontuários (CFP nº 01/2009)</span>
          <p>
            Os prontuários formais e registros documentais privativos (AES-256-GCM) possuem retenção mínima obrigatória de 5 anos conforme normas do CFP e 20 anos pela Lei nº 13.787/2018.
          </p>
        </div>
        <div class="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1.5">
          <span class="font-label-md text-on-surface font-semibold">Protocolo de Emergência em Telessaúde (CFP nº 11/2018)</span>
          <p>
            Certifique-se de que todos os pacientes em teleatendimento possuam contato de emergência e endereço físico habitual atualizados na ficha cadastral.
          </p>
        </div>
        <div class="flex justify-end pt-space-xs">
          <button
            type="button"
            (click)="layout.closeHelpModal()"
            class="px-space-lg py-2 rounded-xl bg-primary text-on-primary font-label-lg hover:bg-primary-container transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </app-modal-shell>
  `,
})
export class AppShellComponent implements OnInit {
  public readonly layout = inject(LayoutService);
  public readonly store = inject(ClinicalStoreService);
  private readonly router = inject(Router);

  public readonly contentWrapperClasses = computed<string>(() => {
    const base = 'transition-all duration-300';
    if (!this.layout.isSidebarCollapsed()) {
      return `${base} pl-72`;
    }
    if (this.layout.isCompact16Route()) {
      return `${base} pl-16`;
    }
    return `${base} pl-20`;
  });

  constructor() {
    this.layout.setActiveRoutePath(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => {
        this.layout.setActiveRoutePath(event.urlAfterRedirects);
      });
  }

  public ngOnInit(): void {
    this.store.loadProfileFromBackend();
  }
}
