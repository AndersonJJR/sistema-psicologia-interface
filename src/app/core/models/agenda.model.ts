export type CalendarViewMode = 'diario' | 'semanal' | 'mensal';

export type AppointmentVariant =
  | 'completed-supervision'
  | 'presential-today-highlight'
  | 'telehealth-standard'
  | 'active-selected-telehealth'
  | 'presential-muted'
  | 'presential-room2'
  | 'waiting-reception'
  | 'interval-prontuario'
  | 'day-closing';

export interface ScheduleSlotItem {
  readonly id: string;
  readonly dayIndex: number; // 0 = Seg, 1 = Ter, 2 = Qua, 3 = Qui, 4 = Sex
  readonly hourSlot: string;
  readonly timeRange?: string;
  readonly patientName: string;
  readonly subtitle: string;
  readonly statusLabel?: string;
  readonly variant: AppointmentVariant;
}

export interface CalendarDayColumn {
  readonly index: number;
  readonly shortDayLabel: string;
  readonly dateNumberLabel: string;
  readonly isToday: boolean;
}

export interface AgendaMetricCard {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  readonly value: string;
  readonly iconBgClass: string;
  readonly iconColorClass: string;
}

export interface NewAppointmentPayload {
  readonly patientName: string;
  readonly dayIndex: number;
  readonly hourSlot: string;
  readonly timeRange: string;
  readonly modality: 'Telessaúde' | 'Presencial';
  readonly roomOrNotes: string;
}
