import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AgendaMetricCard } from '../../../../core/models';

@Component({
  selector: 'app-agenda-metrics-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-space-md">
      @for (metric of metrics(); track metric.id) {
        <div
          class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center gap-space-md"
        >
          <div
            [class]="
              'w-10 h-10 rounded-lg flex items-center justify-center ' +
              metric.iconBgClass +
              ' ' +
              metric.iconColorClass
            "
          >
            <span class="material-symbols-outlined text-[22px]">{{ metric.icon }}</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span
              class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider"
            >
              {{ metric.label }}
            </span>
            <span class="font-headline-sm text-headline-sm text-on-surface font-semibold">
              {{ metric.value }}
            </span>
          </div>
        </div>
      }
    </div>
  `,
})
export class AgendaMetricsBarComponent {
  public readonly metrics = input.required<readonly AgendaMetricCard[]>();
}
