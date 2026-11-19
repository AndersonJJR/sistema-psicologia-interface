import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CompletedSessionRecordItem } from '../../../../core/models';

@Component({
  selector: 'app-completed-sessions-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div class="flex items-center gap-space-sm">
          <div class="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px]">assignment_late</span>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">
                Atendimentos Realizados — Registro Pós-Sessão
              </h2>
              <span
                [class]="
                  pendingCount() > 0
                    ? 'px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold'
                    : 'px-2.5 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-label-sm font-semibold'
                "
              >
                {{ pendingCount() }} {{ pendingCount() === 1 ? 'pendente' : 'pendentes' }}
              </span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              Selecione uma sessão já realizada para documentar o Prontuário Psicológico e o Registro Documental.
            </p>
          </div>
        </div>

        <div class="inline-flex rounded-xl bg-surface-container p-1 self-start sm:self-center shrink-0">
          <button
            type="button"
            id="btn-filter-pending-sessions"
            (click)="filterMode.set('pending')"
            [class]="
              filterMode() === 'pending'
                ? 'px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold shadow-xs cursor-pointer'
                : 'px-3 py-1.5 rounded-lg text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface cursor-pointer'
            "
          >
            Pendentes ({{ pendingCount() }})
          </button>
          <button
            type="button"
            id="btn-filter-all-sessions"
            (click)="filterMode.set('all')"
            [class]="
              filterMode() === 'all'
                ? 'px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold shadow-xs cursor-pointer'
                : 'px-3 py-1.5 rounded-lg text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface cursor-pointer'
            "
          >
            Todos Realizados ({{ sessions().length }})
          </button>
        </div>
      </div>

      @if (filteredSessions().length === 0) {
        <div class="p-space-md rounded-xl bg-surface-container-low text-center flex flex-col items-center gap-1">
          <span class="material-symbols-outlined text-secondary text-[28px]">task_alt</span>
          <p class="font-label-lg text-on-surface font-semibold">
            {{
              filterMode() === 'pending'
                ? 'Nenhum atendimento realizado com pendência de registro.'
                : 'Nenhum atendimento realizado encontrado.'
            }}
          </p>
          <p class="font-body-sm text-on-surface-variant">
            Os prontuários são habilitados exclusivamente após a realização da sessão na agenda.
          </p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-sm">
          @for (item of filteredSessions(); track item.agendamentoId) {
            <button
              type="button"
              (click)="selectSession.emit(item.agendamentoId)"
              [class]="
                selectedAgendamentoId() === item.agendamentoId
                  ? 'text-left p-space-md rounded-xl border-2 border-primary bg-primary/5 shadow-sm flex flex-col gap-2 transition-all cursor-pointer'
                  : 'text-left p-space-md rounded-xl border border-surface-container bg-surface-bright hover:border-primary/40 hover:bg-surface-container-low flex flex-col gap-2 transition-all cursor-pointer'
              "
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex flex-col">
                  <span class="font-label-lg text-label-lg text-on-surface font-bold">
                    {{ item.patientName }}
                  </span>
                  <span class="font-label-sm text-label-sm text-on-surface-variant">
                    {{ formatDateTime(item.dataHoraSessao) }} •
                    {{ item.modalidade === 'TELECONSULTA' ? 'Telessaúde' : 'Presencial' }}
                  </span>
                </div>
                @if (selectedAgendamentoId() === item.agendamentoId) {
                  <span class="px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] font-semibold shrink-0">
                    Selecionado
                  </span>
                }
              </div>

              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span
                  [class]="
                    item.hasSignedProntuario
                      ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-[11px] font-semibold'
                      : item.hasDraftProntuario
                        ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-[11px] font-semibold'
                        : 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-semibold'
                  "
                >
                  <span class="material-symbols-outlined text-[13px]">description</span>
                  {{
                    item.hasSignedProntuario
                      ? 'Prontuário Assinado'
                      : item.hasDraftProntuario
                        ? 'Prontuário em Rascunho'
                        : 'Prontuário Pendente'
                  }}
                </span>

                <span
                  [class]="
                    item.hasPrivateRecord
                      ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-[11px] font-semibold'
                      : 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[11px] font-semibold'
                  "
                >
                  <span class="material-symbols-outlined text-[13px]">lock</span>
                  {{ item.hasPrivateRecord ? 'Registro Documental OK' : 'Registro Doc. Pendente' }}
                </span>
              </div>
            </button>
          }
        </div>
      }
    </section>
  `,
})
export class CompletedSessionsListComponent {
  public readonly sessions = input.required<readonly CompletedSessionRecordItem[]>();
  public readonly selectedAgendamentoId = input<string | null>(null);
  public readonly selectSession = output<string>();

  public readonly filterMode = signal<'pending' | 'all'>('pending');

  public readonly pendingCount = computed(
    () => this.sessions().filter((s) => s.isPending).length
  );

  public readonly filteredSessions = computed(() => {
    const list = this.sessions();
    return this.filterMode() === 'pending' ? list.filter((s) => s.isPending) : list;
  });

  public formatDateTime(iso: string): string {
    const d = new Date(iso);
    const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${date} às ${time}`;
  }
}
