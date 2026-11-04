import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DigitalSignatureMetadata } from '../../../../core/models';
import { ModalShellComponent } from '../../../../shared/components/modal/modal-shell.component';

@Component({
  selector: 'app-signature-modal',
  standalone: true,
  imports: [ModalShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal-shell
      [isOpen]="isOpen()"
      title="Assinatura Digital de Sessão"
      subtitle="ICP-Brasil / Certificação Profissional e-Psi"
      icon="verified_user"
      modalTitleId="sign-modal-title"
      (closed)="cancelled.emit()"
    >
      <!-- ALERTA DE IMUTABILIDADE -->
      <div class="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-sm">
        <span class="material-symbols-outlined text-primary text-[22px] shrink-0">info</span>
        <div class="flex flex-col gap-1">
          <span class="font-label-lg text-label-lg text-on-surface font-semibold">
            Registro Permanente e Imutável
          </span>
          <p class="font-body-sm text-body-sm text-on-surface-variant">
            Atenção: Ao assinar com certificado digital, o registro se tornará
            <strong class="text-on-surface">IMUTÁVEL</strong> conforme regras do Conselho Federal de
            Psicologia (CFP).
            <span class="text-error font-medium">
              Não serão permitidas edições ou exclusões posteriores.
            </span>
          </p>
        </div>
      </div>

      <!-- DADOS DA ASSINATURA -->
      <div
        class="bg-surface-bright rounded-lg p-space-sm flex flex-col gap-1 font-body-sm text-body-sm"
      >
        <div class="flex justify-between">
          <span class="text-on-surface-variant">Profissional Responsável:</span>
          <span class="text-on-surface font-medium">
            {{ metadata().responsibleProfessional }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-on-surface-variant">Registro Ativo:</span>
          <span class="text-on-surface font-medium">{{ metadata().activeRegistration }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-on-surface-variant">Hash Criptográfico:</span>
          <span class="text-primary font-mono text-[11px]">
            {{ metadata().cryptographicHash }}
          </span>
        </div>
      </div>

      <!-- AÇÕES DO MODAL -->
      <div class="flex items-center justify-end gap-space-sm pt-space-xs">
        <button
          type="button"
          id="btn-cancel-sign"
          (click)="cancelled.emit()"
          class="px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-lg text-label-lg transition-all cursor-pointer"
        >
          Revisar Anotações
        </button>
        <button
          type="button"
          id="btn-confirm-sign"
          (click)="confirmed.emit()"
          class="px-space-lg py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container shadow-md flex items-center gap-space-xs transition-all cursor-pointer"
        >
          <span class="material-symbols-outlined text-[18px]">done_all</span>
          Confirmar e Assinar
        </button>
      </div>
    </app-modal-shell>
  `,
})
export class SignatureModalComponent {
  public readonly isOpen = input.required<boolean>();
  public readonly metadata = input.required<DigitalSignatureMetadata>();
  public readonly cancelled = output<void>();
  public readonly confirmed = output<void>();
}
