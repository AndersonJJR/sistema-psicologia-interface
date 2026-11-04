import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ToastMessage } from '../../../core/models';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (toast(); as currentToast) {
      <div
        role="status"
        aria-live="polite"
        class="fixed bottom-6 right-6 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md rounded-xl shadow-xl z-50 transition-all duration-300"
      >
        <span class="material-symbols-outlined text-secondary-fixed text-[24px]">
          {{ currentToast.icon ?? 'task_alt' }}
        </span>
        <div class="flex flex-col">
          <span class="font-label-lg text-label-lg font-bold text-inverse-on-surface">
            {{ currentToast.title }}
          </span>
          <span class="font-body-sm text-body-sm text-inverse-on-surface/80">
            {{ currentToast.description }}
          </span>
        </div>
        <button
          type="button"
          (click)="dismiss.emit()"
          aria-label="Fechar notificação"
          class="ml-2 text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    }
  `,
})
export class ToastNotificationComponent {
  public readonly toast = input<ToastMessage | null>(null);
  public readonly dismiss = output<void>();
}
