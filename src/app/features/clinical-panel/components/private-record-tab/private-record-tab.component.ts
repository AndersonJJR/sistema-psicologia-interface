import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PrivateRecordFormControls } from '../../containers/clinical-panel-page.component';

@Component({
  selector: 'app-private-record-tab',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      id="tab-privativo-content"
      [formGroup]="formGroup()"
      class="p-space-lg flex flex-col gap-space-lg"
    >
      <!-- CARD DE AVISO CRIPTOGRAFADO -->
      <div
        class="bg-surface-container rounded-xl p-space-md flex items-start gap-space-md shadow-sm"
      >
        <div
          class="w-10 h-10 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shrink-0"
        >
          <span class="material-symbols-outlined text-[22px]">enhanced_encryption</span>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-space-sm flex-wrap">
            <span class="font-label-lg text-label-lg text-tertiary font-bold tracking-wide">
              ÁREA CRIPTOGRAFADA (AES-256 GCM)
            </span>
            <span
              class="bg-tertiary-fixed text-on-tertiary-fixed px-space-xs py-0.5 rounded font-label-sm text-label-sm"
            >
              Código de Ética do Psicólogo - Art. 9º
            </span>
          </div>
          <p class="font-body-md text-body-md text-on-surface">
            🔒 <strong>Acesso estritamente privativo ao psicólogo titular.</strong> Por expressa
            determinação ética e resolução complementar do CFP, este conteúdo
            <strong>NÃO compõe o relatório de evolução fornecido ao paciente</strong> e não é
            exportado em solicitações ordinárias de prontuário, resguardando a dinâmica técnica e a
            intimidade da escuta.
          </p>
        </div>
      </div>

      <!-- CAMPO 1: HIPÓTESES PROVISÓRIAS & DINÂMICA PSÍQUICA -->
      <div class="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs text-tertiary">
            <span class="material-symbols-outlined text-[20px]">psychology</span>
            <label for="hypotheses-textarea" class="font-headline-sm text-headline-sm">
              Hipóteses Provisórias &amp; Dinâmica Psíquica
            </label>
          </div>
          <span
            class="bg-surface-container-lowest px-space-sm py-0.5 rounded text-tertiary font-label-sm text-label-sm font-semibold"
          >
            Chave de Sessão Criptografada
          </span>
        </div>
        <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-inner">
          <textarea
            id="hypotheses-textarea"
            rows="4"
            formControlName="provisionalHypotheses"
            [readonly]="readonlyMode()"
            placeholder="Anotações provisórias sobre mecanismos de defesa, funcionamento egoico, núcleos de conflito..."
            class="w-full bg-transparent text-on-surface font-body-md text-body-md outline-none resize-none"
          ></textarea>
        </div>
      </div>

      <!-- CAMPO 2: NOTAS DE SUPERVISÃO & CONTRATRANSFERÊNCIA -->
      <div class="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs text-tertiary">
            <span class="material-symbols-outlined text-[20px]">record_voice_over</span>
            <label for="supervision-textarea" class="font-headline-sm text-headline-sm">
              Notas de Supervisão &amp; Contratransferência
            </label>
          </div>
          <span class="font-label-sm text-label-sm text-on-surface-variant">
            Material Subjetivo do Profissional
          </span>
        </div>
        <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-inner">
          <textarea
            id="supervision-textarea"
            rows="4"
            formControlName="supervisionAndCountertransference"
            [readonly]="readonlyMode()"
            placeholder="Impressões contratransferenciais, pontos de tensão do terapeuta, pauta para supervisão..."
            class="w-full bg-transparent text-on-surface font-body-md text-body-md outline-none resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  `,
})
export class PrivateRecordTabComponent {
  public readonly formGroup = input.required<FormGroup<PrivateRecordFormControls>>();
  public readonly readonlyMode = input<boolean>(false);
}
