import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BilledSessionTransaction, BillingFilterType } from '../../../../core/models';

@Component({
  selector: 'app-billed-sessions-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs"
      >
        <div class="flex flex-col">
          <h2 class="font-headline-sm text-headline-sm text-on-surface">
            Sessões Faturadas Recentes &amp; Segregação Contábil
          </h2>
          <span class="font-body-sm text-body-sm text-on-surface-variant">
            Histórico de liquidações automáticas com comprovantes vinculados ao prontuário
          </span>
        </div>
        <div class="flex items-center gap-space-xs">
          <span class="font-label-sm text-label-sm text-on-surface-variant">Filtro:</span>
          <button
            type="button"
            (click)="filterChanged.emit('todas')"
            [class]="filterBtnClass('todas')"
          >
            Todas
          </button>
          <button
            type="button"
            (click)="filterChanged.emit('liquidadas')"
            [class]="filterBtnClass('liquidadas')"
          >
            Liquidadas
          </button>
          <button
            type="button"
            (click)="filterChanged.emit('conciliacao')"
            [class]="filterBtnClass('conciliacao')"
          >
            Em Conciliação
          </button>
        </div>
      </div>

      <!-- Tabela Responsiva Sem Bordas -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr
              class="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider"
            >
              <th class="py-3 px-space-md rounded-l-lg">Data / Hora</th>
              <th class="py-3 px-space-md">Paciente</th>
              <th class="py-3 px-space-md">Forma / Status</th>
              <th class="py-3 px-space-md text-right">Valor Bruto</th>
              <th class="py-3 px-space-md text-right">Clínica (NFS-e)</th>
              <th class="py-3 px-space-md text-right">Psicólogo (Carnê-Leão)</th>
              <th class="py-3 px-space-md rounded-r-lg text-center">Comprovante Fiscal</th>
            </tr>
          </thead>
          <tbody class="divide-y-0">
            @for (tx of transactions(); track tx.id; let odd = $odd) {
              <tr
                [class]="
                  odd
                    ? 'bg-surface-container-low/40 hover:bg-surface-container-low transition-colors group'
                    : 'hover:bg-surface-container-low transition-colors group'
                "
              >
                <td class="py-space-md px-space-md whitespace-nowrap">
                  <span class="font-body-md text-body-md font-semibold text-on-surface">
                    {{ tx.dateLabel }}
                  </span>
                  <span class="block font-label-sm text-label-sm text-on-surface-variant">
                    {{ tx.timeAndModalityLabel }}
                  </span>
                </td>
                <td class="py-space-md px-space-md">
                  <div class="flex items-center gap-space-xs">
                    <span
                      [class]="
                        tx.initialsVariant === 'primary'
                          ? 'w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-label-sm text-label-sm text-primary font-bold'
                          : 'w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-label-sm text-label-sm text-tertiary font-bold'
                      "
                    >
                      {{ tx.patientInitials }}
                    </span>
                    <div class="flex flex-col">
                      <span class="font-body-md text-body-md font-medium text-on-surface">
                        {{ tx.patientName }}
                      </span>
                      <span class="font-label-sm text-label-sm text-on-surface-variant">
                        {{ tx.maskedCpf }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="py-space-md px-space-md whitespace-nowrap">
                  <div class="flex flex-col gap-0.5">
                    <span
                      [class]="
                        tx.settlementStatus === 'Liquidado'
                          ? 'inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm font-semibold'
                          : 'inline-flex items-center gap-1 text-on-surface font-label-sm text-label-sm font-semibold'
                      "
                    >
                      <span class="material-symbols-outlined text-[14px]">
                        {{ tx.paymentIcon }}
                      </span>
                      {{ tx.paymentMethodLabel }}
                    </span>
                    <span
                      [class]="
                        tx.settlementStatus === 'Liquidado'
                          ? 'inline-flex items-center px-1.5 py-0.2 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-medium w-max'
                          : 'inline-flex items-center px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-medium w-max'
                      "
                    >
                      {{ tx.settlementStatus }}
                    </span>
                  </div>
                </td>
                <td class="py-space-md px-space-md text-right whitespace-nowrap">
                  <span class="font-body-lg text-body-lg font-bold text-on-surface">
                    {{ formatCurrency(tx.grossAmount) }}
                  </span>
                </td>
                <td class="py-space-md px-space-md text-right whitespace-nowrap">
                  <span class="font-body-md text-body-md font-semibold text-tertiary">
                    {{ formatCurrency(tx.clinicShareAmount) }}
                  </span>
                  <span class="block font-label-sm text-label-sm text-on-surface-variant">
                    {{ tx.clinicPercentageLabel }}
                  </span>
                </td>
                <td class="py-space-md px-space-md text-right whitespace-nowrap">
                  <span class="font-body-md text-body-md font-bold text-primary">
                    {{ formatCurrency(tx.psychologistShareAmount) }}
                  </span>
                  <span class="block font-label-sm text-label-sm text-on-surface-variant">
                    {{ tx.psychologistPercentageLabel }}
                  </span>
                </td>
                <td class="py-space-md px-space-md text-center whitespace-nowrap">
                  <div class="inline-flex items-center gap-1">
                    <button
                      type="button"
                      title="Ver Recibo do Paciente"
                      (click)="viewReceipt.emit(tx)"
                      class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-[18px]">description</span>
                    </button>
                    <button
                      type="button"
                      title="Download XML Split"
                      (click)="downloadXml.emit(tx)"
                      class="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-tertiary transition-colors cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-[18px]">file_download</span>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Rodapé de Auditoria e Resumo de Fechamento -->
      <div
        class="flex flex-col md:flex-row items-center justify-between gap-space-sm pt-space-sm bg-surface-container-low p-space-md rounded-lg"
      >
        <div class="flex items-center gap-space-sm text-on-surface-variant">
          <span class="material-symbols-outlined text-secondary text-[22px]">gavel</span>
          <span class="font-body-sm text-body-sm">
            Aviso Legal: Operação amparada no Contrato de Parceria Clínica/Profissional e
            Resoluções CFP 01/2009 e CFP 11/2018.
          </span>
        </div>
        <div class="flex items-center gap-space-md">
          <div class="flex items-center gap-space-xs font-label-md text-label-md text-on-surface">
            <span class="text-on-surface-variant">Total Repassado no Mês:</span>
            <span class="text-primary font-bold text-headline-sm">{{ totalMonthlyRepass() }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BilledSessionsTableComponent {
  public readonly transactions = input.required<readonly BilledSessionTransaction[]>();
  public readonly activeFilter = input.required<BillingFilterType>();
  public readonly totalMonthlyRepass = input.required<string>();

  public readonly filterChanged = output<BillingFilterType>();
  public readonly viewReceipt = output<BilledSessionTransaction>();
  public readonly downloadXml = output<BilledSessionTransaction>();

  public filterBtnClass(filter: BillingFilterType): string {
    if (this.activeFilter() === filter) {
      return 'px-space-sm py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold cursor-pointer';
    }
    return 'px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm font-medium cursor-pointer';
  }

  public formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  }
}
