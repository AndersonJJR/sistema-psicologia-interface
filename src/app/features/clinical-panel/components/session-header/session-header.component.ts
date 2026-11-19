import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-session-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-space-md"
    >
      <div class="flex items-start md:items-center gap-space-md">
        <div
          class="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-headline-md text-headline-md shadow-inner shrink-0"
        >
          {{ patientInitials() }}
        </div>
        <div class="flex flex-col">
          <div class="flex flex-wrap items-center gap-x-space-sm gap-y-1">
            <h1 class="font-headline-md text-headline-md text-on-surface">
              {{ patientName() }}
            </h1>
            <span
              class="bg-surface-container-low px-space-sm py-0.5 rounded text-on-surface-variant font-label-sm text-label-sm"
            >
              {{ patientAgeLabel() }}
            </span>
          </div>
          <div
            class="flex flex-wrap items-center gap-x-space-md gap-y-1 mt-1 text-on-surface-variant font-body-sm text-body-sm"
          >
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px] text-primary">
                calendar_today
              </span>
              {{ sessionDateLabel() }}
            </span>
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px] text-tertiary">
                history_edu
              </span>
              {{ sessionNumberLabel() }}
            </span>
          </div>
        </div>
      </div>

      <!-- DIREITA: STATUS DO REGISTRO PÓS-SESSÃO -->
      <div class="flex flex-wrap items-center gap-space-sm">
        @if (isSigned()) {
          <div
            class="inline-flex items-center gap-2 px-space-md py-2 rounded-xl bg-secondary-container/50 text-on-secondary-container font-label-md text-label-md font-semibold"
          >
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span>Registro Pós-Sessão Assinado (Imutável)</span>
          </div>
        } @else {
          <div
            class="inline-flex items-center gap-2 px-space-md py-2 rounded-xl bg-surface-container-low text-primary font-label-md text-label-md font-semibold"
          >
            <span class="material-symbols-outlined text-[18px]">edit_document</span>
            <span>Documentação Pós-Sessão Vinculada</span>
          </div>
        }
      </div>
    </section>
  `,
})
export class SessionHeaderComponent {
  public readonly patientName = input.required<string>();
  public readonly patientInitials = input.required<string>();
  public readonly patientAgeLabel = input.required<string>();
  public readonly sessionDateLabel = input.required<string>();
  public readonly sessionNumberLabel = input.required<string>();
  public readonly isSigned = input<boolean>(false);
}
