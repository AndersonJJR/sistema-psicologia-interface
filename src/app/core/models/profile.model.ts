export type ClinicalApproachKey =
  | 'tcc'
  | 'psicanalise'
  | 'humanista'
  | 'gestalt'
  | 'analitica'
  | 'fenomenologia'
  | 'sistemica';

export interface ClinicalApproachOption {
  readonly value: ClinicalApproachKey;
  readonly label: string;
}

export interface TelepsychologyRoomConfig {
  readonly permanentRoomLink: string;
  readonly sslSpecification: string;
  readonly sessionRecordingPolicy: string;
  readonly ethicsComplianceNote: string;
  readonly informedConsentTitle: string;
  readonly informedConsentSubtitle: string;
}

export interface PsychologistProfile {
  readonly id?: string;
  readonly email?: string;
  readonly fullName: string;
  readonly shortDisplayName: string;
  readonly cpf: string;
  readonly cpfValidatedLabel: string;
  readonly phone: string;
  readonly avatarUrl: string;
  readonly ePsiCode: string;
  readonly ePsiStatusLabel: string;
  readonly ePsiDescription: string;
  readonly ePsiAuditBadge: string;
  readonly crpRegistration: string;
  readonly crpJurisdiction: string;
  readonly crpActiveStatus: string;
  readonly clinicalApproach: ClinicalApproachKey;
  readonly lastModifiedLabel: string;
  readonly telepsychologyConfig: TelepsychologyRoomConfig;
}

export interface PsicologoApiDto {
  readonly idPsicologo: string;
  readonly nome: string;
  readonly cpf: string;
  readonly crp: string;
  readonly numeroEpsi: string;
  readonly email: string;
  readonly telefone: string;
  readonly abordagemClinica: ClinicalApproachKey;
  readonly ultimaRenovacaoEpsi: string | null;
  readonly ativo: boolean;
  readonly deletedAt: string | null;
}

export interface PsicologoRequestDto {
  readonly nome: string;
  readonly cpf: string;
  readonly crp: string;
  readonly numeroEpsi: string;
  readonly email: string;
  readonly telefone: string;
  readonly abordagemClinica?: ClinicalApproachKey;
}
