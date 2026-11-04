import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewPaymentFormPayload, PaymentMethodKey } from '../../../../core/models';
import { ModalShellComponent } from '../../../../shared/components/modal/modal-shell.component';

interface PaymentFormControls {
  patientName: FormControl<string>;
  maskedCpf: FormControl<string>;
  modality: FormControl<'Presencial' | 'Teleconsulta'>;
  paymentMethod: FormControl<PaymentMethodKey>;
  grossAmount: FormControl<number>;
}

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ModalShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal-shell
      [isOpen]="isOpen()"
      title="Registrar Pagamento &amp; Emitir Recibo"
      subtitle="Segregação contábil automática 30% Clínica (NFS-e) / 70% Psicólogo (Carnê-Leão)"
      icon="receipt_long"
      modalTitleId="payment-modal-title"
      (closed)="closed.emit()"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-space-md" novalidate>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label for="pay-patient" class="font-label-md text-label-md text-on-surface">
              Nome do Paciente *
            </label>
            <input
              id="pay-patient"
              type="text"
              formControlName="patientName"
              placeholder="Ex.: Sofia Albuquerque"
              class="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="pay-cpf" class="font-label-md text-label-md text-on-surface">
              CPF do Titular *
            </label>
            <input
              id="pay-cpf"
              type="text"
              formControlName="maskedCpf"
              placeholder="214.***.***-09"
              class="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <div class="flex flex-col gap-1">
            <label for="pay-modality" class="font-label-md text-label-md text-on-surface">
              Modalidade
            </label>
            <select
              id="pay-modality"
              formControlName="modality"
              class="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Presencial">Presencial</option>
              <option value="Teleconsulta">Teleconsulta</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label for="pay-method" class="font-label-md text-label-md text-on-surface">
              Meio de Liquidação
            </label>
            <select
              id="pay-method"
              formControlName="paymentMethod"
              class="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pix">Pix Instantâneo</option>
              <option value="cartao">Cartão (1x)</option>
              <option value="ted">TED Conciliado</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label for="pay-amount" class="font-label-md text-label-md text-on-surface">
              Valor Bruto (R$) *
            </label>
            <input
              id="pay-amount"
              type="number"
              min="50"
              step="10"
              formControlName="grossAmount"
              (input)="onAmountInput($event)"
              class="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary font-bold"
            />
          </div>
        </div>

        <!-- Preview de Split -->
        <div class="p-space-md rounded-xl bg-surface-container-low grid grid-cols-2 gap-space-md">
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-tertiary uppercase font-semibold">
              Clínica (30% NFS-e)
            </span>
            <span class="font-headline-sm text-headline-sm text-tertiary font-bold">
              {{ clinicSharePreview() }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-primary uppercase font-semibold">
              Psicólogo (70% Carnê-Leão)
            </span>
            <span class="font-headline-sm text-headline-sm text-primary font-bold">
              {{ psychSharePreview() }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            type="button"
            (click)="closed.emit()"
            class="px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-lg text-label-lg transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-space-lg py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container shadow-md flex items-center gap-space-xs transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">verified</span>
            Liquidar &amp; Emitir Recibo
          </button>
        </div>
      </form>
    </app-modal-shell>
  `,
})
export class PaymentModalComponent {
  public readonly isOpen = input.required<boolean>();
  public readonly closed = output<void>();
  public readonly paymentSubmitted = output<NewPaymentFormPayload>();

  private readonly liveAmount = signal<number>(250);

  public readonly clinicSharePreview = computed<string>(() =>
    (this.liveAmount() * 0.3).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  );

  public readonly psychSharePreview = computed<string>(() =>
    (this.liveAmount() * 0.7).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  );

  public readonly form = new FormGroup<PaymentFormControls>({
    patientName: new FormControl<string>('Sofia Albuquerque', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    maskedCpf: new FormControl<string>('214.***.***-09', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    modality: new FormControl<'Presencial' | 'Teleconsulta'>('Presencial', {
      nonNullable: true,
    }),
    paymentMethod: new FormControl<PaymentMethodKey>('pix', { nonNullable: true }),
    grossAmount: new FormControl<number>(250, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(50)],
    }),
  });

  public onAmountInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    if (!Number.isNaN(val) && val > 0) {
      this.liveAmount.set(val);
    }
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.paymentSubmitted.emit(this.form.getRawValue());
  }
}
