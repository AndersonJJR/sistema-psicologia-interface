import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  CalendarViewMode,
  NewAppointmentPayload,
  ScheduleSlotItem,
} from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { ClinicalStoreService } from '../../../core/services/clinical-store.service';
import { LayoutService } from '../../../core/services/layout.service';
import { AgendaMetricsBarComponent } from '../components/agenda-metrics-bar/agenda-metrics-bar.component';
import { AppointmentModalComponent } from '../components/appointment-modal/appointment-modal.component';
import { TimetableGridComponent } from '../components/timetable-grid/timetable-grid.component';

@Component({
  selector: 'app-agenda-page',
  standalone: true,
  imports: [AgendaMetricsBarComponent, TimetableGridComponent, AppointmentModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col w-full gap-space-lg">
      <!-- Header Context & Quick Metric Ribbon -->
      <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
        <div class="flex flex-col">
          <div class="flex items-center gap-space-md mt-1">
            <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Agenda Clínica
            </h1>
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md"
            >
              <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              {{ store.sessionsTodayBadge() }}
            </span>
          </div>
        </div>

        <!-- View Modes, Navigation & Date Anchor -->
        <div class="flex flex-wrap items-center gap-space-sm">
          <!-- Calendar View Picker -->
          <div class="flex items-center p-1 bg-surface-container-high rounded-xl">
            <button
              type="button"
              (click)="setViewMode('diario')"
              [class]="viewButtonClasses('diario')"
            >
              Diário
            </button>
            <button
              type="button"
              (click)="setViewMode('semanal')"
              [class]="viewButtonClasses('semanal')"
            >
              Semanal
            </button>
            <button
              type="button"
              (click)="setViewMode('mensal')"
              [class]="viewButtonClasses('mensal')"
            >
              Mensal
            </button>
          </div>

          <!-- Date Navigator -->
          <div
            class="flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-1 rounded-xl shadow-sm"
          >
            <button
              type="button"
              (click)="onNavigateWeek(-1)"
              aria-label="Semana anterior"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition cursor-pointer"
            >
              <span class="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <div class="flex items-center gap-1.5 px-2">
              <span class="material-symbols-outlined text-primary text-[18px]">
                calendar_today
              </span>
              <span class="font-label-lg text-label-lg text-on-surface font-semibold">
                {{ store.currentWeekRangeLabel() }}
              </span>
            </div>
            <button
              type="button"
              (click)="onNavigateWeek(1)"
              aria-label="Próxima semana"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition cursor-pointer"
            >
              <span class="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
            <button
              type="button"
              (click)="onResetToday()"
              class="px-2.5 py-1 text-primary hover:bg-surface-container-low font-label-sm text-label-sm font-semibold rounded-md transition cursor-pointer"
            >
              Hoje
            </button>
          </div>

          <!-- Quick Action -->
          <button
            type="button"
            (click)="openAppointmentModal()"
            class="flex items-center gap-space-xs px-space-md py-2 bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg rounded-xl shadow-sm transition cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>Novo Horário</span>
          </button>
        </div>
      </div>

      <!-- Weekly Overview Summary Bar -->
      <app-agenda-metrics-bar [metrics]="store.agendaMetrics()" />

      <!-- Main Clinical Schedule Grid -->
      <app-timetable-grid
        [days]="store.agendaDays()"
        [hours]="store.agendaHours()"
        [slots]="store.scheduleSlots()"
        (slotSelected)="onSlotSelected($event)"
      />

      <!-- New Appointment Modal -->
      <app-appointment-modal
        [isOpen]="isModalOpen()"
        [days]="store.agendaDays()"
        [patients]="store.patientsList()"
        (closed)="closeAppointmentModal()"
        (appointmentCreated)="onAppointmentCreated($event)"
      />
    </div>
  `,
})
export class AgendaPageComponent implements OnInit {
  public readonly store = inject(ClinicalStoreService);
  private readonly layout = inject(LayoutService);
  private readonly router = inject(Router);

  public readonly isModalOpen = signal<boolean>(false);

  public ngOnInit(): void {
    this.store.loadAgendamentosFromBackend();
  }

  public viewButtonClasses(mode: CalendarViewMode): string {
    if (this.store.calendarViewMode() === mode) {
      return 'px-space-md py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-lg text-label-lg shadow-sm cursor-pointer';
    }
    return 'px-space-md py-1.5 rounded-lg text-on-surface-variant font-label-lg text-label-lg transition hover:text-on-surface cursor-pointer';
  }

  public setViewMode(mode: CalendarViewMode): void {
    this.store.setCalendarViewMode(mode);
  }

  public onNavigateWeek(direction: -1 | 1): void {
    this.store.navigateWeek(direction);
  }

  public onResetToday(): void {
    this.store.resetWeekToToday();
    this.store.setCalendarViewMode('semanal');
  }

  public openAppointmentModal(): void {
    this.isModalOpen.set(true);
  }

  public closeAppointmentModal(): void {
    this.isModalOpen.set(false);
  }

  public onAppointmentCreated(payload: NewAppointmentPayload): void {
    this.store.createAppointmentOnBackend(payload).subscribe({
      next: () => {
        this.isModalOpen.set(false);
        this.layout.showToast(
          'Horário Clínico Agendado',
          `Sessão de ${payload.patientName} reservada às ${payload.hourSlot} (${payload.modality}).`
        );
      },
      error: (err: unknown) => {
        this.layout.showToast(
          'Não Foi Possível Agendar',
          AuthService.extractErrorMessage(err, 'Conflito de horário ou erro ao agendar sessão.'),
          'error'
        );
      },
    });
  }

  public onSlotSelected(slot: ScheduleSlotItem): void {
    this.store.selectAppointmentSlotForClinicalPanel(slot);
    if (slot.variant === 'active-selected-telehealth' || slot.agendamentoId) {
      void this.router.navigate(['/painel-clinico']);
      return;
    }
    this.layout.showToast(
      `Sessão: ${slot.patientName}`,
      `${slot.timeRange ?? slot.hourSlot} • ${slot.subtitle}`,
      'event_available'
    );
  }
}
