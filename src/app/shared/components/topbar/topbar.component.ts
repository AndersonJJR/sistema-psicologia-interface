import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header [class]="headerClasses()">
      <div class="flex items-center gap-space-md">
        @if (!hideTopbarLogo()) {
          <img
            alt="Logo PsicoSafe"
            class="h-8 w-auto object-contain"
            [src]="logoUrl()"
          />
        }
        <span
          class="hidden lg:inline-flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm"
        >
          <span class="material-symbols-outlined text-[16px]">calendar_today</span>
          {{ dateLabel() }}
        </span>
      </div>

      <div class="flex items-center gap-space-md">
        <a
          routerLink="/login"
          title="Alternar Conta / Sair para Autenticação"
          class="flex items-center gap-space-sm pl-space-sm hover:opacity-90 transition-opacity"
        >
          <div class="text-right hidden sm:flex flex-col">
            <span class="font-label-lg text-label-lg text-on-surface font-semibold">
              {{ professionalName() }}
            </span>
            <span class="font-label-sm text-label-sm text-primary font-medium">
              {{ professionalCrp() }}
            </span>
          </div>
          <div
            class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm"
          >
            <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </a>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  public readonly collapsed = input.required<boolean>();
  public readonly compact16 = input<boolean>(false);
  public readonly hideTopbarLogo = input<boolean>(false);
  public readonly logoUrl = input.required<string>();
  public readonly dateLabel = input.required<string>();
  public readonly professionalName = input.required<string>();
  public readonly professionalCrp = input.required<string>();

  public readonly headerClasses = computed<string>(() => {
    const base =
      'fixed top-0 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter transition-all duration-300';
    if (!this.collapsed()) {
      return `${base} left-72`;
    }
    if (this.compact16()) {
      return `${base} left-16`;
    }
    return `${base} left-20`;
  });
}
