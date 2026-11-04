import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PrivacyPortalState } from '../../../../core/models';

@Component({
  selector: 'app-patient-target-selector',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        <div>
          <span
            class="text-label-sm font-label-sm uppercase tracking-wider text-primary font-semibold"
          >
            Seleção do Prontuário Alvo
          </span>
          <h2 class="text-headline-sm font-headline-sm text-on-surface">
            Titular Requisitante ou Auditado
          </h2>
        </div>
        <div
          class="flex items-center gap-space-xs text-on-surface-variant text-body-sm font-body-sm"
        >
          <span class="material-symbols-outlined text-[18px] text-secondary">encrypted</span>
          <span>Acesso registrado sob Matrícula {{ crpLabel() }}</span>
        </div>
      </div>

      <div class="relative w-full">
        <div
          class="absolute inset-y-0 left-0 pl-space-md flex items-center pointer-events-none text-outline"
        >
          <span class="material-symbols-outlined text-[22px]">person_search</span>
        </div>
        <input
          id="paciente-search-input"
          type="text"
          [formControl]="searchControl()"
          placeholder="Digite o nome ou CPF do paciente..."
          class="w-full h-12 pl-12 pr-32 bg-surface-container-low text-on-surface placeholder-on-surface-variant font-body-lg text-body-lg rounded-xl focus:bg-surface-container-lowest focus:shadow-md transition-all outline-none"
        />
        <div class="absolute inset-y-0 right-2 flex items-center gap-1">
          <span
            class="px-2.5 py-1 bg-surface-container rounded-lg text-on-surface text-label-sm font-label-sm font-semibold"
          >
            {{ portalState().prontuarioStatusBadge }}
          </span>
        </div>
      </div>

      <!-- Metadados do Titular Selecionado -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm pt-space-xs">
        <div class="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-primary text-[20px]">badge</span>
          <div class="flex flex-col min-w-0">
            <span class="text-label-sm font-label-sm text-on-surface-variant">Titular</span>
            <span class="text-body-sm font-body-sm font-semibold text-on-surface truncate">
              {{ portalState().targetPatientShortName }}
            </span>
          </div>
        </div>

        <div class="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-primary text-[20px]">fingerprint</span>
          <div class="flex flex-col min-w-0">
            <span class="text-label-sm font-label-sm text-on-surface-variant">Documento CPF</span>
            <span class="text-body-sm font-body-sm font-semibold text-on-surface truncate">
              {{ portalState().targetPatientCpf }}
            </span>
          </div>
        </div>

        <div class="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-primary text-[20px]">schedule</span>
          <div class="flex flex-col min-w-0">
            <span class="text-label-sm font-label-sm text-on-surface-variant">
              Início do Acompanhamento
            </span>
            <span class="text-body-sm font-body-sm font-semibold text-on-surface truncate">
              {{ portalState().followUpSummary }}
            </span>
          </div>
        </div>

        <div class="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-secondary text-[20px]">security</span>
          <div class="flex flex-col min-w-0">
            <span class="text-label-sm font-label-sm text-on-surface-variant">
              Consentimento LGPD
            </span>
            <span class="text-body-sm font-body-sm font-semibold text-secondary truncate">
              {{ portalState().lgpdConsentLabel }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PatientTargetSelectorComponent {
  public readonly searchControl = input.required<FormControl<string>>();
  public readonly portalState = input.required<PrivacyPortalState>();
  public readonly crpLabel = input<string>('CRP 06/142980');
}
