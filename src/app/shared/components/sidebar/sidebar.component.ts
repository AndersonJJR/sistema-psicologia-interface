import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarNavItem } from '../../../core/models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      id="sidebar-aside"
      [class]="asideClasses()"
    >
      <div class="flex flex-col w-full">
        <!-- Brand Header -->
        @if (!collapsed()) {
          <div class="h-16 px-space-lg flex items-center gap-space-sm bg-surface-container-lowest">
            <img
              alt="Logo PsicoSafe"
              class="h-8 w-auto object-contain"
              [src]="logoUrl()"
            />
            <div class="flex flex-col">
              <span class="font-headline-sm text-headline-sm text-primary tracking-tight">
                PsicoSafe
              </span>
              <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Clínica &amp; Telepsi
              </span>
            </div>
          </div>
        } @else if (compact16()) {
          <div class="flex flex-col items-center gap-space-md w-full">
            <div class="h-10 flex items-center justify-center">
              <img
                alt="Logo PsicoSafe"
                class="h-7 w-auto object-contain"
                [src]="logoUrl()"
                title="PsicoSafe Clínica & Telepsi"
              />
            </div>
          </div>
        } @else {
          <div class="h-16 px-space-sm flex items-center justify-center bg-surface-container-lowest">
            <img
              alt="Logo PsicoSafe"
              class="h-8 w-auto object-contain"
              [src]="logoUrl()"
              title="PsicoSafe Clínica & Telepsi"
            />
          </div>
        }

        <!-- Navigation Links -->
        <nav
          [class]="navContainerClasses()"
          aria-label="Navegação Principal"
        >
          <!-- Toggle Sidebar Button -->
          @if (!collapsed()) {
            <button
              type="button"
              id="btn-toggle-sidebar"
              (click)="toggleSidebar.emit()"
              class="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all w-full text-left cursor-pointer"
            >
              <span class="material-symbols-outlined text-[20px]">menu</span>
              <span class="font-label-lg text-label-lg">Recolher Menu</span>
            </button>
          } @else if (compact16()) {
            <button
              type="button"
              id="btn-toggle-sidebar"
              (click)="toggleSidebar.emit()"
              title="Expandir Menu"
              class="w-11 h-11 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer"
            >
              <span class="material-symbols-outlined text-[20px]">menu</span>
            </button>
          } @else {
            <button
              type="button"
              id="btn-toggle-sidebar"
              (click)="toggleSidebar.emit()"
              title="Expandir / Recolher Menu"
              class="flex items-center justify-center p-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer"
            >
              <span class="material-symbols-outlined text-[22px]">menu</span>
            </button>
          }

          @for (item of navItems(); track item.id) {
            @if (!collapsed()) {
              <a
                [routerLink]="item.route"
                [attr.aria-current]="isItemActive(item) ? 'page' : null"
                [class]="
                  isItemActive(item)
                    ? 'flex items-center gap-space-sm px-space-md py-space-sm transition-all bg-primary-container text-on-primary font-semibold rounded-lg shadow-sm'
                    : 'flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all'
                "
              >
                <span class="material-symbols-outlined text-[20px]">{{ item.icon }}</span>
                <span class="font-label-lg text-label-lg">{{ item.label }}</span>
              </a>
            } @else if (compact16()) {
              <a
                [routerLink]="item.route"
                [title]="item.label"
                [attr.aria-current]="isItemActive(item) ? 'page' : null"
                [class]="
                  isItemActive(item)
                    ? 'w-11 h-11 flex items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm transition-all'
                    : 'w-11 h-11 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all'
                "
              >
                <span class="material-symbols-outlined text-[20px]">{{ item.icon }}</span>
              </a>
            } @else {
              <a
                [routerLink]="item.route"
                [title]="item.label"
                [attr.aria-current]="isItemActive(item) ? 'page' : null"
                [class]="
                  isItemActive(item)
                    ? 'flex items-center justify-center p-3 transition-all bg-primary-container text-on-primary font-semibold rounded-lg shadow-sm group relative'
                    : 'flex items-center justify-center p-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all group relative'
                "
              >
                <span class="material-symbols-outlined text-[22px]">{{ item.icon }}</span>
              </a>
            }
          }
        </nav>
      </div>

      <!-- Contextual Sidebar Footer -->
      @if (showProfileActions()) {
        @if (!collapsed()) {
          <div class="p-space-md">
            <div class="mb-space-md flex flex-col gap-2">
              <button
                type="button"
                id="btn-save-profile"
                [disabled]="savingProfile()"
                (click)="saveProfile.emit()"
                class="w-full h-11 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
              >
                @if (savingProfile()) {
                  <span class="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                  <span>Gravando Dados...</span>
                } @else {
                  <span class="material-symbols-outlined text-[18px]">save</span>
                  <span>Salvar Alterações</span>
                }
              </button>
              <button
                type="button"
                id="btn-renew-epsi"
                [disabled]="renewingEpsi()"
                (click)="renewEpsi.emit()"
                class="w-full h-9 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm flex items-center justify-center gap-space-xs hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-60"
              >
                @if (renewingEpsi()) {
                  <span class="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  <span>Verificando no CFP...</span>
                } @else {
                  <span class="material-symbols-outlined text-[16px]">sync</span>
                  <span>Renovar Certificado e-Psi</span>
                }
              </button>
              <p class="font-label-sm text-[11px] text-center text-on-surface-variant pt-0.5 leading-tight">
                {{ lastModifiedLabel() }}
              </p>
            </div>
          </div>
        } @else {
          <div class="p-2 pb-space-md">
            <div class="flex flex-col gap-2 items-center">
              <button
                type="button"
                id="btn-save-profile"
                title="Salvar Alterações"
                [disabled]="savingProfile()"
                (click)="saveProfile.emit()"
                class="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span
                  class="material-symbols-outlined text-[20px]"
                  [class.animate-spin]="savingProfile()"
                >
                  {{ savingProfile() ? 'refresh' : 'save' }}
                </span>
              </button>
              <button
                type="button"
                id="btn-renew-epsi"
                title="Renovar Certificado e-Psi"
                [disabled]="renewingEpsi()"
                (click)="renewEpsi.emit()"
                class="w-10 h-10 rounded-lg bg-surface-container text-primary flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span
                  class="material-symbols-outlined text-[18px]"
                  [class.animate-spin]="renewingEpsi()"
                >
                  sync
                </span>
              </button>
              <div
                class="w-2 h-2 rounded-full bg-secondary"
                [title]="lastModifiedLabel()"
              ></div>
            </div>
          </div>
        }
      }
    </aside>
  `,
})
export class SidebarComponent {
  public readonly navItems = input.required<readonly SidebarNavItem[]>();
  public readonly activePath = input.required<string>();
  public readonly collapsed = input.required<boolean>();
  public readonly compact16 = input<boolean>(false);
  public readonly showProfileActions = input<boolean>(false);
  public readonly savingProfile = input<boolean>(false);
  public readonly renewingEpsi = input<boolean>(false);
  public readonly lastModifiedLabel = input<string>('');
  public readonly logoUrl = input.required<string>();

  public readonly toggleSidebar = output<void>();
  public readonly saveProfile = output<void>();
  public readonly renewEpsi = output<void>();

  public readonly asideClasses = computed<string>(() => {
    const base =
      'fixed left-0 top-0 h-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-all duration-300';
    if (!this.collapsed()) {
      return `${base} w-72`;
    }
    if (this.compact16()) {
      return `${base} w-16 items-center py-space-md`;
    }
    return `${base} w-20`;
  });

  public readonly navContainerClasses = computed<string>(() => {
    if (!this.collapsed()) {
      return 'flex flex-col gap-space-xs px-space-md pt-space-xs';
    }
    if (this.compact16()) {
      return 'flex flex-col items-center gap-space-xs w-full px-1.5 pt-space-sm';
    }
    return 'flex flex-col gap-space-xs px-2 pt-space-xs';
  });

  public isItemActive(item: SidebarNavItem): boolean {
    const current = this.activePath();
    return item.matchRoutes.some(
      (route) => current === route || current.startsWith(`${route}/`)
    );
  }
}
