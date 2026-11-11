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
  readonly agendamentoId?: string;
  readonly patientId?: string;
  readonly dayIndex: number; // 0 = Seg, 1 = Ter, 2 = Qua, 3 = Qui, 4 = Sex
  readonly hourSlot: string;
  readonly timeRange?: string;
  readonly patientName: string;
  readonly subtitle: string;
  readonly statusLabel?: string;
  readonly variant: AppointmentVariant;
  readonly sessionDate?: string;
}

export interface CalendarMonthCell {
  readonly date: Date;
  readonly dateString: string;
  readonly dayNumber: number;
  readonly isCurrentMonth: boolean;
  readonly isToday: boolean;
  readonly isSelected: boolean;
  readonly sessionsCount: number;
  readonly summarySlots: readonly ScheduleSlotItem[];
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
  readonly patientId?: string;
  readonly patientName: string;
  readonly dayIndex: number;
  readonly hourSlot: string;
  readonly timeRange: string;
  readonly modality: 'Telessaúde' | 'Presencial';
  readonly roomOrNotes: string;
}

export type ModalidadeAtendimentoApi = 'PRESENCIAL' | 'TELECONSULTA';
export type StatusAgendamentoApi = 'AGENDADO' | 'REALIZADO' | 'CANCELADO' | 'FALTA';

export interface AgendamentoApiDto {
  readonly idAgendamento: string;
  readonly idPsicologo: string;
  readonly nomePsicologo: string;
  readonly idPaciente: string;
  readonly nomePaciente: string;
  readonly contatoEmergenciaNome: string;
  readonly contatoEmergenciaTelefone: string;
  readonly dataHoraSessao: string;
  readonly modalidade: ModalidadeAtendimentoApi;
  readonly status: StatusAgendamentoApi;
  readonly enderecoLocalSessao: string;
  readonly ativo: boolean;
  readonly deletedAt: string | null;
}

export interface AgendamentoRequestDto {
  readonly idPsicologo: string;
  readonly idPaciente: string;
  readonly dataHoraSessao: string;
  readonly modalidade: ModalidadeAtendimentoApi;
  readonly status?: StatusAgendamentoApi;
  readonly enderecoLocalSessao?: string;
}
