import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AgendamentoHojeItemDto } from '../../../../core/models';
import { ClinicalStoreService } from '../../../../core/services/clinical-store.service';

@Component({
  selector: 'app-today-appointments-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-space-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[22px]">event_upcoming</span>
          <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">
            Agendamentos de Hoje
          </h2>
          <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
            {{ todayBadgeLabel() }}
          </span>
        </div>
        <a
          routerLink="/agenda"
          class="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-container font-semibold transition-colors"
        >
          <span>Ver Agenda Completa</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
      </div>

      @if (featuredAppointment(); as featured) {
        <!-- Card com destaque: Próxima Sessão Imediata -->
        <div class="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col gap-space-md">
          <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div class="flex items-center gap-space-sm flex-wrap">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-label-sm font-semibold">
                <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                Próxima Consulta • {{ formatTimeRange(featured) }}
              </span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                <span class="material-symbols-outlined text-[14px]">
                  {{ featured.modalidade === 'TELECONSULTA' ? 'videocam' : 'apartment' }}
                </span>
                {{ featured.modalidade === 'TELECONSULTA' ? 'Telessaúde' : 'Presencial' }}
              </span>
            </div>
            <span class="font-label-sm text-label-sm text-error font-medium flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">schedule</span>
              {{ getCountdownLabel(featured.dataHoraSessao) }}
            </span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-space-md">
            <img
              [src]="featured.avatarUrl || defaultAvatar"
              [alt]="featured.nomePaciente"
              class="w-14 h-14 rounded-full object-cover shadow-sm shrink-0"
            />
            <div class="flex flex-col">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {{ featured.nomePaciente }}
                </span>
                @if (featured.idadePaciente > 0) {
                  <span class="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                    {{ featured.idadePaciente }} anos
                  </span>
                }
              </div>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-on-surface-variant font-body-sm text-body-sm">
                <span class="font-medium text-primary">{{ formatApproachLabel(featured.abordagemClinica) }}</span>
                <span>•</span>
                <span>Sessão #{{ featured.numeroSessao }}</span>
                <span>•</span>
                <span class="text-secondary font-medium">
                  {{ featured.modalidade === 'TELECONSULTA' ? 'Link seguro criptografado pronto' : featured.enderecoLocalSessao }}
                </span>
              </div>
            </div>
          </div>

          <div class="p-space-sm rounded-lg bg-surface-container flex items-center justify-between gap-space-sm">
            <div class="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
              <span class="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
              <span>Sala com criptografia ponta a ponta (P2P WebRTC / AES-256)</span>
            </div>
            <span class="text-on-surface-variant font-label-sm text-label-sm font-semibold shrink-0">
              Sala #PS-{{ featured.idAgendamento.slice(0, 4).toUpperCase() }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-space-sm pt-space-xs">
            <button
              type="button"
              (click)="enterRoom.emit(featured)"
              class="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg transition-colors shadow-sm cursor-pointer"
            >
              <span class="material-symbols-outlined text-[20px]">video_call</span>
              <span>Entrar na Sala Segura</span>
            </button>
            <button
              type="button"
              (click)="openRecord.emit(featured)"
              class="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-variant font-label-lg text-label-lg transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[20px]">clinical_notes</span>
              <span>Abrir Prontuário</span>
            </button>
          </div>
        </div>
      } @else {
        <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col items-center justify-center text-center gap-space-sm">
          <div class="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-[26px]">event_available</span>
          </div>
          <p class="font-label-lg text-on-surface font-semibold">Nenhum agendamento pendente para hoje</p>
          <p class="font-body-sm text-on-surface-variant">
            Clique em "+ Novo Agendamento" para marcar uma nova sessão clínica.
          </p>
        </div>
      }

      @if (subsequentAppointments().length > 0) {
        <div class="flex flex-col gap-space-xs">
          <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold px-1">
            Sequência da Tarde
          </span>
          @for (item of subsequentAppointments(); track item.idAgendamento) {
            <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-space-md">
              <div class="flex items-center gap-space-md">
                <div class="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-surface-container-high text-on-surface shrink-0">
                  <span class="font-label-lg text-label-lg font-bold">{{ formatHour(item.dataHoraSessao) }}</span>
                  <span class="font-label-sm text-label-sm text-on-surface-variant">{{ formatEndHour(item) }}</span>
                </div>
                <div class="flex flex-col">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-label-lg text-label-lg text-on-surface font-semibold">
                      {{ item.nomePaciente }}
                    </span>
                    <span
                      [class]="
                        item.modalidade === 'PRESENCIAL'
                          ? 'px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm'
                          : 'px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm'
                      "
                    >
                      {{ item.modalidade === 'PRESENCIAL' ? 'Presencial' : 'Telessaúde' }}
                    </span>
                  </div>
                  <span class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {{ item.tipoSessao }} • Sessão #{{ item.numeroSessao }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-space-md">
                <span class="hidden sm:inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold">
                  <span class="material-symbols-outlined text-[16px]">
                    {{ item.status === 'REALIZADO' ? 'task_alt' : 'check_circle' }}
                  </span>
                  {{ item.status === 'REALIZADO' ? 'Realizada' : 'Confirmada' }}
                </span>
                <button
                  type="button"
                  (click)="enterRoom.emit(item)"
                  class="p-2 rounded-lg text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                  title="Abrir atendimento"
                >
                  <span class="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class TodayAppointmentsCardComponent {
  public readonly appointments = input.required<readonly AgendamentoHojeItemDto[]>();
  public readonly enterRoom = output<AgendamentoHojeItemDto>();
  public readonly openRecord = output<AgendamentoHojeItemDto>();

  public readonly defaultAvatar = ClinicalStoreService.DEFAULT_PATIENT_AVATAR;

  public readonly todayBadgeLabel = computed(() => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
  });

  public readonly featuredAppointment = computed<AgendamentoHojeItemDto | null>(() => {
    const list = this.appointments();
    if (list.length === 0) return null;
    return list.find((a) => a.status === 'AGENDADO') ?? list[0];
  });

  public readonly subsequentAppointments = computed<readonly AgendamentoHojeItemDto[]>(() => {
    const featured = this.featuredAppointment();
    if (!featured) return [];
    return this.appointments().filter((a) => a.idAgendamento !== featured.idAgendamento);
  });

  public formatHour(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  public formatEndHour(item: AgendamentoHojeItemDto): string {
    const d = new Date(item.dataHoraSessao);
    d.setMinutes(d.getMinutes() + (item.duracaoMinutos || 50));
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  public formatTimeRange(item: AgendamentoHojeItemDto): string {
    return `${this.formatHour(item.dataHoraSessao)} - ${this.formatEndHour(item)}`;
  }

  public getCountdownLabel(iso: string): string {
    const diffMin = Math.round((new Date(iso).getTime() - Date.now()) / 60000);
    if (diffMin <= 0) return 'Disponível agora';
    if (diffMin < 60) return `Inicia em ${diffMin} minutos`;
    const hours = Math.floor(diffMin / 60);
    return `Inicia em ${hours}h ${diffMin % 60}min`;
  }

  public formatApproachLabel(key: string): string {
    const map: Record<string, string> = {
      tcc: 'Terapia Cognitivo-Comportamental (TCC)',
      psicanalise: 'Psicanálise Clínica',
      humanista: 'Abordagem Humanista',
      gestalt: 'Gestalt-Terapia',
      analitica: 'Psicologia Analítica',
      fenomenologia: 'Fenomenológico-Existencial',
      sistemica: 'Terapia Sistêmica Familiar',
    };
    return map[key] ?? 'Psicoterapia Clínica';
  }
}
