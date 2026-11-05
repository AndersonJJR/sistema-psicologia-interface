export type ClinicalTabType = 'prontuario' | 'privativo';

export interface CrisisContactInfo {
  readonly contactName: string;
  readonly relationshipBadge: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly sessionAddressLine1: string;
  readonly sessionAddressLine2: string;
  readonly consentVerified: boolean;
}

export interface FormalProntuarioRecord {
  readonly technicalProcedures: string;
  readonly observableEvolution: string;
}

export interface PrivateDocumentalRecord {
  readonly provisionalHypotheses: string;
  readonly supervisionAndCountertransference: string;
}

export interface DigitalSignatureMetadata {
  readonly responsibleProfessional: string;
  readonly activeRegistration: string;
  readonly cryptographicHash: string;
}

export interface ClinicalSessionData {
  readonly agendamentoId?: string;
  readonly patientName: string;
  readonly patientInitials: string;
  readonly patientAgeLabel: string;
  readonly sessionDateLabel: string;
  readonly sessionNumberLabel: string;
  readonly initialElapsedSeconds: number;
  readonly lastDraftSavedAt: string;
  readonly isSignedAndImmutable: boolean;
  readonly crisisInfo: CrisisContactInfo;
  readonly formalRecord: FormalProntuarioRecord;
  readonly privateRecord: PrivateDocumentalRecord;
  readonly signatureMetadata: DigitalSignatureMetadata;
}

export interface ProntuarioClinicoApiDto {
  readonly idProntuario: string;
  readonly idAgendamento: string;
  readonly idPaciente: string;
  readonly nomePaciente: string;
  readonly idPsicologo: string;
  readonly nomePsicologo: string;
  readonly procedimentosTecnicos: string;
  readonly evolucaoObservavel: string;
  readonly dataRegistro: string;
  readonly assinado: boolean;
  readonly hashAssinatura: string | null;
  readonly ativo: boolean;
  readonly deletedAt: string | null;
}

export interface ProntuarioClinicoRequestDto {
  readonly idAgendamento: string;
  readonly procedimentosTecnicos: string;
  readonly evolucaoObservavel: string;
}

export interface RegistroDocumentalApiDto {
  readonly idRegistroDocumental: string;
  readonly idAgendamento: string;
  readonly idPsicologoTitular: string;
  readonly idPaciente: string;
  readonly hipotesesProvisorias: string;
  readonly notasSupervisao: string;
  readonly dataRegistro: string;
  readonly assinado: boolean;
  readonly ativo: boolean;
  readonly deletedAt: string | null;
}

export interface RegistroDocumentalRequestDto {
  readonly idAgendamento: string;
  readonly hipotesesProvisorias: string;
  readonly notasSupervisao: string;
}
