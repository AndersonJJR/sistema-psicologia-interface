export interface PortabilityFormatCard {
  readonly id: string;
  readonly formatHeader: string;
  readonly icon: string;
  readonly iconColorClass: string;
  readonly title: string;
  readonly description: string;
  readonly validationLabel: string;
  readonly validationColorClass: string;
}

export interface PrivacyPortalState {
  readonly searchQuery: string;
  readonly targetPatientName: string;
  readonly targetPatientShortName: string;
  readonly targetPatientCpf: string;
  readonly followUpSummary: string;
  readonly lgpdConsentLabel: string;
  readonly prontuarioStatusBadge: string;
  readonly lastPortabilityEmissionLabel: string;
  readonly isExporting: boolean;
}
