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
