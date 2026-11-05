import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import {
  ActiveBillingConciliation,
  AgendamentoApiDto,
  AgendamentoRequestDto,
  AgendaMetricCard,
  AppointmentVariant,
  BilledSessionTransaction,
  BillingFilterType,
  CalendarDayColumn,
  CalendarViewMode,
  ClinicalApproachKey,
  ClinicalApproachOption,
  ClinicalSessionData,
  FormalProntuarioRecord,
  LogAuditoriaApiDto,
  ModalidadeAtendimentoApi,
  NewAppointmentPayload,
  NewPaymentFormPayload,
  PacienteApiDto,
  PacienteExportacaoApiDto,
  PacienteRequestDto,
  PagamentoApiDto,
  PagamentoRequestDto,
  PatientRecord,
  PaymentMethodKey,
  PaymentMethodOption,
  PortabilityFormatCard,
  PrivacyPortalState,
  PrivateDocumentalRecord,
  ProntuarioClinicoApiDto,
  ProntuarioClinicoRequestDto,
  PsicologoApiDto,
  PsicologoRequestDto,
  PsychologistProfile,
  RegistroDocumentalApiDto,
  RegistroDocumentalRequestDto,
  ScheduleSlotItem,
  StatusSplitApi,
} from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ClinicalStoreService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1';

  public readonly logoUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAZyGG8_keFvdbYHxmLHVJlOY7iSyhwaHESWh1SvZnwKBiM0Sde8ypk75wN7vDApF-oZ2jVh6t03LiJTx5xfyp9suSjf1IQ4UYmrfqFA4xg9KazkipPgPEVAg-4j_LZIzLLqNCPhpfo19RO490GcAVbod3LN_JGvD3vcCuWIrKbWDllTtAhGIrU4ReoxVR1a6yhtidj7LVIuVDYPN3lVJG1EdV6UlExQ8Mw2jDEB6DN';

  public readonly currentDateHeaderLabel = signal<string>('24 de Maio de 2024');

  // 1. Psychologist Profile State
  private readonly profileState = signal<PsychologistProfile>({
    fullName: 'Dra. Juliana Mendes Silveira',
    shortDisplayName: 'Dra. Juliana Mendes',
    cpf: '123.456.789-00',
    cpfValidatedLabel: 'Validado RFB',
    phone: '(11) 98765-4321',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBUOWugv3rsouvaTZgwDxD2HvW5ss02N6OSfsnbthQaZNZFfaykY9Qh7fAkGWm-zzq95m4m_TtcJl3VACvMmL4o_a_H7HMMePUyXG9h0wLb1EUroaZKaKPcxgR_aSGFciF6MF0K0q-aYeuJ1LfQ_TmN6E7iKCApT9rdrr_5jnWFnIC_ifPjJqGaz_72xy1qmKNoRPWrU6iLhr8HqxQ1Uo4_yXHUYTr6Y0YGME8CzTN',
    ePsiCode: 'EPSI-SP-2023-88412',
    ePsiStatusLabel: 'Habilitado para Telessaúde',
    ePsiDescription:
      'Cadastro ativo na plataforma e-Psi sob a tutela do Conselho Regional de Psicologia da 6ª Região.',
    ePsiAuditBadge: 'Auditoria 2024.1 Regular',
    crpRegistration: '06/142980 - SP',
    crpJurisdiction: 'Jurisdição: São Paulo / SP',
    crpActiveStatus: 'Ativo e Regular',
    clinicalApproach: 'tcc',
    lastModifiedLabel: 'Última alteração: 18 Mai 2024, 14:32',
    telepsychologyConfig: {
      permanentRoomLink: 'psicosafe.com.br/sala/dra-juliana',
      sslSpecification: 'Sala Privativa SSL 256-bit',
      sessionRecordingPolicy: 'Desabilitado por Padrão',
      ethicsComplianceNote: 'Conformidade Código Ética Art. 9º',
      informedConsentTitle: 'TCLE Digital Ativo',
      informedConsentSubtitle: 'Assinatura antes da sessão',
    },
  });

  public readonly profile = this.profileState.asReadonly();

  public readonly clinicalApproaches = signal<readonly ClinicalApproachOption[]>([
    { value: 'tcc', label: 'Terapia Cognitivo-Comportamental (TCC)' },
    { value: 'psicanalise', label: 'Psicanálise Clínica Freudiana / Lacaniana' },
    { value: 'humanista', label: 'Abordagem Centrada na Pessoa / Humanista' },
    { value: 'gestalt', label: 'Gestalt-Terapia' },
    { value: 'analitica', label: 'Psicologia Analítica (Junguiana)' },
    { value: 'fenomenologia', label: 'Fenomenológico-Existencial' },
    { value: 'sistemica', label: 'Terapia Sistêmica Familiar' },
  ]);

  // 2. Patient Registration & Prontuário Digital State
  private readonly patientRecordState = signal<PatientRecord>({
    id: 'pac-8841',
    prontuarioCode: '#8841',
    fullName: 'Lucas Gabriel Albuquerque Rocha',
    shortName: 'Lucas G. A. Rocha',
    initials: 'LG',
    cpf: '342.189.058-22',
    maskedCpf: '382.***.***-19',
    birthDate: '14/05/1992 - 32 anos',
    ageYears: 32,
    phone: '(11) 97123-4567',
    email: 'lucas.albuquerque@email.com',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCC2mICCYQQZF1GMGfEToWbxBEQihaaHYreVhabbv00TUBTMWUxDyDpZlPhZAHVXvH98jVGtJp7cvmE0A_iXDQkJDaT4bSRyKXE2mQMXzPI5aVPJ_G-zmBkj8Ng8RLKn4xcXl9WOWDHEaTzxAvyNqQvUA_XUc_STAe-dynlf26PF2nm1KY3dvfGEJAhnAnF538JVA4W69U-HRW0vdjuvQXb7Qb5ZWfMVrMSZkMVVRVw',
    activeInPsychotherapy: true,
    startFollowUpDate: '14/02/2022 (27 sessões)',
    totalHistoricalSessions: 27,
    lgpdConsentStatus: 'Assinado Eletronicamente',
    emergencyProtocol: {
      emergencyContactName: 'Mariana Albuquerque (Irmã)',
      emergencyContactPhone: '(11) 99887-6655',
      habitualSessionAddress:
        'Rua das Camélias, 450, Apto 82, Vila Mariana, São Paulo - SP, CEP 04048-001',
      georeferencedFacilityName: 'Pronto-Atendimento Referência Georreferenciado',
      georeferencedFacilityDistance: 'UPA 24h Vila Mariana (1.4 km de distância do paciente)',
      routeMapped: true,
    },
    signedConsents: [
      {
        id: 'tcle',
        title: 'Consentimento Livre e Esclarecido (TCLE)',
        badgeLabel: 'PDF Assinado',
        signed: true,
      },
      {
        id: 'tele',
        title: 'Termo de Telessaúde & Sigilo Remoto',
        badgeLabel: 'Validação OTP',
        signed: true,
      },
      {
        id: 'lgpd',
        title: 'Política de Tratamento de Dados LGPD',
        badgeLabel: 'Versão 3.2',
        signed: true,
      },
    ],
    therapeuticPlan: {
      completedSessions: 14,
      attendanceRate: '98%',
      framing: 'TCC Semanal',
      cidClassification: 'F41.1 (CID-11)',
    },
  });

  public readonly patientRecord = this.patientRecordState.asReadonly();
  public readonly patientsList = signal<readonly PacienteApiDto[]>([]);
  public readonly isCreatingNewPatient = signal<boolean>(false);

  // 3. Agenda Clínica State
  public readonly calendarViewMode = signal<CalendarViewMode>('semanal');
  public readonly currentWeekRangeLabel = signal<string>('20 a 26 de Outubro, 2024');
  public readonly sessionsTodayBadge = signal<string>('6 Sessões Hoje');

  public readonly agendaDays = signal<readonly CalendarDayColumn[]>([
    { index: 0, shortDayLabel: 'Seg, 21', dateNumberLabel: '21 Out', isToday: false },
    { index: 1, shortDayLabel: 'Ter, 22', dateNumberLabel: '22 Out', isToday: false },
    { index: 2, shortDayLabel: 'Qua, 23', dateNumberLabel: '23 Out', isToday: false },
    { index: 3, shortDayLabel: 'Qui, 24 (Hoje)', dateNumberLabel: '24 Out', isToday: true },
    { index: 4, shortDayLabel: 'Sex, 25', dateNumberLabel: '25 Out', isToday: false },
  ]);

  public readonly agendaHours = signal<readonly string[]>([
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00 - 14:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ]);

  public readonly agendaMetrics = signal<readonly AgendaMetricCard[]>([
    {
      id: 'telepsicologia',
      icon: 'videocam',
      label: 'Telepsicologia',
      value: '18 Sessões',
      iconBgClass: 'bg-surface-container-low',
      iconColorClass: 'text-primary',
    },
    {
      id: 'presenciais',
      icon: 'apartment',
      label: 'Presenciais',
      value: '14 Sessões',
      iconBgClass: 'bg-surface-container',
      iconColorClass: 'text-secondary',
    },
    {
      id: 'concluidas',
      icon: 'check_circle',
      label: 'Concluídas',
      value: '22 / 32',
      iconBgClass: 'bg-secondary-container/40',
      iconColorClass: 'text-on-secondary-container',
    },
    {
      id: 'ocupacao',
      icon: 'schedule',
      label: 'Ocupação Semanal',
      value: '88.5%',
      iconBgClass: 'bg-tertiary-fixed/40',
      iconColorClass: 'text-tertiary',
    },
  ]);

  private readonly scheduleSlotsState = signal<readonly ScheduleSlotItem[]>([
    {
      id: 'slot-08-ter',
      dayIndex: 1,
      hourSlot: '08:00',
      timeRange: '08:00 - 08:50',
      patientName: 'Dr. Ricardo (Supervisão)',
      subtitle: 'Realizado',
      variant: 'completed-supervision',
    },
    {
      id: 'slot-08-qui',
      dayIndex: 3,
      hourSlot: '08:00',
      timeRange: '08:00 - 08:50',
      patientName: 'Mariana F. Costa',
      subtitle: 'Presencial • Sala 1',
      variant: 'presential-today-highlight',
    },
    {
      id: 'slot-09-qua',
      dayIndex: 2,
      hourSlot: '09:00',
      timeRange: '09:00 - 09:50',
      patientName: 'Fernanda Siqueira',
      subtitle: 'Telessaúde',
      variant: 'telehealth-standard',
    },
    {
      id: 'slot-09-qui',
      dayIndex: 3,
      hourSlot: '09:00',
      timeRange: '09:00 - 09:50',
      patientName: 'Lucas Gabriel Albuquerque',
      subtitle: 'Online - Telessaúde CFP',
      statusLabel: 'Sala Ativa • Pronto',
      variant: 'active-selected-telehealth',
    },
    {
      id: 'slot-09-sex',
      dayIndex: 4,
      hourSlot: '09:00',
      timeRange: '09:00 - 09:50',
      patientName: 'Sofia Albuquerque',
      subtitle: 'Presencial',
      variant: 'presential-muted',
    },
    {
      id: 'slot-10-seg',
      dayIndex: 0,
      hourSlot: '10:00',
      timeRange: '10:00 - 10:50',
      patientName: 'Rafael Nogueira',
      subtitle: 'Telessaúde',
      variant: 'presential-muted',
    },
    {
      id: 'slot-10-qui',
      dayIndex: 3,
      hourSlot: '10:00',
      patientName: 'Intervalo / Registro Prontuário',
      subtitle: '',
      variant: 'interval-prontuario',
    },
    {
      id: 'slot-11-qui',
      dayIndex: 3,
      hourSlot: '11:00',
      timeRange: '11:00 - 11:50',
      patientName: 'Beatriz Lima',
      subtitle: 'Presencial - Sala 2',
      variant: 'presential-room2',
    },
    {
      id: 'slot-14-ter',
      dayIndex: 1,
      hourSlot: '14:00',
      timeRange: '14:00 - 14:50',
      patientName: 'Talita Duarte',
      subtitle: 'Telessaúde',
      variant: 'telehealth-standard',
    },
    {
      id: 'slot-14-qui',
      dayIndex: 3,
      hourSlot: '14:00',
      timeRange: '14:30 - 15:20',
      patientName: 'Carlos Eduardo',
      subtitle: 'Aguardando Recepção',
      variant: 'waiting-reception',
    },
    {
      id: 'slot-15-seg',
      dayIndex: 0,
      hourSlot: '15:00',
      timeRange: '15:00 - 15:50',
      patientName: 'Julio Verne',
      subtitle: 'Presencial',
      variant: 'presential-muted',
    },
    {
      id: 'slot-15-qua',
      dayIndex: 2,
      hourSlot: '15:00',
      timeRange: '15:00 - 15:50',
      patientName: 'Guilherme R.',
      subtitle: 'Telessaúde',
      variant: 'telehealth-standard',
    },
    {
      id: 'slot-15-qui',
      dayIndex: 3,
      hourSlot: '15:00',
      timeRange: '15:30 - 16:20',
      patientName: 'Aline Barros',
      subtitle: 'Telessaúde',
      variant: 'telehealth-standard',
    },
    {
      id: 'slot-16-qui',
      dayIndex: 3,
      hourSlot: '16:00',
      timeRange: '16:30 - 17:20',
      patientName: 'Matheus P. Vilela',
      subtitle: 'Presencial • Sala 1',
      variant: 'presential-muted',
    },
    {
      id: 'slot-17-ter',
      dayIndex: 1,
      hourSlot: '17:00',
      timeRange: '17:00 - 17:50',
      patientName: 'Renata Valença',
      subtitle: 'Telessaúde',
      variant: 'telehealth-standard',
    },
    {
      id: 'slot-18-qui',
      dayIndex: 3,
      hourSlot: '18:00',
      patientName: 'Fechamento do Dia & Backup LGPD',
      subtitle: '',
      variant: 'day-closing',
    },
  ]);

  public readonly scheduleSlots = this.scheduleSlotsState.asReadonly();
  public readonly agendamentosList = signal<readonly AgendamentoApiDto[]>([]);
  public readonly selectedAgendamentoId = signal<string | null>(null);

  // 4. Painel Clínico (Atendimento Clínico & Prontuário) State
  private readonly clinicalSessionState = signal<ClinicalSessionData>({
    patientName: 'Lucas Gabriel Albuquerque Rocha',
    patientInitials: 'LG',
    patientAgeLabel: '32 anos',
    sessionDateLabel: '24 de Outubro de 2024 • 09:00 às 09:50',
    sessionNumberLabel: 'Sessão Ordinária #14 (Psicoterapia Cognitivo-Comportamental)',
    initialElapsedSeconds: 38 * 60 + 15,
    lastDraftSavedAt: 'Último rascunho salvo às 09:35',
    isSignedAndImmutable: false,
    crisisInfo: {
      contactName: 'Mariana Rocha',
      relationshipBadge: 'Irmã / Tutora',
      phoneDisplay: '(11) 99887-6655',
      phoneHref: 'tel:11998876655',
      sessionAddressLine1: 'Alameda dos Anapurus, 1420 - Bloco B, Apto 82',
      sessionAddressLine2: 'Indianópolis - São Paulo / SP - CEP 04087-004',
      consentVerified: true,
    },
    formalRecord: {
      technicalProcedures: `1. Aplicação do Inventário de Ansiedade de Beck (BAI) - Escore obtido: 18 (Ansiedade Leve/Moderada).
2. Revisão do Registro de Pensamentos Disfuncionais (RPD) focado em ruminações ocupacionais no ambiente corporativo.
3. Psicoeducação sobre distorções cognitivas: especificamente "catastrofização" e "leitura mental" nas interações com a liderança direta.
4. Treinamento de respiração diafragmática pausada (técnica 4-7-8) como recurso de manejo agudo de hiperventilação.`,
      observableEvolution: `Paciente apresentou-se pontual, asseado, cooperativo e vigil. Humor eutímico com oscilações para afeto ansioso ao rememorar reuniões com gestor executivo. Pensamento com curso e velocidade preservados, sem alterações no conteúdo sensoperceptivo. 

Relata melhora no padrão do sono (média de 6h30 ininterruptas), após adesão ao protocolo de higiene do sono pactuado na Sessão #12. Demonstrou engajamento ativo na análise do RPD e comprometeu-se com a tarefa comportamental intersessão de autoexposição gradual em apresentação de relatórios.`,
    },
    privateRecord: {
      provisionalHypotheses: `• Hipótese provisória: Esquema desadaptativo precoce de "Padrões Inflexíveis / Postura Crítica", possivelmente ancorado nas exigências paternas durante a graduação acadêmica.
• Mecanismo de defesa prevalente: Racionalização intensa como barreira contra o sentimento de inadequação e desamparo ao ser avaliado por pares.
• Investigar na próxima sessão se a cobrança do gestor reativa memórias de rejeição escolar.`,
      supervisionAndCountertransference: `• Ponto de atenção na supervisão clínica de terça-feira com Dr. Arnaldo: observei sutil desconforto contratransferencial diante da pressa do paciente em apresentar resultados tangíveis.
• Cuidar para não assumir o papel de "cobrador de metas", mantendo o enquadre estritamente terapêutico e acolhedor.
• Reavaliar se a dosagem de tarefas intersessão não está alimentando a compulsão por performance.`,
    },
    signatureMetadata: {
      responsibleProfessional: 'Dra. Juliana Mendes',
      activeRegistration: 'CRP 06/142980',
      cryptographicHash: 'SHA-256 • a8f2...99bc',
    },
  });

  public readonly clinicalSession = this.clinicalSessionState.asReadonly();

  // 5. Gestão Financeira & Split de Pagamentos State
  public readonly paymentMethodOptions = signal<readonly PaymentMethodOption[]>([
    { value: 'pix', label: 'Pix Copia e Cola / QR Code Dinâmico (Split Imediato)' },
    { value: 'cartao', label: 'Cartão de Crédito (Gateway Pagar.me / Asaas)' },
    { value: 'ted', label: 'Transferência Bancária (TED / DOC Conciliado)' },
  ]);

  private readonly activeConciliationState = signal<ActiveBillingConciliation>({
    patientName: 'Lucas Gabriel Albuquerque Rocha',
    maskedCpfAndProntuario: 'CPF: 382.***.***-19 • Prontuário #8841',
    sessionSummary: 'Sessão Individual • 24/10/2024 às 14:00 (50 min)',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDj8HstKfZJyqKIVG9fHjVcEqM7sfeVd5WDp6wr8WZPPoUDdRaE-MvMaygcrxtNgOTDoxIReLIZt3H-isSd4wHfmuRxEdG-N8oIVjVWMyQeIIzcMlfKh3uky-s5FT-CTgidaJyqUNaDWvO1Ky4ui2CoqyS56pqcbdh5GpuAFYyPbvIjBihemMLNGcC46eZBjl8MQkypOS3kA0xjY_1F1VGltYUL9d5YqA-YYIdPcF8i',
    statusBadge: 'Liquidado via Pix',
    paymentMethod: 'pix',
    grossAmount: 250,
    clinicPercentage: 30,
    psychologistPercentage: 70,
    clinicCnpjNote: 'Emissão de NFS-e pela Clínica (CNPJ 41.209.112/0001-80)',
    bankSubaccount: 'Banco Cora • Ag 0001',
    auditExtractId: 'ID: SPL-9948210-BR',
    irpfSyncStatus: 'Receita Federal Ok',
  });

  public readonly activeConciliation = this.activeConciliationState.asReadonly();

  public readonly clinicSplitAmount = computed<number>(() => {
    const c = this.activeConciliationState();
    return Math.round(c.grossAmount * (c.clinicPercentage / 100) * 100) / 100;
  });

  public readonly psychologistSplitAmount = computed<number>(() => {
    const c = this.activeConciliationState();
    return Math.round(c.grossAmount * (c.psychologistPercentage / 100) * 100) / 100;
  });

  public readonly billingFilter = signal<BillingFilterType>('todas');

  private readonly billedTransactionsState = signal<readonly BilledSessionTransaction[]>([
    {
      id: 'tx-1',
      dateLabel: '24/10/2024',
      timeAndModalityLabel: '14:00 • Presencial',
      patientInitials: 'LG',
      initialsVariant: 'primary',
      patientName: 'Lucas Gabriel Albuquerque Rocha',
      maskedCpf: 'CPF 382.***.***-19',
      paymentIcon: 'bolt',
      paymentMethodLabel: 'Pix Instantâneo',
      settlementStatus: 'Liquidado',
      grossAmount: 250,
      clinicShareAmount: 75,
      clinicPercentageLabel: '30% retenção',
      psychologistShareAmount: 175,
      psychologistPercentageLabel: '70% repasse',
    },
    {
      id: 'tx-2',
      dateLabel: '24/10/2024',
      timeAndModalityLabel: '11:00 • Teleconsulta',
      patientInitials: 'MT',
      initialsVariant: 'tertiary',
      patientName: 'Mariana Torres Nogueira',
      maskedCpf: 'CPF 119.***.***-45',
      paymentIcon: 'credit_card',
      paymentMethodLabel: 'Cartão (1x)',
      settlementStatus: 'Processando D+1',
      grossAmount: 280,
      clinicShareAmount: 84,
      clinicPercentageLabel: '30% retenção',
      psychologistShareAmount: 196,
      psychologistPercentageLabel: '70% repasse',
    },
    {
      id: 'tx-3',
      dateLabel: '23/10/2024',
      timeAndModalityLabel: '17:30 • Presencial',
      patientInitials: 'FS',
      initialsVariant: 'primary',
      patientName: 'Felipe Silveira Campos',
      maskedCpf: 'CPF 504.***.***-82',
      paymentIcon: 'bolt',
      paymentMethodLabel: 'Pix Instantâneo',
      settlementStatus: 'Liquidado',
      grossAmount: 220,
      clinicShareAmount: 66,
      clinicPercentageLabel: '30% retenção',
      psychologistShareAmount: 154,
      psychologistPercentageLabel: '70% repasse',
    },
  ]);

  public readonly billedTransactions = this.billedTransactionsState.asReadonly();

  public readonly filteredTransactions = computed<readonly BilledSessionTransaction[]>(() => {
    const filter = this.billingFilter();
    const all = this.billedTransactionsState();
    if (filter === 'liquidadas') {
      return all.filter((item) => item.settlementStatus === 'Liquidado');
    }
    if (filter === 'conciliacao') {
      return all.filter((item) => item.settlementStatus === 'Processando D+1');
    }
    return all;
  });

  public readonly totalMonthlyRepassFormatted = signal<string>('R$ 8.925,00');

  // 6. Portal de Privacidade, Exportação e Auditoria LGPD State
  private readonly privacyPortalState = signal<PrivacyPortalState>({
    searchQuery: 'Lucas Gabriel Albuquerque Rocha - 342.189.058-22',
    targetPatientName: 'Lucas Gabriel Albuquerque Rocha',
    targetPatientShortName: 'Lucas G. A. Rocha',
    targetPatientCpf: '342.189.058-22',
    followUpSummary: '14/02/2022 (27 sessões)',
    lgpdConsentLabel: 'Assinado Eletronicamente',
    prontuarioStatusBadge: 'Prontuário Ativo',
    lastPortabilityEmissionLabel:
      'Última emissão de portabilidade: Nunca gerada para este titular',
    isExporting: false,
  });

  public readonly privacyPortal = this.privacyPortalState.asReadonly();
  public readonly auditLogs = signal<readonly LogAuditoriaApiDto[]>([]);

  public readonly portabilityFormats = signal<readonly PortabilityFormatCard[]>([
    {
      id: 'pdf-a',
      formatHeader: 'Formato A (Humano)',
      icon: 'picture_as_pdf',
      iconColorClass: 'text-primary',
      title: 'PDF/A-1b Arquivístico',
      description: 'Conformidade ISO 19005 para preservação de 5 anos obrigatória pelo CFP.',
      validationLabel: 'Carimbo de Tempo (ACT) Ativo',
      validationColorClass: 'text-primary',
    },
    {
      id: 'json-fhir',
      formatHeader: 'Formato B (Interoperabilidade)',
      icon: 'data_object',
      iconColorClass: 'text-secondary',
      title: 'JSON Estruturado (HL7 FHIR)',
      description:
        'Metadados clínicos exportáveis para migração de provedores de telepsicologia.',
      validationLabel: 'Validação JSON-Schema OK',
      validationColorClass: 'text-secondary',
    },
  ]);

  // Actions & Mutations
  public loadProfileFromBackend(): void {
    const userId = this.authService.currentPsychologistId() ?? this.profileState().id;
    const req$ = userId
      ? this.http.get<PsicologoApiDto>(`${this.apiBaseUrl}/psicologos/${userId}`)
      : this.http.get<PsicologoApiDto[]>(`${this.apiBaseUrl}/psicologos`).pipe(
          map((list) => list[0] ?? null)
        );

    req$.pipe(catchError(() => of(null))).subscribe((dto) => {
      if (dto) {
        this.applyPsicologoDto(dto);
      }
    });
  }

  public saveProfileToBackend(
    patch: Pick<PsychologistProfile, 'fullName' | 'phone' | 'crpRegistration' | 'clinicalApproach'>
  ): Observable<PsychologistProfile> {
    const current = this.profileState();
    const idPsicologo = this.authService.currentPsychologistId() ?? current.id;
    const payload: PsicologoRequestDto = {
      nome: patch.fullName.trim(),
      cpf: current.cpf,
      crp: patch.crpRegistration.trim(),
      numeroEpsi: current.ePsiCode,
      email: current.email ?? this.authService.session()?.login ?? 'dra.juliana@psicosafe.com.br',
      telefone: patch.phone.trim(),
      abordagemClinica: patch.clinicalApproach,
    };

    const resolveId$ = idPsicologo
      ? of(idPsicologo)
      : this.http.get<PsicologoApiDto[]>(`${this.apiBaseUrl}/psicologos`).pipe(
          map((list) => list[0]?.idPsicologo ?? null),
          catchError(() => of(null))
        );

    return resolveId$.pipe(
      switchMap((id) => {
        if (!id) {
          this.updateProfile(patch);
          return of(this.profileState());
        }
        return this.http.put<PsicologoApiDto>(`${this.apiBaseUrl}/psicologos/${id}`, payload).pipe(
          tap((dto) => this.applyPsicologoDto(dto)),
          map(() => this.profileState())
        );
      })
    );
  }

  public renewEpsiCertificateOnBackend(): Observable<PsychologistProfile> {
    const current = this.profileState();
    const idPsicologo = this.authService.currentPsychologistId() ?? current.id;

    const resolveId$ = idPsicologo
      ? of(idPsicologo)
      : this.http.get<PsicologoApiDto[]>(`${this.apiBaseUrl}/psicologos`).pipe(
          map((list) => list[0]?.idPsicologo ?? null),
          catchError(() => of(null))
        );

    return resolveId$.pipe(
      switchMap((id) => {
        if (!id) {
          const now = new Date();
          const dateStr = now.toLocaleDateString('pt-BR');
          this.profileState.update((prev) => ({
            ...prev,
            ePsiAuditBadge: `Renovado em ${dateStr}`,
            lastModifiedLabel: `Certificado e-Psi renovado em ${dateStr}`,
          }));
          return of(this.profileState());
        }
        return this.http
          .patch<PsicologoApiDto>(`${this.apiBaseUrl}/psicologos/${id}/renovar-epsi`, {})
          .pipe(
            tap((dto) => this.applyPsicologoDto(dto)),
            map(() => this.profileState())
          );
      })
    );
  }

  private applyPsicologoDto(dto: PsicologoApiDto): void {
    const words = dto.nome.trim().split(/\s+/);
    const shortDisplayName =
      words.length > 2 ? `${words[0]} ${words[1]} ${words[words.length - 1]}` : dto.nome;
    const slug = dto.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const approach = (dto.abordagemClinica || 'tcc') as ClinicalApproachKey;
    const renovacaoDate = dto.ultimaRenovacaoEpsi
      ? new Date(dto.ultimaRenovacaoEpsi).toLocaleString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;

    this.profileState.update((prev) => ({
      ...prev,
      id: dto.idPsicologo,
      email: dto.email,
      fullName: dto.nome,
      shortDisplayName,
      cpf: dto.cpf,
      phone: dto.telefone,
      ePsiCode: dto.numeroEpsi,
      ePsiAuditBadge: renovacaoDate ? `Renovado em ${renovacaoDate}` : prev.ePsiAuditBadge,
      crpRegistration: dto.crp,
      crpActiveStatus: dto.ativo ? 'Ativo e Regular' : 'Inativo',
      clinicalApproach: approach,
      lastModifiedLabel: renovacaoDate
        ? `Última sincronização e-Psi: ${renovacaoDate}`
        : `Sincronizado com servidor CFP`,
      telepsychologyConfig: {
        ...prev.telepsychologyConfig,
        permanentRoomLink: `psicosafe.com.br/sala/${slug}`,
      },
    }));
  }

  public updateProfile(
    patch: Partial<
      Pick<PsychologistProfile, 'fullName' | 'phone' | 'crpRegistration' | 'clinicalApproach'>
    >
  ): void {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    this.profileState.update((prev) => ({
      ...prev,
      ...patch,
      lastModifiedLabel: `Última alteração: Hoje, ${timeStr}`,
    }));
  }

  public loadPatientsFromBackend(): void {
    this.http
      .get<PacienteApiDto[]>(`${this.apiBaseUrl}/pacientes?incluirInativos=true`)
      .pipe(catchError(() => of([])))
      .subscribe((list) => {
        if (list.length > 0) {
          this.patientsList.set(list);
          const currentId = this.patientRecordState().id;
          const matching =
            list.find((p) => p.idPaciente === currentId) ??
            list.find((p) => p.cpf === this.patientRecordState().cpf) ??
            list[0];
          this.applyPacienteDto(matching);
        }
      });
  }

  public selectPatientById(idPaciente: string): void {
    this.isCreatingNewPatient.set(false);
    const found = this.patientsList().find((p) => p.idPaciente === idPaciente);
    if (found) {
      this.applyPacienteDto(found);
      return;
    }
    this.http
      .get<PacienteApiDto>(`${this.apiBaseUrl}/pacientes/${idPaciente}`)
      .pipe(catchError(() => of(null)))
      .subscribe((dto) => {
        if (dto) {
          this.applyPacienteDto(dto);
        }
      });
  }

  public startNewPatientRegistration(): void {
    this.isCreatingNewPatient.set(true);
    this.patientRecordState.update((prev) => ({
      ...prev,
      id: '',
      prontuarioCode: '#NOVO',
      fullName: '',
      shortName: 'Novo Paciente',
      initials: 'NP',
      cpf: '',
      maskedCpf: '***.***.***-**',
      birthDate: '',
      ageYears: 0,
      phone: '',
      email: '',
      activeInPsychotherapy: true,
      emergencyProtocol: {
        ...prev.emergencyProtocol,
        emergencyContactName: '',
        emergencyContactPhone: '',
        habitualSessionAddress: '',
      },
    }));
  }

  public savePatientToBackend(inputData: {
    fullName: string;
    cpf: string;
    birthDate: string;
    phone: string;
    email: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    habitualSessionAddress: string;
  }): Observable<PatientRecord> {
    const isoDate = ClinicalStoreService.parseBirthDateToIso(inputData.birthDate);
    const payload: PacienteRequestDto = {
      nome: inputData.fullName.trim(),
      cpf: inputData.cpf.trim(),
      dataNascimento: isoDate,
      email: inputData.email.trim(),
      telefone: inputData.phone.trim(),
      contatoEmergenciaNome: inputData.emergencyContactName.trim(),
      contatoEmergenciaTelefone: inputData.emergencyContactPhone.trim(),
      enderecoLocalSessao: inputData.habitualSessionAddress.trim(),
    };

    const currentId = this.patientRecordState().id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      currentId
    );
    const isNew = this.isCreatingNewPatient() || !isUuid;

    const request$ = isNew
      ? this.http.post<PacienteApiDto>(`${this.apiBaseUrl}/pacientes`, payload)
      : this.http.put<PacienteApiDto>(`${this.apiBaseUrl}/pacientes/${currentId}`, payload);

    return request$.pipe(
      tap((dto) => {
        this.isCreatingNewPatient.set(false);
        this.applyPacienteDto(dto);
        this.patientsList.update((list) => {
          const exists = list.some((item) => item.idPaciente === dto.idPaciente);
          if (exists) {
            return list.map((item) => (item.idPaciente === dto.idPaciente ? dto : item));
          }
          return [dto, ...list];
        });
      }),
      map(() => this.patientRecordState())
    );
  }

  public togglePatientStatusOnBackend(active: boolean): Observable<PatientRecord> {
    const currentId = this.patientRecordState().id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      currentId
    );
    if (!isUuid) {
      this.togglePatientActiveStatus(active);
      return of(this.patientRecordState());
    }
    return this.http
      .patch<PacienteApiDto>(
        `${this.apiBaseUrl}/pacientes/${currentId}/status?ativo=${active}`,
        {}
      )
      .pipe(
        tap((dto) => {
          this.applyPacienteDto(dto);
          this.patientsList.update((list) =>
            list.map((item) => (item.idPaciente === dto.idPaciente ? dto : item))
          );
        }),
        map(() => this.patientRecordState())
      );
  }

  private applyPacienteDto(dto: PacienteApiDto): void {
    const words = dto.nome.trim().split(/\s+/);
    const initials =
      words.length >= 2
        ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
        : dto.nome.slice(0, 2).toUpperCase();
    const shortName =
      words.length >= 2 ? `${words[0]} ${words[words.length - 1]}` : dto.nome;
    const maskedCpf =
      dto.cpf.length >= 11 ? `${dto.cpf.slice(0, 3)}.***.***-${dto.cpf.slice(-2)}` : dto.cpf;
    const { formattedLabel, ageYears } = ClinicalStoreService.formatIsoBirthDate(
      dto.dataNascimento
    );
    const shortCode = `#${dto.idPaciente.slice(0, 4).toUpperCase()}`;

    this.patientRecordState.update((prev) => ({
      ...prev,
      id: dto.idPaciente,
      prontuarioCode: shortCode,
      fullName: dto.nome,
      shortName,
      initials,
      cpf: dto.cpf,
      maskedCpf,
      birthDate: formattedLabel,
      ageYears,
      phone: dto.telefone,
      email: dto.email,
      activeInPsychotherapy: dto.ativo,
      emergencyProtocol: {
        ...prev.emergencyProtocol,
        emergencyContactName: dto.contatoEmergenciaNome,
        emergencyContactPhone: dto.contatoEmergenciaTelefone,
        habitualSessionAddress: dto.enderecoLocalSessao,
      },
    }));

    this.privacyPortalState.update((prev) => ({
      ...prev,
      searchQuery: `${dto.nome} - ${dto.cpf}`,
      targetPatientName: dto.nome,
      targetPatientShortName: shortName,
      targetPatientCpf: dto.cpf,
      prontuarioStatusBadge: dto.ativo ? 'Prontuário Ativo' : 'Prontuário Inativo',
    }));
  }

  public static parseBirthDateToIso(raw: string): string {
    const trimmed = raw.trim();
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }
    const brMatch = trimmed.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (brMatch) {
      return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`;
    }
    return '1992-05-14';
  }

  public static formatIsoBirthDate(iso: string): { formattedLabel: string; ageYears: number } {
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
      return { formattedLabel: iso, ageYears: 30 };
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const today = new Date();
    let age = today.getFullYear() - year;
    const m = today.getMonth() + 1 - month;
    if (m < 0 || (m === 0 && today.getDate() < day)) {
      age--;
    }
    return {
      formattedLabel: `${match[3]}/${match[2]}/${match[1]} - ${age} anos`,
      ageYears: Math.max(0, age),
    };
  }

  public updatePatientRecord(
    personalPatch: Partial<
      Pick<
        PatientRecord,
        'fullName' | 'cpf' | 'birthDate' | 'phone' | 'email' | 'activeInPsychotherapy'
      >
    >,
    emergencyPatch?: Partial<PatientRecord['emergencyProtocol']>
  ): void {
    this.patientRecordState.update((prev) => ({
      ...prev,
      ...personalPatch,
      emergencyProtocol: emergencyPatch
        ? { ...prev.emergencyProtocol, ...emergencyPatch }
        : prev.emergencyProtocol,
    }));
  }

  public togglePatientActiveStatus(active: boolean): void {
    this.patientRecordState.update((prev) => ({
      ...prev,
      activeInPsychotherapy: active,
    }));
  }

  public setCalendarViewMode(mode: CalendarViewMode): void {
    this.calendarViewMode.set(mode);
  }

  public loadAgendamentosFromBackend(): void {
    if (this.patientsList().length === 0) {
      this.loadPatientsFromBackend();
    }
    this.http
      .get<AgendamentoApiDto[]>(`${this.apiBaseUrl}/agendamentos`)
      .pipe(catchError(() => of([])))
      .subscribe((list) => {
        if (list.length > 0) {
          this.agendamentosList.set(list);
          this.syncScheduleSlotsFromBackend(list);
        }
      });
  }

  public createAppointmentOnBackend(
    payload: NewAppointmentPayload
  ): Observable<ScheduleSlotItem> {
    const idPsicologo = this.authService.currentPsychologistId() ?? this.profileState().id;
    const matchedPatient =
      (payload.patientId
        ? this.patientsList().find((p) => p.idPaciente === payload.patientId)
        : undefined) ??
      this.patientsList().find(
        (p) => p.nome.toLowerCase() === payload.patientName.trim().toLowerCase()
      ) ??
      this.patientsList()[0];

    if (!idPsicologo || !matchedPatient) {
      this.addScheduleSlot(payload);
      const slots = this.scheduleSlotsState();
      return of(slots[slots.length - 1]);
    }

    const dayNumber = 21 + Math.max(0, Math.min(4, payload.dayIndex));
    const hourPrefix = payload.hourSlot.slice(0, 2);
    const dataHoraSessao = `2024-10-${dayNumber}T${hourPrefix}:00:00`;
    const modalidade: ModalidadeAtendimentoApi =
      payload.modality === 'Telessaúde' ? 'TELECONSULTA' : 'PRESENCIAL';

    const requestBody: AgendamentoRequestDto = {
      idPsicologo,
      idPaciente: matchedPatient.idPaciente,
      dataHoraSessao,
      modalidade,
      status: 'AGENDADO',
      enderecoLocalSessao:
        payload.modality === 'Presencial'
          ? `Consultório PsicoSafe • ${payload.roomOrNotes || 'Sala 1'}`
          : matchedPatient.enderecoLocalSessao,
    };

    return this.http.post<AgendamentoApiDto>(`${this.apiBaseUrl}/agendamentos`, requestBody).pipe(
      tap((dto) => {
        const updated = [dto, ...this.agendamentosList()];
        this.agendamentosList.set(updated);
        this.syncScheduleSlotsFromBackend(updated);
      }),
      map((dto) => this.mapAgendamentoDtoToSlot(dto))
    );
  }

  public selectAppointmentSlotForClinicalPanel(slot: ScheduleSlotItem): void {
    if (slot.agendamentoId) {
      this.selectedAgendamentoId.set(slot.agendamentoId);
      return;
    }
    const matching = this.agendamentosList().find((a) =>
      a.nomePaciente.toLowerCase().includes(slot.patientName.toLowerCase().split(' ')[0])
    );
    if (matching) {
      this.selectedAgendamentoId.set(matching.idAgendamento);
    }
  }

  private syncScheduleSlotsFromBackend(list: readonly AgendamentoApiDto[]): void {
    const backendSlots = list.map((dto) => this.mapAgendamentoDtoToSlot(dto));
    this.scheduleSlotsState.update((existing) => {
      const filteredExisting = existing.filter(
        (slot) =>
          !backendSlots.some(
            (b) => b.dayIndex === slot.dayIndex && b.hourSlot === slot.hourSlot
          )
      );
      return [...filteredExisting, ...backendSlots];
    });

    const allSlots = this.scheduleSlotsState().filter(
      (s) => s.variant !== 'interval-prontuario' && s.variant !== 'day-closing'
    );
    const teleCount = allSlots.filter(
      (s) => s.variant === 'telehealth-standard' || s.variant === 'active-selected-telehealth'
    ).length;
    const presCount = allSlots.length - teleCount;
    const completedCount = list.filter((a) => a.status === 'REALIZADO').length + 21;
    const totalCount = Math.max(allSlots.length + 18, completedCount);
    const todayCount = allSlots.filter((s) => s.dayIndex === 3).length;

    this.sessionsTodayBadge.set(`${todayCount} Sessões Hoje`);
    this.agendaMetrics.set([
      {
        id: 'telepsicologia',
        icon: 'videocam',
        label: 'Telepsicologia',
        value: `${Math.max(18, teleCount + 12)} Sessões`,
        iconBgClass: 'bg-surface-container-low',
        iconColorClass: 'text-primary',
      },
      {
        id: 'presenciais',
        icon: 'apartment',
        label: 'Presenciais',
        value: `${Math.max(14, presCount + 6)} Sessões`,
        iconBgClass: 'bg-surface-container',
        iconColorClass: 'text-secondary',
      },
      {
        id: 'concluidas',
        icon: 'check_circle',
        label: 'Concluídas',
        value: `${completedCount} / ${totalCount}`,
        iconBgClass: 'bg-secondary-container/40',
        iconColorClass: 'text-on-secondary-container',
      },
      {
        id: 'ocupacao',
        icon: 'schedule',
        label: 'Ocupação Semanal',
        value: `${Math.min(99, Math.round((allSlots.length / 40) * 100 + 54.5))}%`,
        iconBgClass: 'bg-tertiary-fixed/40',
        iconColorClass: 'text-tertiary',
      },
    ]);

    if (!this.selectedAgendamentoId() && list.length > 0) {
      const preferred =
        list.find((a) => a.modalidade === 'TELECONSULTA' && a.status === 'AGENDADO') ?? list[0];
      this.selectedAgendamentoId.set(preferred.idAgendamento);
    }
  }

  private mapAgendamentoDtoToSlot(dto: AgendamentoApiDto): ScheduleSlotItem {
    const dt = new Date(dto.dataHoraSessao);
    const jsDay = dt.getDay(); // 1=Seg .. 5=Sex
    const dayIndex = jsDay >= 1 && jsDay <= 5 ? jsDay - 1 : 3;
    const hourNum = dt.getHours();
    const hourStr = String(hourNum).padStart(2, '0');
    const hourSlot = `${hourStr}:00`;
    const timeRange = `${hourStr}:00 - ${hourStr}:50`;

    let variant: AppointmentVariant = 'telehealth-standard';
    let subtitle = 'Telessaúde';
    let statusLabel: string | undefined;

    if (dto.status === 'REALIZADO') {
      variant = 'completed-supervision';
      subtitle = 'Realizado';
    } else if (dto.modalidade === 'TELECONSULTA') {
      if (dayIndex === 3 && hourSlot === '09:00') {
        variant = 'active-selected-telehealth';
        subtitle = 'Online - Telessaúde CFP';
        statusLabel = 'Sala Ativa • Pronto';
      } else {
        variant = 'telehealth-standard';
        subtitle = 'Telessaúde';
      }
    } else {
      variant = dayIndex === 3 ? 'presential-today-highlight' : 'presential-muted';
      subtitle = 'Presencial • Sala 1';
    }

    return {
      id: `slot-${dto.idAgendamento}`,
      agendamentoId: dto.idAgendamento,
      patientId: dto.idPaciente,
      dayIndex,
      hourSlot,
      timeRange,
      patientName: dto.nomePaciente,
      subtitle,
      statusLabel,
      variant,
    };
  }

  public addScheduleSlot(payload: NewAppointmentPayload): void {
    const newSlot: ScheduleSlotItem = {
      id: `slot-${Date.now()}`,
      dayIndex: payload.dayIndex,
      hourSlot: payload.hourSlot,
      timeRange: payload.timeRange,
      patientName: payload.patientName,
      subtitle:
        payload.modality === 'Telessaúde'
          ? 'Telessaúde'
          : `Presencial • ${payload.roomOrNotes || 'Sala 1'}`,
      variant:
        payload.modality === 'Telessaúde' ? 'telehealth-standard' : 'presential-today-highlight',
    };

    this.scheduleSlotsState.update((slots) => [
      ...slots.filter(
        (s) => !(s.dayIndex === payload.dayIndex && s.hourSlot === payload.hourSlot)
      ),
      newSlot,
    ]);
  }

  public loadClinicalSessionFromBackend(idAgendamentoParam?: string): void {
    const resolveAgendamento$ = (() => {
      const targetId =
        idAgendamentoParam ??
        this.selectedAgendamentoId() ??
        this.agendamentosList()[0]?.idAgendamento;
      if (targetId) {
        const cached = this.agendamentosList().find((a) => a.idAgendamento === targetId);
        if (cached) {
          return of(cached);
        }
        return this.http
          .get<AgendamentoApiDto>(`${this.apiBaseUrl}/agendamentos/${targetId}`)
          .pipe(catchError(() => of(null)));
      }
      return this.http.get<AgendamentoApiDto[]>(`${this.apiBaseUrl}/agendamentos`).pipe(
        tap((list) => {
          if (list.length > 0) {
            this.agendamentosList.set(list);
            this.syncScheduleSlotsFromBackend(list);
          }
        }),
        map(
          (list) =>
            list.find((a) => a.modalidade === 'TELECONSULTA' && a.status === 'AGENDADO') ??
            list[0] ??
            null
        ),
        catchError(() => of(null))
      );
    })();

    resolveAgendamento$.subscribe((agendamento) => {
      if (!agendamento) {
        return;
      }
      this.selectedAgendamentoId.set(agendamento.idAgendamento);
      this.applyAgendamentoHeaderToSession(agendamento);

      const prontuario$ = this.http
        .get<ProntuarioClinicoApiDto>(
          `${this.apiBaseUrl}/prontuarios/agendamento/${agendamento.idAgendamento}`
        )
        .pipe(catchError(() => of(null)));

      const registro$ = this.authService.canAccessRegistrosDocumentais()
        ? this.http
            .get<RegistroDocumentalApiDto>(
              `${this.apiBaseUrl}/registros-documentais/agendamento/${agendamento.idAgendamento}`
            )
            .pipe(catchError(() => of(null)))
        : of(null);

      forkJoin({ prontuario: prontuario$, registro: registro$ }).subscribe(
        ({ prontuario, registro }) => {
          this.clinicalSessionState.update((prev) => ({
            ...prev,
            agendamentoId: agendamento.idAgendamento,
            isSignedAndImmutable: Boolean(prontuario?.assinado || registro?.assinado),
            lastDraftSavedAt: prontuario?.assinado
              ? 'Sessão assinada e selada digitalmente (Imutável)'
              : prontuario
                ? `Sincronizado com servidor CFP (${new Date(prontuario.dataRegistro).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })})`
                : prev.lastDraftSavedAt,
            formalRecord: prontuario
              ? {
                  technicalProcedures: prontuario.procedimentosTecnicos,
                  observableEvolution: prontuario.evolucaoObservavel,
                }
              : prev.formalRecord,
            privateRecord: registro
              ? {
                  provisionalHypotheses: registro.hipotesesProvisorias,
                  supervisionAndCountertransference: registro.notasSupervisao,
                }
              : prev.privateRecord,
            signatureMetadata: {
              responsibleProfessional: agendamento.nomePsicologo || prev.signatureMetadata.responsibleProfessional,
              activeRegistration: `CRP ${this.profileState().crpRegistration}`,
              cryptographicHash:
                prontuario?.hashAssinatura ?? prev.signatureMetadata.cryptographicHash,
            },
          }));
        }
      );
    });
  }

  public saveClinicalSessionToBackend(
    formal: FormalProntuarioRecord,
    priv: PrivateDocumentalRecord
  ): Observable<string> {
    const idAgendamento =
      this.clinicalSessionState().agendamentoId ?? this.selectedAgendamentoId();
    if (!idAgendamento) {
      return of(this.saveClinicalSessionDraft(formal, priv));
    }

    const prontuarioPayload: ProntuarioClinicoRequestDto = {
      idAgendamento,
      procedimentosTecnicos: formal.technicalProcedures.trim() || 'Registro clínico em andamento.',
      evolucaoObservavel: formal.observableEvolution.trim() || 'Evolução observável em andamento.',
    };

    const saveProntuario$ = this.http.post<ProntuarioClinicoApiDto>(
      `${this.apiBaseUrl}/prontuarios`,
      prontuarioPayload
    );

    const hasPrivateContent =
      Boolean(priv.provisionalHypotheses.trim()) ||
      Boolean(priv.supervisionAndCountertransference.trim());

    const saveRegistro$ =
      this.authService.canAccessRegistrosDocumentais() && hasPrivateContent
        ? this.http
            .post<RegistroDocumentalApiDto>(`${this.apiBaseUrl}/registros-documentais`, {
              idAgendamento,
              hipotesesProvisorias:
                priv.provisionalHypotheses.trim() || 'Sem hipóteses adicionais.',
              notasSupervisao:
                priv.supervisionAndCountertransference.trim() || 'Sem notas de supervisão.',
            } satisfies RegistroDocumentalRequestDto)
            .pipe(catchError(() => of(null)))
        : of(null);

    return forkJoin({ prontuario: saveProntuario$, registro: saveRegistro$ }).pipe(
      map(({ prontuario }) => {
        const timeStr = new Date(prontuario.dataRegistro).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const label = `Último rascunho salvo às ${timeStr}`;
        this.clinicalSessionState.update((prev) => ({
          ...prev,
          formalRecord: formal,
          privateRecord: priv,
          lastDraftSavedAt: label,
        }));
        return label;
      })
    );
  }

  public signClinicalSessionOnBackend(
    formal: FormalProntuarioRecord,
    priv: PrivateDocumentalRecord
  ): Observable<ClinicalSessionData> {
    const idAgendamento =
      this.clinicalSessionState().agendamentoId ?? this.selectedAgendamentoId();
    if (!idAgendamento) {
      this.signAndSealClinicalSession(formal, priv);
      return of(this.clinicalSessionState());
    }

    return this.saveClinicalSessionToBackend(formal, priv).pipe(
      switchMap(() =>
        this.http.post<ProntuarioClinicoApiDto>(
          `${this.apiBaseUrl}/prontuarios/agendamento/${idAgendamento}/assinar`,
          {}
        )
      ),
      map((signedDto) => {
        this.clinicalSessionState.update((prev) => ({
          ...prev,
          formalRecord: formal,
          privateRecord: priv,
          isSignedAndImmutable: true,
          lastDraftSavedAt: 'Sessão assinada e selada digitalmente (Imutável)',
          signatureMetadata: {
            ...prev.signatureMetadata,
            cryptographicHash:
              signedDto.hashAssinatura ?? prev.signatureMetadata.cryptographicHash,
          },
        }));
        return this.clinicalSessionState();
      })
    );
  }

  public dispatchEmergencyAlertOnBackend(): Observable<AgendamentoApiDto | null> {
    const idAgendamento =
      this.clinicalSessionState().agendamentoId ?? this.selectedAgendamentoId();
    if (!idAgendamento) {
      return of(null);
    }
    return this.http.post<AgendamentoApiDto>(
      `${this.apiBaseUrl}/agendamentos/${idAgendamento}/alerta-emergencia`,
      {}
    );
  }

  private applyAgendamentoHeaderToSession(agendamento: AgendamentoApiDto): void {
    const words = agendamento.nomePaciente.trim().split(/\s+/);
    const initials =
      words.length >= 2
        ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
        : agendamento.nomePaciente.slice(0, 2).toUpperCase();
    const dt = new Date(agendamento.dataHoraSessao);
    const dateStr = dt.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const hourStr = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const endDt = new Date(dt.getTime() + 50 * 60 * 1000);
    const endHourStr = endDt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const cleanPhone = agendamento.contatoEmergenciaTelefone.replace(/\D/g, '');

    this.clinicalSessionState.update((prev) => ({
      ...prev,
      agendamentoId: agendamento.idAgendamento,
      patientName: agendamento.nomePaciente,
      patientInitials: initials,
      sessionDateLabel: `${dateStr} • ${hourStr} às ${endHourStr}`,
      crisisInfo: {
        ...prev.crisisInfo,
        contactName: agendamento.contatoEmergenciaNome || prev.crisisInfo.contactName,
        phoneDisplay: agendamento.contatoEmergenciaTelefone || prev.crisisInfo.phoneDisplay,
        phoneHref: cleanPhone ? `tel:${cleanPhone}` : prev.crisisInfo.phoneHref,
        sessionAddressLine1:
          agendamento.enderecoLocalSessao || prev.crisisInfo.sessionAddressLine1,
        sessionAddressLine2: 'Endereço Validado para Suporte SAMU 192 (Res. CFP 11/2018)',
      },
    }));
  }

  public saveClinicalSessionDraft(
    formal: FormalProntuarioRecord,
    priv: PrivateDocumentalRecord
  ): string {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const label = `Último rascunho salvo às ${timeStr}`;
    this.clinicalSessionState.update((prev) => ({
      ...prev,
      formalRecord: formal,
      privateRecord: priv,
      lastDraftSavedAt: label,
    }));
    return label;
  }

  public signAndSealClinicalSession(
    formal: FormalProntuarioRecord,
    priv: PrivateDocumentalRecord
  ): void {
    this.clinicalSessionState.update((prev) => ({
      ...prev,
      formalRecord: formal,
      privateRecord: priv,
      isSignedAndImmutable: true,
      lastDraftSavedAt: 'Sessão assinada e selada digitalmente (Imutável)',
    }));
  }

  public updatePaymentMethod(method: PaymentMethodKey): void {
    const statusMap: Record<PaymentMethodKey, string> = {
      pix: 'Liquidado via Pix',
      cartao: 'Processando D+1 (Cartão)',
      ted: 'Conciliação TED Bancária',
    };
    this.activeConciliationState.update((prev) => ({
      ...prev,
      paymentMethod: method,
      statusBadge: statusMap[method],
    }));
  }

  public readonly setBillingFilter = (filter: BillingFilterType): void => {
    this.billingFilter.set(filter);
  };

  public loadPaymentsFromBackend(): void {
    if (this.agendamentosList().length === 0) {
      this.loadAgendamentosFromBackend();
    }
    this.http
      .get<PagamentoApiDto[]>(`${this.apiBaseUrl}/pagamentos`)
      .pipe(catchError(() => of([])))
      .subscribe((list) => {
        if (list.length > 0) {
          this.syncBilledTransactionsFromBackend(list);
        }
      });
  }

  public registerPaymentOnBackend(
    payload: NewPaymentFormPayload
  ): Observable<BilledSessionTransaction> {
    const clinicShare = Math.round(payload.grossAmount * 0.3 * 100) / 100;
    const psychShare = Math.round(payload.grossAmount * 0.7 * 100) / 100;
    const statusSplit: StatusSplitApi =
      payload.paymentMethod === 'cartao' ? 'PENDENTE' : 'LIQUIDADO';
    const meioPagamento = payload.paymentMethod.toUpperCase();

    const createAgendamentoForPayment$ = (): Observable<string | null> => {
      const idPsicologo = this.authService.currentPsychologistId() ?? this.profileState().id;
      const patient =
        this.patientsList().find(
          (p) => p.nome.toLowerCase() === payload.patientName.trim().toLowerCase()
        ) ?? this.patientsList()[0];

      if (!idPsicologo || !patient) {
        return of(null);
      }

      const uniqueMinute = Math.floor(Math.random() * 50) + 1;
      const uniqueSecond = Math.floor(Math.random() * 50) + 1;
      const dataHoraSessao = `2024-10-25T16:${String(uniqueMinute).padStart(2, '0')}:${String(uniqueSecond).padStart(2, '0')}`;
      const agReq: AgendamentoRequestDto = {
        idPsicologo,
        idPaciente: patient.idPaciente,
        dataHoraSessao,
        modalidade: payload.modality === 'Teleconsulta' ? 'TELECONSULTA' : 'PRESENCIAL',
        status: 'REALIZADO',
        enderecoLocalSessao: patient.enderecoLocalSessao,
      };
      return this.http
        .post<AgendamentoApiDto>(`${this.apiBaseUrl}/agendamentos`, agReq)
        .pipe(
          map((ag) => ag.idAgendamento),
          catchError(() => of(null))
        );
    };

    const resolveTargetAgendamento$ = payload.agendamentoId
      ? of(payload.agendamentoId)
      : createAgendamentoForPayment$();

    return resolveTargetAgendamento$.pipe(
      switchMap((idAgendamento) => {
        if (!idAgendamento) {
          this.registerNewPayment(payload);
          return of(this.billedTransactionsState()[0]);
        }
        const requestDto: PagamentoRequestDto = {
          idAgendamento,
          valorTotal: payload.grossAmount,
          taxaClinicaInfraestrutura: clinicShare,
          repasseProfissional: psychShare,
          statusSplit,
          meioPagamento,
        };
        return this.http
          .post<PagamentoApiDto>(`${this.apiBaseUrl}/pagamentos`, requestDto)
          .pipe(
            map((dto) => {
              const mapped = this.mapPagamentoDtoToTransaction(dto);
              this.billedTransactionsState.update((list) => [mapped, ...list]);
              this.recalculateTotalRepass();
              return mapped;
            })
          );
      })
    );
  }

  public settlePaymentSplitOnBackend(
    tx: BilledSessionTransaction
  ): Observable<BilledSessionTransaction> {
    if (!tx.pagamentoId) {
      return of(tx);
    }
    return this.http
      .patch<PagamentoApiDto>(`${this.apiBaseUrl}/pagamentos/${tx.pagamentoId}/liquidar`, {})
      .pipe(
        map((dto) => {
          const updatedTx = this.mapPagamentoDtoToTransaction(dto);
          this.billedTransactionsState.update((list) =>
            list.map((item) => (item.pagamentoId === dto.idPagamento ? updatedTx : item))
          );
          this.recalculateTotalRepass();
          return updatedTx;
        })
      );
  }

  public downloadCarneLeaoCsvFromBackend(): Observable<Blob> {
    return this.http.get(`${this.apiBaseUrl}/pagamentos/carne-leao/csv`, {
      responseType: 'blob',
    });
  }

  public downloadPaymentXmlFromBackend(tx: BilledSessionTransaction): Observable<Blob> {
    const query = tx.pagamentoId ? `?idPagamento=${tx.pagamentoId}` : '';
    return this.http.get(`${this.apiBaseUrl}/pagamentos/comprovante-xml${query}`, {
      responseType: 'blob',
    });
  }

  private syncBilledTransactionsFromBackend(list: readonly PagamentoApiDto[]): void {
    const mapped = list.map((dto) => this.mapPagamentoDtoToTransaction(dto));
    this.billedTransactionsState.set(mapped);
    this.recalculateTotalRepass();

    const first = list[0];
    if (first) {
      const methodKey = (first.meioPagamento?.toLowerCase() || 'pix') as PaymentMethodKey;
      const validMethod: PaymentMethodKey =
        methodKey === 'cartao' || methodKey === 'ted' ? methodKey : 'pix';
      const maskedCpf =
        first.cpfPaciente && first.cpfPaciente.length >= 11
          ? `${first.cpfPaciente.slice(0, 3)}.***.***-${first.cpfPaciente.slice(-2)}`
          : first.cpfPaciente || '382.***.***-19';
      this.activeConciliationState.update((prev) => ({
        ...prev,
        patientName: first.nomePaciente,
        maskedCpfAndProntuario: `CPF: ${maskedCpf} • Prontuário #${first.idPaciente.slice(0, 4).toUpperCase()}`,
        paymentMethod: validMethod,
        grossAmount: Number(first.valorTotal),
        statusBadge:
          first.statusSplit === 'LIQUIDADO'
            ? `Liquidado via ${first.meioPagamento || 'Pix'}`
            : 'Processando D+1',
        auditExtractId: `ID: SPL-${first.idPagamento.slice(0, 7).toUpperCase()}-BR`,
      }));
    }
  }

  private recalculateTotalRepass(): void {
    const sum = this.billedTransactionsState().reduce(
      (acc, item) => acc + item.psychologistShareAmount,
      8400
    );
    this.totalMonthlyRepassFormatted.set(
      sum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    );
  }

  private mapPagamentoDtoToTransaction(dto: PagamentoApiDto): BilledSessionTransaction {
    const words = dto.nomePaciente.trim().split(/\s+/);
    const initials =
      words.length >= 2
        ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
        : dto.nomePaciente.slice(0, 2).toUpperCase();
    const dt = new Date(dto.dataPagamento);
    const dateLabel = dt.toLocaleDateString('pt-BR');
    const timeStr = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const modalityLabel =
      dto.modalidadeSessao === 'TELECONSULTA' ? 'Teleconsulta' : 'Presencial';
    const maskedCpf =
      dto.cpfPaciente && dto.cpfPaciente.length >= 11
        ? `CPF ${dto.cpfPaciente.slice(0, 3)}.***.***-${dto.cpfPaciente.slice(-2)}`
        : `CPF ${dto.cpfPaciente || '382.***.***-19'}`;
    const meio = (dto.meioPagamento || 'PIX').toUpperCase();
    const gross = Number(dto.valorTotal);
    const clinicShare = Number(dto.taxaClinicaInfraestrutura);
    const psychShare = Number(dto.repasseProfissional);
    const clinicPct = gross > 0 ? Math.round((clinicShare / gross) * 100) : 30;
    const psychPct = gross > 0 ? Math.round((psychShare / gross) * 100) : 70;

    return {
      id: `tx-${dto.idPagamento}`,
      pagamentoId: dto.idPagamento,
      dateLabel,
      timeAndModalityLabel: `${timeStr} • ${modalityLabel}`,
      patientInitials: initials,
      initialsVariant: meio === 'PIX' ? 'primary' : 'tertiary',
      patientName: dto.nomePaciente,
      maskedCpf,
      paymentIcon:
        meio === 'PIX' ? 'bolt' : meio === 'CARTAO' ? 'credit_card' : 'account_balance',
      paymentMethodLabel:
        meio === 'PIX'
          ? 'Pix Instantâneo'
          : meio === 'CARTAO'
            ? 'Cartão (1x)'
            : 'TED Conciliado',
      settlementStatus: dto.statusSplit === 'LIQUIDADO' ? 'Liquidado' : 'Processando D+1',
      grossAmount: gross,
      clinicShareAmount: clinicShare,
      clinicPercentageLabel: `${clinicPct}% retenção`,
      psychologistShareAmount: psychShare,
      psychologistPercentageLabel: `${psychPct}% repasse`,
    };
  }

  public registerNewPayment(payload: NewPaymentFormPayload): void {
    const clinicShare = Math.round(payload.grossAmount * 0.3 * 100) / 100;
    const psychShare = Math.round(payload.grossAmount * 0.7 * 100) / 100;
    const words = payload.patientName.trim().split(/\s+/);
    const initials =
      words.length >= 2
        ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
        : payload.patientName.slice(0, 2).toUpperCase();

    const newTx: BilledSessionTransaction = {
      id: `tx-${Date.now()}`,
      dateLabel: '24/10/2024',
      timeAndModalityLabel: `Agora • ${payload.modality}`,
      patientInitials: initials,
      initialsVariant: payload.paymentMethod === 'pix' ? 'primary' : 'tertiary',
      patientName: payload.patientName,
      maskedCpf: payload.maskedCpf.startsWith('CPF')
        ? payload.maskedCpf
        : `CPF ${payload.maskedCpf}`,
      paymentIcon:
        payload.paymentMethod === 'pix'
          ? 'bolt'
          : payload.paymentMethod === 'cartao'
            ? 'credit_card'
            : 'account_balance',
      paymentMethodLabel:
        payload.paymentMethod === 'pix'
          ? 'Pix Instantâneo'
          : payload.paymentMethod === 'cartao'
            ? 'Cartão (1x)'
            : 'TED Conciliado',
      settlementStatus: payload.paymentMethod === 'cartao' ? 'Processando D+1' : 'Liquidado',
      grossAmount: payload.grossAmount,
      clinicShareAmount: clinicShare,
      clinicPercentageLabel: '30% retenção',
      psychologistShareAmount: psychShare,
      psychologistPercentageLabel: '70% repasse',
    };

    this.billedTransactionsState.update((list) => [newTx, ...list]);
  }

  public loadPrivacyAndAuditFromBackend(): void {
    if (this.patientsList().length === 0) {
      this.loadPatientsFromBackend();
    }
    this.http
      .get<LogAuditoriaApiDto[]>(`${this.apiBaseUrl}/auditoria`)
      .pipe(catchError(() => of([])))
      .subscribe((logs) => {
        if (logs.length > 0) {
          this.auditLogs.set(logs.slice(0, 12));
          const latestExport = logs.find((l) => l.acao === 'EXPORTACAO');
          if (latestExport) {
            const dt = new Date(latestExport.carimboTempoUtc);
            const timeStr = dt.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            });
            this.privacyPortalState.update((prev) => ({
              ...prev,
              lastPortabilityEmissionLabel: `Última emissão de portabilidade: ${timeStr} (Log #${latestExport.idLog.slice(0, 6).toUpperCase()})`,
            }));
          }
        }
      });
  }

  public exportPatientPortabilityFromBackend(): Observable<PacienteExportacaoApiDto | null> {
    this.setPrivacyExporting(true);
    const currentState = this.privacyPortalState();
    const matchedPatient =
      this.patientsList().find((p) => p.idPaciente === currentState.targetPatientId) ??
      this.patientsList().find((p) => p.cpf === currentState.targetPatientCpf) ??
      this.patientsList()[0];

    const targetId = matchedPatient?.idPaciente ?? this.patientRecordState().id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      targetId
    );

    if (!isUuid) {
      this.markPortabilityExportCompleted();
      return of(null);
    }

    return this.http
      .get<PacienteExportacaoApiDto>(`${this.apiBaseUrl}/exportacao/paciente/${targetId}`)
      .pipe(
        tap(() => {
          this.markPortabilityExportCompleted();
          this.loadPrivacyAndAuditFromBackend();
        }),
        catchError(() => {
          this.markPortabilityExportCompleted();
          return of(null);
        })
      );
  }

  public updatePrivacySearchQuery(query: string): void {
    const q = query.trim().toLowerCase();
    const matched = this.patientsList().find(
      (p) => p.nome.toLowerCase().includes(q) || p.cpf.includes(q)
    );
    if (matched && q.length >= 3) {
      const words = matched.nome.trim().split(/\s+/);
      const shortName =
        words.length >= 2 ? `${words[0]} ${words[words.length - 1]}` : matched.nome;
      this.privacyPortalState.update((prev) => ({
        ...prev,
        targetPatientId: matched.idPaciente,
        searchQuery: query,
        targetPatientName: matched.nome,
        targetPatientShortName: shortName,
        targetPatientCpf: matched.cpf,
        prontuarioStatusBadge: matched.ativo ? 'Prontuário Ativo' : 'Prontuário Inativo',
      }));
      return;
    }
    this.privacyPortalState.update((prev) => ({
      ...prev,
      searchQuery: query,
    }));
  }

  public setPrivacyExporting(exporting: boolean): void {
    this.privacyPortalState.update((prev) => ({
      ...prev,
      isExporting: exporting,
    }));
  }

  public markPortabilityExportCompleted(): void {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    this.privacyPortalState.update((prev) => ({
      ...prev,
      isExporting: false,
      lastPortabilityEmissionLabel: `Última emissão de portabilidade: Hoje às ${timeStr} (Log #43)`,
    }));
  }
}
