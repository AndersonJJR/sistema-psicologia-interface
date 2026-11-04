import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClinicalStoreService } from '../../core/services/clinical-store.service';
import { LayoutService } from '../../core/services/layout.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { ToastNotificationComponent } from '../components/toast/toast-notification.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastNotificationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-sidebar
      [navItems]="layout.navItems()"
      [activePath]="layout.activeRoutePath()"
      [collapsed]="layout.isSidebarCollapsed()"
      [compact16]="layout.isCompact16Route()"
      [showProfileActions]="layout.isProfileRoute()"
      [savingProfile]="layout.isSavingProfile()"
      [renewingEpsi]="layout.isRenewingEpsi()"
      [lastModifiedLabel]="store.profile().lastModifiedLabel"
      [logoUrl]="store.logoUrl"
      (toggleSidebar)="layout.toggleSidebar()"
      (saveProfile)="layout.requestProfileSave()"
      (renewEpsi)="layout.requestEpsiRenew()"
    />

    <div [class]="contentWrapperClasses()">
      <app-topbar
        [collapsed]="layout.isSidebarCollapsed()"
        [compact16]="layout.isCompact16Route()"
        [hideTopbarLogo]="layout.isProfileRoute()"
        [logoUrl]="store.logoUrl"
        [dateLabel]="store.currentDateHeaderLabel()"
        [professionalName]="store.profile().shortDisplayName"
        [professionalCrp]="'CRP ' + store.profile().crpRegistration.split(' ')[0]"
      />

      <main class="w-full pt-16 bg-background min-h-screen px-gutter py-space-lg">
        <router-outlet />
      </main>
    </div>

    <app-toast-notification
      [toast]="layout.activeToast()"
      (dismiss)="layout.dismissToast()"
    />
  `,
})
export class AppShellComponent {
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
}
