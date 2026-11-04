import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-space-md"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="modalTitleId()"
        (click)="onBackdropClick($event)"
      >
        <div
          class="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-xl shadow-2xl flex flex-col gap-space-lg"
        >
          <div class="flex items-center justify-between gap-space-md">
            <div class="flex items-center gap-space-md">
              <div
                class="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0"
              >
                <span class="material-symbols-outlined text-[28px]">{{ icon() }}</span>
              </div>
              <div class="flex flex-col">
                <h2 [id]="modalTitleId()" class="font-headline-sm text-headline-sm text-on-surface">
                  {{ title() }}
                </h2>
                @if (subtitle()) {
                  <span class="font-label-sm text-label-sm text-on-surface-variant">
                    {{ subtitle() }}
                  </span>
                }
              </div>
            </div>
            <button
              type="button"
              (click)="closed.emit()"
              aria-label="Fechar modal"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <ng-content />
        </div>
      </div>
    }
  `,
})
export class ModalShellComponent {
  public readonly isOpen = input.required<boolean>();
  public readonly title = input.required<string>();
  public readonly subtitle = input<string>('');
  public readonly icon = input<string>('verified_user');
  public readonly modalTitleId = input<string>('modal-dialog-title');
  public readonly closed = output<void>();

  public onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
