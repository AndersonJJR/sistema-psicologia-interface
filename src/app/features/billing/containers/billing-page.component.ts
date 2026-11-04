import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  BilledSessionTransaction,
  BillingFilterType,
  NewPaymentFormPayload,
  PaymentMethodKey,
} from '../../../core/models';
import { ClinicalStoreService } from '../../../core/services/clinical-store.service';
import { LayoutService } from '../../../core/services/layout.service';
import { BilledSessionsTableComponent } from '../components/billed-sessions-table/billed-sessions-table.component';
import { PaymentModalComponent } from '../components/payment-modal/payment-modal.component';
import { SplitConciliatorComponent } from '../components/split-conciliator/split-conciliator.component';

@Component({
  selector: 'app-billing-page',
  standalone: true,
  imports: [SplitConciliatorComponent, BilledSessionsTableComponent, PaymentModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col w-full gap-space-lg">
      <!-- Header Institucional & Orientação Regulatória -->
      <div
        class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm"
      >
        <div class="flex flex-col gap-space-xs max-w-3xl">
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Gestão Financeira &amp; Split de Pagamentos
          </h1>
          <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Segregação tributária automatizada por split banking: a clínica tributa apenas a taxa
            de intermediação/estrutura (NFS-e sobre a comissão), enquanto os honorários
            profissionais são depositados diretamente e declarados no Carnê-Leão do psicólogo
            autônomo sem bitributação.
          </p>
        </div>

        <!-- Ações de topo -->
        <div class="flex flex-wrap items-center gap-space-sm">
          <button
            type="button"
            (click)="onExportCarneLeao()"
            class="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-lg text-label-lg font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <span class="material-symbols-outlined text-[20px]">download</span>
            Exportar Carnê-Leão (Livro Caixa)
          </button>
          <button
            type="button"
            (click)="openPaymentModal()"
            class="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span class="material-symbols-outlined text-[20px]">receipt_long</span>
            Registrar Pagamento &amp; Emitir Recibo
          </button>
        </div>
      </div>

      <!-- Painel de Resumo do Atendimento Ativo & Simulação de Split -->
      <app-split-conciliator
        [conciliation]="store.activeConciliation()"
        [paymentOptions]="store.paymentMethodOptions()"
        [clinicShare]="store.clinicSplitAmount()"
        [psychologistShare]="store.psychologistSplitAmount()"
        (methodChanged)="onPaymentMethodChanged($event)"
      />

      <!-- Tabela de Sessões Faturadas Recentes com Segregação Detalhada -->
      <app-billed-sessions-table
        [transactions]="store.filteredTransactions()"
        [activeFilter]="store.billingFilter()"
        [totalMonthlyRepass]="store.totalMonthlyRepassFormatted()"
        (filterChanged)="onFilterChanged($event)"
        (viewReceipt)="onViewReceipt($event)"
        (downloadXml)="onDownloadXml($event)"
      />

      <!-- Modal de Novo Pagamento & Recibo -->
      <app-payment-modal
        [isOpen]="isPaymentModalOpen()"
        (closed)="closePaymentModal()"
        (paymentSubmitted)="onPaymentSubmitted($event)"
      />
    </div>
  `,
})
export class BillingPageComponent {
  public readonly store = inject(ClinicalStoreService);
  private readonly layout = inject(LayoutService);

  public readonly isPaymentModalOpen = signal<boolean>(false);

  public onPaymentMethodChanged(method: PaymentMethodKey): void {
    this.store.updatePaymentMethod(method);
    this.layout.showToast(
      'Método de Liquidação Atualizado',
      'Regra de split 30% Clínica / 70% Psicólogo recalculada no gateway.'
    );
  }

  public onFilterChanged(filter: BillingFilterType): void {
    this.store.setBillingFilter(filter);
  }

  public onExportCarneLeao(): void {
    this.layout.showToast(
      'Livro Caixa Carnê-Leão Exportado',
      'Arquivo CSV/DARF compatível com o e-CAC da Receita Federal gerado com sucesso.',
      'download_done'
    );
  }

  public openPaymentModal(): void {
    this.isPaymentModalOpen.set(true);
  }

  public closePaymentModal(): void {
    this.isPaymentModalOpen.set(false);
  }

  public onPaymentSubmitted(payload: NewPaymentFormPayload): void {
    this.store.registerNewPayment(payload);
    this.isPaymentModalOpen.set(false);
    this.layout.showToast(
      'Pagamento Liquidado & Recibo Emitido',
      `Split automático concluído para ${payload.patientName} (70% repassado ao psicólogo).`
    );
  }

  public onViewReceipt(tx: BilledSessionTransaction): void {
    this.layout.showToast(
      `Recibo Fiscal — ${tx.patientName}`,
      `Comprovante de R$ ${tx.grossAmount.toFixed(2)} autenticado sob CRP 06/142980.`,
      'description'
    );
  }

  public onDownloadXml(tx: BilledSessionTransaction): void {
    this.layout.showToast(
      'Download XML de Split Bancário',
      `Nota de liquidação de ${tx.patientName} (${tx.dateLabel}) transferida.`,
      'file_download'
    );
  }
}
