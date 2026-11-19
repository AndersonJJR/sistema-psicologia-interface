import { ModalidadeAtendimentoApi, StatusAgendamentoApi } from './agenda.model';
import { StatusSplitApi } from './billing.model';

export interface ProximaConsultaResumoDto {
  readonly idAgendamento: string;
  readonly horarioInicio: string;
  readonly minutosParaInicio: number;
}

export interface AgendamentoHojeItemDto {
  readonly idAgendamento: string;
  readonly idPaciente: string;
  readonly nomePaciente: string;
  readonly avatarUrl?: string | null;
  readonly idadePaciente: number;
  readonly abordagemClinica: string;
  readonly numeroSessao: number;
  readonly dataHoraSessao: string;
  readonly duracaoMinutos: number;
  readonly modalidade: ModalidadeAtendimentoApi;
  readonly status: StatusAgendamentoApi;
  readonly enderecoLocalSessao: string;
  readonly tipoSessao: string;
}

export interface AtendimentoRecenteDto {
  readonly idAgendamento: string;
  readonly idPaciente: string;
  readonly nomePaciente: string;
  readonly modalidade: ModalidadeAtendimentoApi;
  readonly dataHoraSessao: string;
  readonly prontuarioStatus: 'ASSINADO' | 'RASCUNHO' | 'ARQUIVADO' | 'PENDENTE';
  readonly horaRascunho?: string | null;
  readonly valorTotal?: number | null;
  readonly meioPagamento?: string | null;
  readonly statusSplit?: StatusSplitApi | null;
}

export interface DashboardResumoApiDto {
  readonly repasseLiquidoMes: number;
  readonly valorBrutoMes: number;
  readonly retencaoClinicaMes: number;
  readonly variacaoPercentualMes: number;
  readonly sparklineFinanceiro: readonly number[];
  readonly totalConsultasHoje: number;
  readonly totalTelessaudeHoje: number;
  readonly totalPresenciaisHoje: number;
  readonly proximaConsulta: ProximaConsultaResumoDto | null;
  readonly taxaAssiduidade: number;
  readonly pacientesAtivos: number;
  readonly prontuariosEmRascunho: number;
  readonly agendamentosHoje: readonly AgendamentoHojeItemDto[];
  readonly atendimentosRecentes: readonly AtendimentoRecenteDto[];
}

export interface QuickAppointmentFormPayload {
  readonly mode: 'existing' | 'new';
  readonly patientId?: string;
  readonly newPatient?: {
    readonly fullName: string;
    readonly cpf: string;
    readonly birthDate: string;
    readonly phone: string;
    readonly email: string;
    readonly emergencyContactName: string;
    readonly emergencyContactPhone: string;
    readonly sendLgpdWhatsapp: boolean;
  };
  readonly modality: 'Telessaúde' | 'Presencial';
  readonly date: string;
  readonly startTime: string;
  readonly durationMinutes: number;
  readonly sessionType: string;
  readonly repeatWeekly: boolean;
  readonly honorarioValue: number;
  readonly sendReminder24h: boolean;
}
