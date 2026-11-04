import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormalRecordFormControls } from '../../containers/clinical-panel-page.component';

@Component({
  selector: 'app-formal-record-tab',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      id="tab-prontuario-content"
      [formGroup]="formGroup()"
      class="p-space-lg flex flex-col gap-space-lg"
    >
      <!-- CARD DE AVISO NORMATIVO CFP (AZUL/CINZA) -->
      <div class="bg-surface-container-low rounded-xl p-space-md flex items-start gap-space-md">
        <div
          class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center shrink-0 text-tertiary"
        >
          <span class="material-symbols-outlined text-[22px]">gavel</span>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-space-sm flex-wrap">
            <span class="font-label-lg text-label-lg text-on-surface font-semibold">
              Garantia de Acesso e Sigilo Compartilhado
            </span>
            <span
              class="bg-surface-container-highest text-tertiary px-space-xs py-0.5 rounded font-label-sm text-label-sm"
            >
              Resolução CFP nº 01/2009
            </span>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant">
            Estas informações compõem o
            <strong class="text-on-surface">prontuário oficial</strong> e podem ser solicitadas pelo
            paciente ou por determinação de ordem judicial. Use redação estritamente técnica,
            objetiva, livre de conjecturas hipotéticas ou impressões morais subjetivas.
          </p>
        </div>
      </div>

      <!-- CAMPO 1: PROCEDIMENTOS TÉCNICOS ADOTADOS -->
      <div class="bg-surface-bright rounded-xl p-space-md flex flex-col gap-space-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-[20px] text-primary">psychology_alt</span>
            <label
              for="procedures-textarea"
              class="font-headline-sm text-headline-sm text-on-surface"
            >
              Procedimentos Técnicos Adotados
            </label>
          </div>
          <span class="font-label-sm text-label-sm text-on-surface-variant">
            Vocabulário TCC Padronizado
          </span>
        </div>

        <!-- RICH TEXT TOOLBAR -->
        <div
          class="bg-surface-container-lowest rounded-lg p-1 flex flex-wrap items-center gap-1 shadow-sm text-on-surface-variant"
        >
          <button
            type="button"
            title="Negrito"
            [disabled]="readonlyMode()"
            (click)="formatAction.emit({ field: 'technicalProcedures', tag: 'bold' })"
            class="p-1.5 hover:bg-surface-container rounded cursor-pointer disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[18px]">format_bold</span>
          </button>
          <button
            type="button"
            title="Itálico"
            [disabled]="readonlyMode()"
            (click)="formatAction.emit({ field: 'technicalProcedures', tag: 'italic' })"
            class="p-1.5 hover:bg-surface-container rounded cursor-pointer disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[18px]">format_italic</span>
          </button>
          <span class="w-px h-4 bg-outline-variant mx-1"></span>
          <button
            type="button"
            title="Lista ordenada"
            [disabled]="readonlyMode()"
            (click)="formatAction.emit({ field: 'technicalProcedures', tag: 'numbered' })"
            class="p-1.5 hover:bg-surface-container rounded cursor-pointer disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[18px]">format_list_numbered</span>
          </button>
          <button
            type="button"
            title="Lista com marcadores"
            [disabled]="readonlyMode()"
            (click)="formatAction.emit({ field: 'technicalProcedures', tag: 'bullet' })"
            class="p-1.5 hover:bg-surface-container rounded cursor-pointer disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[18px]">format_list_bulleted</span>
          </button>
          <span class="w-px h-4 bg-outline-variant mx-1"></span>
          <button
            type="button"
            title="Citação clínica"
            [disabled]="readonlyMode()"
            (click)="formatAction.emit({ field: 'technicalProcedures', tag: 'quote' })"
            class="p-1.5 hover:bg-surface-container rounded cursor-pointer disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[18px]">format_quote</span>
          </button>
        </div>

        <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-inner">
          <textarea
            id="procedures-textarea"
            rows="4"
            formControlName="technicalProcedures"
            [readonly]="readonlyMode()"
            placeholder="Descreva as técnicas, testes e intervenções utilizadas..."
            class="w-full bg-transparent text-on-surface font-body-md text-body-md outline-none resize-none"
          ></textarea>
        </div>
        @if (isInvalid('technicalProcedures')) {
          <span class="text-label-sm font-label-sm text-error" role="alert">
            O registro dos procedimentos técnicos adotados é obrigatório para assinatura do
            prontuário.
          </span>
        }
      </div>

      <!-- CAMPO 2: EVOLUÇÃO OBSERVÁVEL -->
      <div class="bg-surface-bright rounded-xl p-space-md flex flex-col gap-space-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-[20px] text-primary">timeline</span>
            <label
              for="evolution-textarea"
              class="font-headline-sm text-headline-sm text-on-surface"
            >
              Evolução Observável &amp; Condições Psíquicas Apresentadas
            </label>
          </div>
          <span class="font-label-sm text-label-sm text-secondary font-medium">
            Parâmetros de Humor Normais
          </span>
        </div>

        <!-- RICH TEXT TOOLBAR -->
        <div
          class="bg-surface-container-lowest rounded-lg p-1 flex flex-wrap items-center gap-1 shadow-sm text-on-surface-variant"
        >
          <button
            type="button"
            [disabled]="readonlyMode()"
            (click)="formatAction.emit({ field: 'observableEvolution', tag: 'bold' })"
            class="p-1.5 hover:bg-surface-container rounded cursor-pointer disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[18px]">format_bold</span>
          </button>
          <button
            type="button"
            [disabled]="readonlyMode()"
            (click)="formatAction.emit({ field: 'observableEvolution', tag: 'italic' })"
            class="p-1.5 hover:bg-surface-container rounded cursor-pointer disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[18px]">format_italic</span>
          </button>
          <span class="w-px h-4 bg-outline-variant mx-1"></span>
          <button
            type="button"
            [disabled]="readonlyMode()"
            (click)="formatAction.emit({ field: 'observableEvolution', tag: 'bullet' })"
            class="p-1.5 hover:bg-surface-container rounded cursor-pointer disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[18px]">checklist</span>
          </button>
          <span class="w-px h-4 bg-outline-variant mx-1"></span>
          <span class="text-on-surface-variant text-label-sm font-label-sm px-2">
            Autossalvamento automático habilitado
          </span>
        </div>

        <div class="bg-surface-container-lowest rounded-xl p-space-md shadow-inner">
          <textarea
            id="evolution-textarea"
            rows="5"
            formControlName="observableEvolution"
            [readonly]="readonlyMode()"
            placeholder="Relato descritivo das queixas, humor observado, orientação global..."
            class="w-full bg-transparent text-on-surface font-body-md text-body-md outline-none resize-none"
          ></textarea>
        </div>
        @if (isInvalid('observableEvolution')) {
          <span class="text-label-sm font-label-sm text-error" role="alert">
            A síntese de evolução clínica observável é obrigatória.
          </span>
        }
      </div>
    </div>
  `,
})
export class FormalRecordTabComponent {
  public readonly formGroup = input.required<FormGroup<FormalRecordFormControls>>();
  public readonly readonlyMode = input<boolean>(false);
  public readonly formatAction = output<{
    field: keyof FormalRecordFormControls;
    tag: 'bold' | 'italic' | 'numbered' | 'bullet' | 'quote';
  }>();

  public isInvalid(field: keyof FormalRecordFormControls): boolean {
    const control = this.formGroup().controls[field];
    return control.invalid && (control.dirty || control.touched);
  }
}
