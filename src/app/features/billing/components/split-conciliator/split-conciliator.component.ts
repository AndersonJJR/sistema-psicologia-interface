import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  ActiveBillingConciliation,
  PaymentMethodKey,
  PaymentMethodOption,
} from '../../../../core/models';

@Component({
  selector: 'app-split-conciliator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
      <!-- Coluna Esquerda: Contexto do Paciente & Forma de Liquidação (5 cols) -->
      <div
        class="lg:col-span-5 flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm"
      >
        <div class="flex items-center justify-between pb-space-sm border-b-0">
          <div class="flex items-center gap-space-xs">
            <span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span
              class="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider"
            >
              Atendimento em Conciliação
            </span>
          </div>
          <span
            data-role="payment-status"
            class="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-semibold"
          >
            <span class="material-symbols-outlined text-[14px]">check_circle</span>
            {{ conciliation().statusBadge }}
          </span>
        </div>

        <!-- Card do Paciente com Foto e Metadados -->
        <div class="flex items-center gap-space-md p-space-md rounded-lg bg-surface-container-low">
          <img
            class="w-14 h-14 rounded-full object-cover shadow-sm"
            alt="Foto do Paciente"
            [src]="conciliation().avatarUrl"
          />
          <div class="flex flex-col min-w-0">
            <span class="font-headline-sm text-headline-sm text-on-surface truncate">
              {{ conciliation().patientName }}
            </span>
            <span class="font-body-sm text-body-sm text-on-surface-variant">
              {{ conciliation().maskedCpfAndProntuario }}
            </span>
            <span class="font-label-sm text-label-sm text-primary font-medium mt-0.5">
              {{ conciliation().sessionSummary }}
            </span>
          </div>
        </div>

        <!-- Configuração de Pagamento e Valores -->
        <div class="flex flex-col gap-space-sm pt-space-xs">
          <div class="flex flex-col gap-1">
            <label
              for="payment-method-select"
              class="font-label-md text-label-md text-on-surface-variant font-medium"
            >
              Forma de Pagamento
            </label>
            <div class="relative">
              <select
                id="payment-method-select"
                [value]="conciliation().paymentMethod"
                (change)="onMethodChange($event)"
                class="w-full h-11 px-space-md pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md font-medium appearance-none focus:outline-none focus:bg-surface-container transition-colors cursor-pointer"
              >
                @for (opt of paymentOptions(); track opt.value) {
                  <option
                    [value]="opt.value"
                    [selected]="opt.value === conciliation().paymentMethod"
                  >
                    {{ opt.label }}
                  </option>
                }
              </select>
              <span
                class="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none text-[20px]"
              >
                expand_more
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <span class="font-label-md text-label-md text-on-surface-variant font-medium">
              Valor Total da Consulta
            </span>
            <div
              class="flex items-baseline justify-between p-space-md rounded-lg bg-surface-container text-on-surface"
            >
              <span class="font-headline-sm text-headline-sm font-semibold text-primary">BRL</span>
              <span
                id="gross-amount-display"
                class="font-display text-display font-bold text-on-surface tracking-tight"
              >
                {{ formatCurrency(conciliation().grossAmount) }}
              </span>
            </div>
            <span class="font-label-sm text-label-sm text-on-surface-variant text-right">
              Preço acordado no termo de consentimento inicial
            </span>
          </div>
        </div>
      </div>

      <!-- Coluna Direita: Arquitetura de Split & Conformidade Tributária (7 cols) -->
      <div class="lg:col-span-7 flex flex-col gap-space-md">
        <!-- Visual Split Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <!-- Card 1: Clínica (Infraestrutura) -->
          <div
            class="flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-24 h-24 bg-surface-variant/40 rounded-bl-full pointer-events-none"
            ></div>
            <div class="flex flex-col gap-space-xs z-10">
              <div class="flex items-center justify-between">
                <span
                  class="font-label-sm text-label-sm uppercase font-semibold text-tertiary tracking-wider"
                >
                  Parte 1 • Estabelecimento
                </span>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-variant text-tertiary font-label-sm text-label-sm font-bold"
                >
                  {{ conciliation().clinicPercentage.toFixed(1) }}%
                </span>
              </div>
              <h3 class="font-headline-sm text-headline-sm text-on-surface">
                Taxa de Infraestrutura da Clínica
              </h3>
              <p class="font-body-sm text-body-sm text-on-surface-variant">
                Locação de consultório, software em nuvem, recepção e agendamento.
              </p>
            </div>
            <div class="flex flex-col gap-space-sm mt-space-lg z-10">
              <div class="flex items-baseline gap-space-xs">
                <span class="font-display text-display text-on-surface font-bold">
                  {{ formatCurrency(clinicShare()) }}
                </span>
                <span class="font-label-sm text-label-sm text-on-surface-variant">taxa fixa</span>
              </div>
              <div
                class="inline-flex items-center gap-1.5 p-space-xs rounded-lg bg-surface-container text-tertiary"
              >
                <span class="material-symbols-outlined text-[16px]">receipt</span>
                <span class="font-label-sm text-label-sm font-semibold truncate">
                  {{ conciliation().clinicCnpjNote }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card 2: Psicólogo (Honorários Líquidos) -->
          <div
            class="flex flex-col justify-between p-space-lg rounded-xl bg-primary text-on-primary shadow-md relative overflow-hidden"
          >
            <div
              class="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-primary-container/60 pointer-events-none"
            ></div>
            <div class="flex flex-col gap-space-xs z-10">
              <div class="flex items-center justify-between">
                <span
                  class="font-label-sm text-label-sm uppercase font-semibold text-secondary-fixed tracking-wider"
                >
                  Parte 2 • Profissional
                </span>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold"
                >
                  {{ conciliation().psychologistPercentage.toFixed(1) }}%
                </span>
              </div>
              <h3 class="font-headline-sm text-headline-sm text-on-primary">
                Repasse Líquido do Psicólogo
              </h3>
              <p class="font-body-sm text-body-sm text-primary-fixed-dim">
                Honorários assistenciais diretos pelo serviço psicológico prestado.
              </p>
            </div>
            <div class="flex flex-col gap-space-sm mt-space-lg z-10">
              <div class="flex items-baseline gap-space-xs">
                <span class="font-display text-display text-on-primary font-bold">
                  {{ formatCurrency(psychologistShare()) }}
                </span>
                <span class="font-label-sm text-label-sm text-primary-fixed-dim">
                  direto na conta
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Diagrama de Conciliação em Fluxo -->
        <div
          class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-space-xs">
              <span class="material-symbols-outlined text-primary text-[20px]">sync_alt</span>
              <span class="font-headline-sm text-headline-sm text-on-surface">
                Conciliação Automática no Gateway de Split
              </span>
            </div>
            <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">
              TED/PIX Instantâneo
            </span>
          </div>

          <!-- Barra de Distribuição Gráfica com Labels -->
          <div class="flex flex-col gap-space-xs">
            <div class="w-full h-3 rounded-full bg-surface-container flex overflow-hidden">
              <div
                class="bg-tertiary-container h-full transition-all duration-500"
                [style.width.%]="conciliation().clinicPercentage"
                title="30% Clínica"
              ></div>
              <div
                class="bg-primary h-full transition-all duration-500"
                [style.width.%]="conciliation().psychologistPercentage"
                title="70% Psicólogo"
              ></div>
            </div>
            <div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-tertiary-container inline-block"></span>
                Retenção Operacional: {{ formatCurrency(clinicShare()) }}
              </span>
              <span class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-primary inline-block"></span>
                Saldo Disponível Psicólogo: {{ formatCurrency(psychologistShare()) }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs">
            <div
              class="flex items-center gap-space-xs p-space-sm rounded-lg bg-surface-container-low"
            >
              <span class="material-symbols-outlined text-secondary text-[20px]">
                verified_user
              </span>
              <div class="flex flex-col">
                <span class="font-label-sm text-label-sm font-semibold text-on-surface">
                  Subconta Bancária
                </span>
                <span class="font-body-sm text-body-sm text-on-surface-variant">
                  {{ conciliation().bankSubaccount }}
                </span>
              </div>
            </div>
            <div
              class="flex items-center gap-space-xs p-space-sm rounded-lg bg-surface-container-low"
            >
              <span class="material-symbols-outlined text-primary text-[20px]">rule_folder</span>
              <div class="flex flex-col">
                <span class="font-label-sm text-label-sm font-semibold text-on-surface">
                  Extrato Auditável
                </span>
                <span class="font-body-sm text-body-sm text-on-surface-variant">
                  {{ conciliation().auditExtractId }}
                </span>
              </div>
            </div>
            <div
              class="flex items-center gap-space-xs p-space-sm rounded-lg bg-surface-container-low"
            >
              <span class="material-symbols-outlined text-tertiary text-[20px]">cloud_done</span>
              <div class="flex flex-col">
                <span class="font-label-sm text-label-sm font-semibold text-on-surface">
                  Sincronização
                </span>
                <span class="font-body-sm text-body-sm text-on-surface-variant">
                  {{ conciliation().irpfSyncStatus }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SplitConciliatorComponent {
  public readonly conciliation = input.required<ActiveBillingConciliation>();
  public readonly paymentOptions = input.required<readonly PaymentMethodOption[]>();
  public readonly clinicShare = input.required<number>();
  public readonly psychologistShare = input.required<number>();
  public readonly methodChanged = output<PaymentMethodKey>();

  public onMethodChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.methodChanged.emit(select.value as PaymentMethodKey);
  }

  public formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  }
}
