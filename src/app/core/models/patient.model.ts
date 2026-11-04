export interface EmergencyProtocol {
  readonly emergencyContactName: string;
  readonly emergencyContactPhone: string;
  readonly habitualSessionAddress: string;
  readonly georeferencedFacilityName: string;
  readonly georeferencedFacilityDistance: string;
  readonly routeMapped: boolean;
}

export interface ConsentTermItem {
  readonly id: string;
  readonly title: string;
  readonly badgeLabel: string;
  readonly signed: boolean;
}

export interface TherapeuticPlanSummary {
  readonly completedSessions: number;
  readonly attendanceRate: string;
  readonly framing: string;
  readonly cidClassification: string;
}

export interface PatientRecord {
  readonly id: string;
  readonly prontuarioCode: string;
  readonly fullName: string;
  readonly shortName: string;
  readonly initials: string;
  readonly cpf: string;
  readonly maskedCpf: string;
  readonly birthDate: string;
  readonly ageYears: number;
  readonly phone: string;
  readonly email: string;
  readonly avatarUrl: string;
  readonly activeInPsychotherapy: boolean;
  readonly startFollowUpDate: string;
  readonly totalHistoricalSessions: number;
  readonly lgpdConsentStatus: string;
  readonly emergencyProtocol: EmergencyProtocol;
  readonly signedConsents: readonly ConsentTermItem[];
  readonly therapeuticPlan: TherapeuticPlanSummary;
}

export interface PacienteApiDto {
  readonly idPaciente: string;
  readonly nome: string;
  readonly cpf: string;
  readonly dataNascimento: string;
  readonly email: string;
  readonly telefone: string;
  readonly contatoEmergenciaNome: string;
  readonly contatoEmergenciaTelefone: string;
  readonly enderecoLocalSessao: string;
  readonly ativo: boolean;
  readonly deletedAt: string | null;
}

export interface PacienteRequestDto {
  readonly nome: string;
  readonly cpf: string;
  readonly dataNascimento: string;
  readonly email: string;
  readonly telefone: string;
  readonly contatoEmergenciaNome: string;
  readonly contatoEmergenciaTelefone: string;
  readonly enderecoLocalSessao: string;
}
