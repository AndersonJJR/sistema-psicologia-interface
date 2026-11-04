export type PaymentMethodKey = 'pix' | 'cartao' | 'ted';

export type BillingFilterType = 'todas' | 'liquidadas' | 'conciliacao';

export interface PaymentMethodOption {
  readonly value: PaymentMethodKey;
  readonly label: string;
}

export interface ActiveBillingConciliation {
  readonly patientName: string;
  readonly maskedCpfAndProntuario: string;
  readonly sessionSummary: string;
  readonly avatarUrl: string;
  readonly statusBadge: string;
  readonly paymentMethod: PaymentMethodKey;
  readonly grossAmount: number;
  readonly clinicPercentage: number;
  readonly psychologistPercentage: number;
  readonly clinicCnpjNote: string;
  readonly bankSubaccount: string;
  readonly auditExtractId: string;
  readonly irpfSyncStatus: string;
}

export interface BilledSessionTransaction {
  readonly id: string;
  readonly dateLabel: string;
  readonly timeAndModalityLabel: string;
  readonly patientInitials: string;
  readonly initialsVariant: 'primary' | 'tertiary';
  readonly patientName: string;
  readonly maskedCpf: string;
  readonly paymentIcon: 'bolt' | 'credit_card' | 'account_balance';
  readonly paymentMethodLabel: string;
  readonly settlementStatus: 'Liquidado' | 'Processando D+1';
  readonly grossAmount: number;
  readonly clinicShareAmount: number;
  readonly clinicPercentageLabel: string;
  readonly psychologistShareAmount: number;
  readonly psychologistPercentageLabel: string;
}

export interface NewPaymentFormPayload {
  readonly patientName: string;
  readonly maskedCpf: string;
  readonly modality: 'Presencial' | 'Teleconsulta';
  readonly paymentMethod: PaymentMethodKey;
  readonly grossAmount: number;
}
