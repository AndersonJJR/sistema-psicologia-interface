import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ConsentTermItem, TherapeuticPlanSummary } from '../../../../core/models';

@Component({
  selector: 'app-patient-settings-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
      <!-- Configurações & Guarda -->
      <div
        class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-headline-sm text-headline-sm text-on-surface">
            Configurações &amp; Guarda
          </h2>
          <span class="material-symbols-outlined text-primary text-[24px]">security</span>
        </div>

        <div
          class="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between"
        >
          <div class="flex flex-col">
            <span class="font-label-lg text-label-lg text-on-surface">Status do Paciente</span>
            <span
              id="statusLabel"
              [class]="
                activeInPsychotherapy()
                  ? 'font-body-sm text-body-sm text-secondary font-medium'
                  : 'font-body-sm text-body-sm text-on-surface-variant font-medium'
              "
            >
              {{
                activeInPsychotherapy()
                  ? 'Ativo em Psicoterapia'
                  : 'Inativo / Alta Temporária'
              }}
            </span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              id="pacienteStatusToggle"
              type="checkbox"
              class="sr-only peer"
              [checked]="activeInPsychotherapy()"
              (change)="onStatusToggle($event)"
            />
            <div
              class="w-12 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"
            ></div>
          </label>
        </div>

        <div class="flex flex-col gap-space-sm">
          <span class="font-label-md text-label-md text-on-surface">
            Termos &amp; Consentimentos Firmados
          </span>
          <div class="flex flex-col gap-space-xs">
            @for (term of signedConsents(); track term.id) {
              <div
                class="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded-lg shadow-sm"
              >
                <div class="flex items-center gap-space-xs min-w-0">
                  <span class="material-symbols-outlined text-secondary text-[18px]">
                    check_circle
                  </span>
                  <span class="font-body-sm text-body-sm text-on-surface truncate">
                    {{ term.title }}
                  </span>
                </div>
                <span class="font-label-sm text-label-sm text-primary font-mono">
                  {{ term.badgeLabel }}
                </span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Resumo do Plano Terapêutico -->
      <div
        class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md"
      >
        <div class="flex items-center gap-space-xs text-on-surface">
          <span class="material-symbols-outlined text-primary text-[20px]">
            quick_reference_all
          </span>
          <h3 class="font-label-lg text-label-lg font-semibold">Resumo do Plano Terapêutico</h3>
        </div>
        <div class="grid grid-cols-2 gap-space-sm">
          <div class="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant">
              Sessões Realizadas
            </span>
            <span class="font-headline-sm text-headline-sm text-primary">
              {{ therapeuticPlan().completedSessions }}
            </span>
          </div>
          <div class="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant">Assiduidade</span>
            <span class="font-headline-sm text-headline-sm text-secondary">
              {{ therapeuticPlan().attendanceRate }}
            </span>
          </div>
          <div class="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant">Enquadre</span>
            <span class="font-body-sm text-body-sm text-on-surface font-semibold">
              {{ therapeuticPlan().framing }}
            </span>
          </div>
          <div class="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant">Classificação</span>
            <span class="font-body-sm text-body-sm text-on-surface font-semibold">
              {{ therapeuticPlan().cidClassification }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PatientSettingsSummaryComponent {
  public readonly activeInPsychotherapy = input.required<boolean>();
  public readonly signedConsents = input.required<readonly ConsentTermItem[]>();
  public readonly therapeuticPlan = input.required<TherapeuticPlanSummary>();
  public readonly statusChanged = output<boolean>();

  public onStatusToggle(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.statusChanged.emit(inputEl.checked);
  }
}
