import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant =
  | 'epsi-active'
  | 'lgpd-indigo'
  | 'live-session'
  | 'cfp-mandatory'
  | 'neutral-pill';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="badgeClasses()">
      @if (pulsingDot()) {
        <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
      }
      @if (icon()) {
        <span class="material-symbols-outlined text-[14px]">{{ icon() }}</span>
      }
      <span>{{ label() }}</span>
    </span>
  `,
})
export class StatusBadgeComponent {
  public readonly label = input.required<string>();
  public readonly variant = input<BadgeVariant>('neutral-pill');
  public readonly icon = input<string | null>(null);
  public readonly pulsingDot = input<boolean>(false);

  public badgeClasses(): string {
    const base = 'inline-flex items-center gap-1.5 font-label-sm text-label-sm font-semibold';
    switch (this.variant()) {
      case 'epsi-active':
        return `${base} rounded-full bg-secondary px-2.5 py-0.5 text-on-secondary shadow-sm`;
      case 'lgpd-indigo':
        return `${base} rounded bg-tertiary/10 text-tertiary px-space-xs py-0.5`;
      case 'live-session':
        return 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md';
      case 'cfp-mandatory':
        return 'bg-error text-on-error font-label-sm text-label-sm px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold';
      default:
        return `${base} px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant`;
    }
  }
}
