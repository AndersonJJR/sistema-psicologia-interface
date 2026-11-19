import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AgendamentoHojeItemDto,
  AtendimentoRecenteDto,
  QuickAppointmentFormPayload,
} from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { ClinicalStoreService } from '../../../core/services/clinical-store.service';
import { LayoutService } from '../../../core/services/layout.service';
import { DashboardKpiCardsComponent } from '../components/dashboard-kpi-cards/dashboard-kpi-cards.component';
import { QuickAppointmentModalComponent } from '../components/quick-appointment-modal/quick-appointment-modal.component';
import { RecentAttendancesCardComponent } from '../components/recent-attendances-card/recent-attendances-card.component';
import { TodayAppointmentsCardComponent } from '../components/today-appointments-card/today-appointments-card.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    DashboardKpiCardsComponent,
    TodayAppointmentsCardComponent,
    RecentAttendancesCardComponent,
    QuickAppointmentModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col w-full gap-space-lg">
      <!-- 1. Cabeçalho de Boas-Vindas & Ações Rápidas -->
      <header class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
        <div class="flex flex-col gap-space-xs">
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            {{ greetingPrefix() }}, {{ store.profile().shortDisplayName || 'Psicólogo(a)' }}
          </h1>
          <p class="font-body-md text-body-md text-on-surface-variant">
            Aqui está o resumo da sua prática clínica e financeira para hoje, {{ store.currentDateHeaderLabel() }}.
          </p>
        </div>

        <div class="flex items-center gap-space-sm self-start lg:self-center">
          <button
            type="button"
            id="btn-quick-consult"
            (click)="onQuickConsult()"
            class="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-high text-primary hover:bg-surface-variant font-label-lg text-label-lg transition-colors shadow-sm cursor-pointer"
          >
            <span class="material-symbols-outlined text-[20px]">videocam</span>
            <span>Iniciar Consulta Rápida</span>
          </button>
          <button
            type="button"
            id="btn-dashboard-new-appointment"
            (click)="openNewAppointmentModal()"
            class="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg transition-colors shadow-md cursor-pointer"
          >
            <span class="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Novo Agendamento</span>
          </button>
        </div>
      </header>

      <!-- 2. Painel de Indicadores Principais -->
      <app-dashboard-kpi-cards [summary]="store.dashboardSummary()" />

      <!-- 3. Grid de 2 Colunas para Operações Centrais -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div class="lg:col-span-7">
          <app-today-appointments-card
            [appointments]="store.dashboardSummary().agendamentosHoje"
            (enterRoom)="onEnterSession($event)"
            (openRecord)="onOpenPatientRecord($event)"
          />
        </div>

        <div class="lg:col-span-5">
          <app-recent-attendances-card
            [attendances]="store.dashboardSummary().atendimentosRecentes"
            (resumeAndSign)="onResumeAndSign($event)"
          />
        </div>
      </section>
    </div>

    <app-quick-appointment-modal
      [isOpen]="isModalOpen()"
      [patients]="store.patientsList()"
      [approachLabel]="currentApproachLabel()"
      [submitting]="isSubmitting()"
      (closed)="closeModal()"
      (submitted)="onCreateAppointment($event)"
    />
  `,
})
export class DashboardPageComponent implements OnInit {
  public readonly store = inject(ClinicalStoreService);
  public readonly layout = inject(LayoutService);
  private readonly router = inject(Router);

  public readonly isModalOpen = signal<boolean>(false);
  public readonly isSubmitting = signal<boolean>(false);

  public readonly greetingPrefix = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  });

  public readonly currentApproachLabel = computed(() => {
    const key = this.store.profile().clinicalApproach;
    return (
      this.store.clinicalApproaches().find((opt) => opt.value === key)?.label ??
      'Terapia Cognitivo-Comportamental (TCC)'
    );
  });

  public ngOnInit(): void {
    this.store.loadDashboardSummaryFromBackend();
  }

  public openNewAppointmentModal(): void {
    this.isModalOpen.set(true);
  }

  public closeModal(): void {
    this.isModalOpen.set(false);
  }

  public onQuickConsult(): void {
    const hoje = this.store.dashboardSummary().agendamentosHoje;
    const next = hoje.find((a) => a.status === 'AGENDADO') ?? hoje[0];
    if (next) {
      this.onEnterSession(next);
      return;
    }
    void this.router.navigate(['/painel-clinico']);
  }

  public onEnterSession(item: AgendamentoHojeItemDto): void {
    this.store.selectedAgendamentoId.set(item.idAgendamento);
    void this.router.navigate(['/painel-clinico']);
  }

  public onOpenPatientRecord(item: AgendamentoHojeItemDto): void {
    this.store.selectPatientById(item.idPaciente);
    void this.router.navigate(['/gestao-e-cadastro']);
  }

  public onResumeAndSign(item: AtendimentoRecenteDto): void {
    this.store.selectedAgendamentoId.set(item.idAgendamento);
    void this.router.navigate(['/painel-clinico']);
  }

  public onCreateAppointment(payload: QuickAppointmentFormPayload): void {
    this.isSubmitting.set(true);
    this.store.createQuickAppointmentWithOptionalPatient(payload).subscribe({
      next: (dto) => {
        this.isSubmitting.set(false);
        this.isModalOpen.set(false);
        this.layout.showToast(
          'Agendamento Clínico Confirmado',
          `Consulta com ${dto.nomePaciente} marcada${payload.repeatWeekly ? ' com recorrência semanal' : ''}.`
        );
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        const msg = AuthService.extractErrorMessage(
          err,
          'Não foi possível confirmar o agendamento clínico.'
        );
        this.layout.showToast('Erro no Agendamento', msg, 'error');
      },
    });
  }
}
