import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PortabilityFormatCard } from '../../../../core/models';

@Component({
  selector: 'app-portability-export-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-stretch">
      <!-- Painel de Portabilidade & Exportação Oficial -->
      <div
        class="xl:col-span-12 bg-surface-container-lowest rounded-xl p-space-xl shadow-sm flex flex-col justify-between gap-space-lg"
      >
        <div class="flex flex-col gap-space-md">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div class="flex items-center gap-space-sm">
              <div
                class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary"
              >
                <span class="material-symbols-outlined text-[24px]">output</span>
              </div>
              <div>
                <h2 class="text-headline-md font-headline-md text-on-surface">
                  Portabilidade de Dados Pessoais &amp; Clínicos
                </h2>
              </div>
            </div>
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-label-sm font-label-sm"
            >
              <span class="material-symbols-outlined text-[16px] text-primary">verified_user</span>
              Padrão ICP-Brasil Nativo
            </span>
          </div>

          <!-- Alerta Mandatório CFP sobre Sigilo Profissional -->
          <div class="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-md">
            <span class="material-symbols-outlined text-primary text-[26px] mt-0.5">
              lock_person
            </span>
            <div class="flex flex-col gap-space-xs">
              <span class="text-label-lg font-label-lg text-primary font-semibold">
                Delimitação Legal de Conteúdo (Resolução CFP nº 01/2009 e Art. 9º Código de Ética)
              </span>
              <p class="text-body-md font-body-md text-on-surface leading-relaxed">
                A exportação oficial contém exclusivamente os registros da
                <strong>Aba 1 (Prontuário Psicológico Formal)</strong>: dados cadastrais, evolução
                clínica sintetizada, datas de sessões e recibos. As
                <strong>
                  notas privativas do psicólogo são protegidas por sigilo profissional perpétuo
                </strong>
                , não sendo passíveis de portabilidade, compartilhamento ou requerimento civil
                comum.
              </p>
            </div>
          </div>

          <!-- Especificações Técnicas do Pacote Criptográfico -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
            @for (fmt of formats(); track fmt.id) {
              <div
                class="bg-surface-container rounded-xl p-space-md flex flex-col justify-between gap-space-sm"
              >
                <div class="flex items-center justify-between">
                  <span
                    class="text-label-sm font-label-sm text-on-surface-variant font-semibold uppercase"
                  >
                    {{ fmt.formatHeader }}
                  </span>
                  <span [class]="'material-symbols-outlined text-[20px] ' + fmt.iconColorClass">
                    {{ fmt.icon }}
                  </span>
                </div>
                <div>
                  <span class="text-headline-sm font-headline-sm text-on-surface">
                    {{ fmt.title }}
                  </span>
                  <p class="text-body-sm font-body-sm text-on-surface-variant">
                    {{ fmt.description }}
                  </p>
                </div>
                <div
                  [class]="
                    'flex items-center gap-1 text-label-sm font-label-sm font-semibold ' +
                    fmt.validationColorClass
                  "
                >
                  <span class="material-symbols-outlined text-[16px]">check_circle</span>
                  {{ fmt.validationLabel }}
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Ação Primária de Exportação -->
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-sm"
        >
          <div
            class="flex items-center gap-space-xs text-on-surface-variant text-label-sm font-label-sm"
          >
            <span class="material-symbols-outlined text-[18px]">history</span>
            <span>{{ lastEmissionLabel() }}</span>
          </div>

          <button
            type="button"
            id="btn-export-records"
            [disabled]="isExporting()"
            (click)="exportRequested.emit()"
            class="w-full sm:w-auto px-space-xl py-3.5 bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg rounded-xl shadow-md flex items-center justify-center gap-space-sm transition-all cursor-pointer disabled:opacity-70"
          >
            @if (isExporting()) {
              <span class="material-symbols-outlined animate-spin text-[20px]">sync</span>
              <span>Empacotando e Assinando Digitalmente...</span>
            } @else {
              <span class="material-symbols-outlined text-[22px]">download</span>
              <span>Exportar Prontuário Clínico Completo (PDF/A + JSON)</span>
              <span class="material-symbols-outlined text-[18px] opacity-80">
                workspace_premium
              </span>
            }
          </button>
        </div>
      </div>
    </div>
  `,
})
export class PortabilityExportPanelComponent {
  public readonly formats = input.required<readonly PortabilityFormatCard[]>();
  public readonly lastEmissionLabel = input.required<string>();
  public readonly isExporting = input.required<boolean>();
  public readonly exportRequested = output<void>();
}
