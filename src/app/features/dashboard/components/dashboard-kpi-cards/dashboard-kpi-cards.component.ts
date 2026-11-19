import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DashboardResumoApiDto } from '../../../../core/models';

@Component({
  selector: 'app-dashboard-kpi-cards',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
      <!-- Card 1: Repasse Líquido (Carnê-Leão) -->
      <div class="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Repasse Líquido (Carnê-Leão)
            </span>
            <span class="font-display text-display text-primary tracking-tight mt-1">
              {{ repasseFormatted() }}
            </span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-secondary-container/40 text-on-secondary-container flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px]">payments</span>
          </div>
        </div>
        <div class="mt-space-sm pt-space-xs">
          <div class="flex items-center justify-between text-on-surface-variant">
            <span class="font-label-sm text-label-sm">
              Bruto: {{ brutoFormatted() }} | Ret. (30%): {{ retencaoFormatted() }}
            </span>
            <span class="inline-flex items-center text-secondary font-label-sm text-label-sm font-semibold shrink-0 ml-1">
              <span class="material-symbols-outlined text-[16px]">trending_up</span>
              {{ variacaoLabel() }}
            </span>
          </div>
          <div class="mt-2 w-full h-8">
            <svg class="w-full h-full text-secondary" fill="none" preserveAspectRatio="none" viewBox="0 0 100 24">
              <path
                [attr.d]="sparklinePath()"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
              <path
                [attr.d]="sparklineAreaPath()"
                fill="currentColor"
                fill-opacity="0.08"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Card 2: Consultas Marcadas Hoje -->
      <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Consultas Marcadas Hoje
            </span>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="font-display text-display text-on-surface font-bold">
                {{ summary().totalConsultasHoje }}
              </span>
              <span class="font-label-md text-label-md text-on-surface-variant">
                {{ summary().totalConsultasHoje === 1 ? 'sessão' : 'sessões' }}
              </span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px]">calendar_today</span>
          </div>
        </div>
        <div class="mt-space-sm pt-space-xs flex flex-col gap-1.5">
          <div class="flex items-center gap-space-sm">
            <span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
              <span class="w-2 h-2 rounded-full bg-primary"></span>
              {{ summary().totalTelessaudeHoje }} Telessaúde
            </span>
            <span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
              <span class="w-2 h-2 rounded-full bg-tertiary"></span>
              {{ summary().totalPresenciaisHoje }} {{ summary().totalPresenciaisHoje === 1 ? 'Presencial' : 'Presenciais' }}
            </span>
          </div>
          @if (summary().proximaConsulta; as prox) {
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
              <span class="material-symbols-outlined text-[15px]">alarm</span>
              Próxima às {{ prox.horarioInicio }} ({{ prox.minutosParaInicio === 0 ? 'agora' : 'em ' + prox.minutosParaInicio + ' min' }})
            </div>
          } @else {
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium">
              <span class="material-symbols-outlined text-[15px]">event_available</span>
              Sem sessões pendentes hoje
            </div>
          }
        </div>
      </div>

      <!-- Card 3: Taxa de Assiduidade -->
      <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Taxa de Assiduidade
            </span>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="font-display text-display text-on-surface font-bold">
                {{ summary().taxaAssiduidade }}%
              </span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-surface-container-high text-secondary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px]">trending_up</span>
          </div>
        </div>
        <div class="mt-space-sm pt-space-xs flex flex-col gap-2">
          <div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
            <div
              class="bg-secondary h-full rounded-full transition-all duration-500"
              [style.width.%]="summary().taxaAssiduidade"
            ></div>
          </div>
          <div class="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
            <span>{{ summary().pacientesAtivos }} Pacientes ativos</span>
            <span class="font-medium text-on-surface">{{ assiduidadeLabel() }}</span>
          </div>
        </div>
      </div>

      <!-- Card 4: Pendências Regulatórias -->
      <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Pendências Regulatórias
            </span>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="font-display text-display text-error font-bold">
                {{ summary().prontuariosEmRascunho }}
              </span>
              <span class="font-label-md text-label-md text-on-surface-variant">em rascunho</span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-error-container text-on-error-container flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px]">draw</span>
          </div>
        </div>
        <div class="mt-space-sm pt-space-xs flex flex-col gap-1.5">
          <span class="font-body-sm text-body-sm text-on-surface-variant">
            Prontuários aguardando assinatura ICP-Brasil
          </span>
          <div class="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
            <span class="material-symbols-outlined text-[15px] text-tertiary">info</span>
            <span>Prazo CFP: registro em até 48h</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class DashboardKpiCardsComponent {
  public readonly summary = input.required<DashboardResumoApiDto>();

  public readonly repasseFormatted = computed(() =>
    this.formatCurrency(this.summary().repasseLiquidoMes)
  );
  public readonly brutoFormatted = computed(() =>
    this.formatCurrencyCompact(this.summary().valorBrutoMes)
  );
  public readonly retencaoFormatted = computed(() =>
    this.formatCurrencyCompact(this.summary().retencaoClinicaMes)
  );

  public readonly variacaoLabel = computed(() => {
    const v = this.summary().variacaoPercentualMes;
    return v >= 0 ? `+${v}%` : `${v}%`;
  });

  public readonly assiduidadeLabel = computed(() => {
    const rate = this.summary().taxaAssiduidade;
    if (rate >= 90) return 'Excelente índice';
    if (rate >= 75) return 'Bom índice';
    return 'Atenção clínica';
  });

  public readonly sparklinePath = computed(() => {
    const points = this.summary().sparklineFinanceiro;
    if (!points || points.length < 2) {
      return 'M0 20 L15 17 L30 19 L45 12 L60 14 L75 8 L90 10 L100 3';
    }
    const max = Math.max(...points, 1);
    const min = Math.min(...points, 0);
    const range = Math.max(max - min, 1);
    return points
      .map((val, idx) => {
        const x = Math.round((idx / (points.length - 1)) * 100);
        const y = Math.round(21 - ((val - min) / range) * 17);
        return `${idx === 0 ? 'M' : 'L'}${x} ${y}`;
      })
      .join(' ');
  });

  public readonly sparklineAreaPath = computed(
    () => `${this.sparklinePath()} L100 24 L0 24 Z`
  );

  private formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  private formatCurrencyCompact(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  }
}
