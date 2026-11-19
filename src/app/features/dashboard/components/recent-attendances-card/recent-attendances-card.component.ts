import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AtendimentoRecenteDto } from '../../../../core/models';

@Component({
  selector: 'app-recent-attendances-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-space-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[22px]">history_edu</span>
          <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">
            Atendimentos Recentes
          </h2>
        </div>
        <a
          routerLink="/gestao-e-cadastro"
          class="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-container font-semibold transition-colors"
        >
          <span>Ver Prontuários</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
      </div>

      <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
        @if (attendances().length === 0) {
          <div class="p-space-md text-center text-body-sm text-on-surface-variant">
            Nenhum atendimento recente registrado até o momento.
          </div>
        } @else {
          @for (item of attendances(); track item.idAgendamento; let last = $last) {
            <div
              [class]="
                item.prontuarioStatus === 'RASCUNHO'
                  ? 'p-space-sm rounded-lg bg-surface-container/50 flex flex-col gap-2'
                  : 'p-space-sm rounded-lg hover:bg-surface-container-low transition-colors flex flex-col gap-2'
              "
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-label-lg text-label-lg text-on-surface font-semibold">
                    {{ item.nomePaciente }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[11px] bg-surface-container text-on-surface-variant font-medium">
                    {{ item.modalidade === 'TELECONSULTA' ? 'Telessaúde' : 'Presencial' }}
                  </span>
                </div>
                <span class="font-label-sm text-label-sm text-on-surface-variant">
                  {{ formatDateTimeLabel(item.dataHoraSessao) }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-2">
                @if (item.prontuarioStatus === 'ASSINADO') {
                  <div class="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm font-semibold">
                    <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">task_alt</span>
                    <span>Prontuário Finalizado &amp; Assinado</span>
                  </div>
                } @else if (item.prontuarioStatus === 'RASCUNHO') {
                  <div class="flex items-center gap-1.5 text-error font-label-sm text-label-sm font-semibold">
                    <span class="material-symbols-outlined text-[16px]">pending_actions</span>
                    <span>Rascunho Salvo {{ formatDraftTime(item.horaRascunho) }} (Pendente)</span>
                  </div>
                } @else {
                  <div class="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                    <span class="material-symbols-outlined text-[16px]">inventory_2</span>
                    <span>Prontuário Arquivado</span>
                  </div>
                }

                @if (item.valorTotal != null) {
                  <span class="font-label-md text-label-md text-on-surface font-semibold shrink-0">
                    {{ formatCurrency(item.valorTotal) }}
                    <span
                      [class]="
                        item.statusSplit === 'LIQUIDADO'
                          ? 'text-secondary font-normal'
                          : 'text-on-surface-variant font-normal'
                      "
                    >
                      ({{ item.statusSplit === 'LIQUIDADO' ? (item.meioPagamento || 'Liquidado') : 'Em conciliação' }})
                    </span>
                  </span>
                } @else {
                  <span class="font-label-sm text-label-sm text-on-surface-variant">Sem cobrança</span>
                }
              </div>

              @if (item.prontuarioStatus === 'RASCUNHO') {
                <div class="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    (click)="resumeAndSign.emit(item)"
                    class="inline-flex items-center gap-1 text-primary hover:underline font-label-sm text-label-sm font-semibold cursor-pointer"
                  >
                    <span>Retomar e Assinar Digitalmente</span>
                    <span class="material-symbols-outlined text-[14px]">edit</span>
                  </button>
                </div>
              }
            </div>
            @if (!last) {
              <div class="w-full h-px bg-surface-container"></div>
            }
          }
        }

        <div class="pt-space-sm">
          <a
            routerLink="/painel-clinico"
            class="w-full py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-primary font-label-md text-label-md font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Acessar Relatório Completo de Atendimentos</span>
            <span class="material-symbols-outlined text-[16px]">receipt_long</span>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class RecentAttendancesCardComponent {
  public readonly attendances = input.required<readonly AtendimentoRecenteDto[]>();
  public readonly resumeAndSign = output<AtendimentoRecenteDto>();

  public formatDateTimeLabel(iso: string): string {
    const dt = new Date(iso);
    const today = new Date();
    const isToday = dt.toDateString() === today.toDateString();
    const time = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (isToday) {
      return `Hoje, ${time}`;
    }
    const date = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    return `${date}, ${time}`;
  }

  public formatDraftTime(iso?: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    return `às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  public formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
