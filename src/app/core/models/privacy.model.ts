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
  readonly targetPatientId?: string;
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

export type AcaoAuditoriaApi = 'LEITURA' | 'INSERCAO' | 'ALTERACAO' | 'EXPORTACAO';

export interface LogAuditoriaApiDto {
  readonly idLog: string;
  readonly carimboTempoUtc: string;
  readonly idUsuarioOperador: string;
  readonly enderecoIp: string;
  readonly acao: AcaoAuditoriaApi;
  readonly idRecursoAcessado: string;
}

export interface PacienteExportacaoApiDto {
  readonly dataExportacaoUtc: string;
  readonly padraoConformidadeDocumental: string;
  readonly conteudoCsvAberto: string;
  readonly nomeArquivoPdfA: string;
  readonly documentoPdfABase64: string;
}
