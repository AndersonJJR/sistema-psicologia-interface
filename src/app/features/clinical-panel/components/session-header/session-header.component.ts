import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CrisisContactInfo } from '../../../../core/models';

@Component({
  selector: 'app-session-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-space-md"
    >
      <div class="flex items-start md:items-center gap-space-md">
        <div class="relative">
          <div
            class="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-headline-md text-headline-md shadow-inner"
          >
            {{ patientInitials() }}
          </div>
          <span
            class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"
          ></span>
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

      <!-- DIREITA: TIMER ATIVO & BOTÃO PROTOCOLO DE EMERGÊNCIA -->
      <div class="flex flex-wrap items-center gap-space-md">
        <!-- CRONÔMETRO DE SESSÃO TELEPSI -->
        <div
          class="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-sm rounded-xl"
        >
          <span class="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
          <div class="flex flex-col">
            <span
              class="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider"
            >
              Tempo Decorrido
            </span>
            <span
              id="session-timer"
              class="font-headline-sm text-headline-sm text-primary tracking-tight font-semibold"
            >
              {{ elapsedFormatted() }}
            </span>
          </div>
        </div>

        <!-- BOTÃO DE PROTOCOLO DE CRISE (HIGH CONTRAST RED TRIGGER) -->
        <div class="relative">
          <button
            type="button"
            id="btn-crisis-toggle"
            (click)="toggleCrisisCard.emit()"
            class="bg-error text-on-error px-space-md py-3 rounded-lg font-label-lg text-label-lg flex items-center gap-space-xs shadow-md hover:bg-on-error-container transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-[20px] animate-bounce">warning</span>
            <span>🚨 Exibir Contato de Emergência</span>
          </button>

          <!-- DROPDOWN / QUICK-ACCESS CARD DE CRISE -->
          @if (crisisCardOpen()) {
            <div
              id="crisis-card"
              class="absolute right-0 top-full mt-2 w-80 md:w-96 bg-surface-container-lowest rounded-xl shadow-xl p-space-md z-50 flex flex-col gap-space-sm border border-outline-variant/30"
            >
              <div
                class="flex items-center justify-between pb-space-xs bg-error-container/40 p-space-sm rounded-lg"
              >
                <div class="flex items-center gap-space-xs text-on-error-container">
                  <span class="material-symbols-outlined text-[18px]">emergency</span>
                  <span class="font-label-md text-label-md uppercase tracking-wider font-bold">
                    Protocolo SAMU / Risco Imediato
                  </span>
                </div>
                <button
                  type="button"
                  id="btn-crisis-close"
                  (click)="closeCrisisCard.emit()"
                  class="text-on-surface-variant hover:text-error cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div class="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
                <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Contato Referencial Principal
                </span>
                <div class="flex items-center justify-between">
                  <span class="font-headline-sm text-headline-sm text-on-surface">
                    {{ crisisInfo().contactName }}
                  </span>
                  <span
                    class="bg-surface-container px-space-xs py-0.5 rounded font-label-sm text-label-sm text-primary"
                  >
                    {{ crisisInfo().relationshipBadge }}
                  </span>
                </div>
                <a
                  class="inline-flex items-center gap-space-xs text-primary font-headline-sm text-headline-sm hover:underline mt-1"
                  [href]="crisisInfo().phoneHref"
                >
                  <span class="material-symbols-outlined text-[18px]">call</span>
                  {{ crisisInfo().phoneDisplay }}
                </a>
              </div>

              <div class="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
                <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Endereço Atual da Sessão
                </span>
                <p class="font-body-md text-body-md text-on-surface">
                  {{ crisisInfo().sessionAddressLine1 }}<br />
                  {{ crisisInfo().sessionAddressLine2 }}
                </p>
              </div>

              <div
                class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-1"
              >
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-secondary">
                    verified
                  </span>
                  Consentimento assinado
                </span>
                <button
                  type="button"
                  (click)="dispatchEmergencyAlert.emit()"
                  class="text-error font-semibold hover:underline cursor-pointer"
                >
                  Disparar Notificação
                </button>
              </div>
            </div>
          }
        </div>
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
  public readonly elapsedFormatted = input.required<string>();
  public readonly crisisInfo = input.required<CrisisContactInfo>();
  public readonly crisisCardOpen = input.required<boolean>();

  public readonly toggleCrisisCard = output<void>();
  public readonly closeCrisisCard = output<void>();
  public readonly dispatchEmergencyAlert = output<void>();
}
