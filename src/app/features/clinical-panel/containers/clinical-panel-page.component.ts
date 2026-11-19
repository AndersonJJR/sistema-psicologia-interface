import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClinicalTabType } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { ClinicalStoreService } from '../../../core/services/clinical-store.service';
import { LayoutService } from '../../../core/services/layout.service';
import { CompletedSessionsListComponent } from '../components/completed-sessions-list/completed-sessions-list.component';
import { FormalRecordTabComponent } from '../components/formal-record-tab/formal-record-tab.component';
import { PrivateRecordTabComponent } from '../components/private-record-tab/private-record-tab.component';
import { SessionHeaderComponent } from '../components/session-header/session-header.component';
import { SignatureModalComponent } from '../components/signature-modal/signature-modal.component';

export interface FormalRecordFormControls {
  technicalProcedures: FormControl<string>;
  observableEvolution: FormControl<string>;
}

export interface PrivateRecordFormControls {
  provisionalHypotheses: FormControl<string>;
  supervisionAndCountertransference: FormControl<string>;
}

@Component({
  selector: 'app-clinical-panel-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CompletedSessionsListComponent,
    SessionHeaderComponent,
    FormalRecordTabComponent,
    PrivateRecordTabComponent,
    SignatureModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col w-full gap-space-lg pb-space-xl">
      <!-- LISTA DE ATENDIMENTOS JÁ REALIZADOS COM PENDÊNCIA DE REGISTRO -->
      <app-completed-sessions-list
        [sessions]="store.completedSessionsList()"
        [selectedAgendamentoId]="store.selectedAgendamentoId()"
        (selectSession)="onSelectCompletedSession($event)"
      />

      <!-- CABEÇALHO DA SESSÃO VINCULADA -->
      <app-session-header
        [patientName]="store.clinicalSession().patientName"
        [patientInitials]="store.clinicalSession().patientInitials"
        [patientAgeLabel]="store.clinicalSession().patientAgeLabel"
        [sessionDateLabel]="store.clinicalSession().sessionDateLabel"
        [sessionNumberLabel]="store.clinicalSession().sessionNumberLabel"
        [isSigned]="store.clinicalSession().isSignedAndImmutable"
      />

      <!-- SEGREGAÇÃO REGULATÓRIA MANDATÓRIA CFP: DUAS GUIAS -->
      <section class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        <!-- NAVEGAÇÃO ENTRE ABAS COM DIFERENCIAÇÃO CONCEITUAL -->
        <div class="bg-surface-container-low px-space-md pt-space-sm flex gap-space-sm flex-wrap">
          <!-- ABA 1: FORMAL / PRONTUÁRIO PÚBLICO -->
          <button
            type="button"
            id="tab-prontuario-btn"
            (click)="selectTab('prontuario')"
            [class]="
              activeTab() === 'prontuario'
                ? 'flex items-center gap-space-sm px-space-lg py-space-md rounded-t-xl bg-surface-container-lowest text-primary font-headline-sm text-headline-sm shadow-[0_-2px_6px_rgba(0,0,0,0.02)] transition-all cursor-pointer'
                : 'flex items-center gap-space-sm px-space-lg py-space-md rounded-t-xl text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm transition-all cursor-pointer'
            "
          >
            <span class="material-symbols-outlined text-[22px]">description</span>
            <span>Prontuário Psicológico</span>
            <span
              class="bg-surface-container-high text-primary px-space-xs py-0.5 rounded font-label-sm text-label-sm"
            >
              Público / Formal
            </span>
          </button>

          <!-- ABA 2: REGISTRO DOCUMENTAL PRIVATIVO (ENCRYPTED) -->
          <button
            type="button"
            id="tab-privativo-btn"
            (click)="selectTab('privativo')"
            [class]="
              activeTab() === 'privativo'
                ? 'flex items-center gap-space-sm px-space-lg py-space-md rounded-t-xl bg-surface-container-lowest text-tertiary font-headline-sm text-headline-sm shadow-[0_-2px_6px_rgba(0,0,0,0.02)] transition-all cursor-pointer'
                : 'flex items-center gap-space-sm px-space-lg py-space-md rounded-t-xl text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm transition-all cursor-pointer'
            "
          >
            <span class="material-symbols-outlined text-[22px] text-tertiary">lock</span>
            <span>Registro Documental</span>
            <span
              class="bg-tertiary/10 text-tertiary px-space-xs py-0.5 rounded font-label-sm text-label-sm flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[12px]">security</span>
              Privativo / Sigiloso
            </span>
          </button>
        </div>

        <!-- CONTEÚDO DAS ABAS -->
        @if (activeTab() === 'prontuario') {
          <app-formal-record-tab
            [formGroup]="formalForm"
            [readonlyMode]="store.clinicalSession().isSignedAndImmutable"
            (formatAction)="onFormatText($event)"
          />
        } @else {
          <app-private-record-tab
            [formGroup]="privateForm"
            [readonlyMode]="store.clinicalSession().isSignedAndImmutable"
          />
        }
      </section>

      <!-- RODAPÉ DE AÇÃO CLÍNICA COM DIGITAL SIGNATURE & AUDITORIA -->
      <footer
        class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md"
      >
        <div class="flex items-center gap-space-sm">
          <div class="w-2.5 h-2.5 rounded-full bg-secondary"></div>
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-space-sm">
            <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Backup em Nuvem Seguro (LGPD Saúde)
            </span>
            <span class="hidden sm:inline text-on-surface-variant">•</span>
            <span
              id="draft-status"
              [class]="
                store.clinicalSession().isSignedAndImmutable
                  ? 'bg-secondary-container text-on-secondary-fixed px-space-sm py-0.5 rounded font-label-sm text-label-sm font-semibold'
                  : 'bg-surface-container-low px-space-sm py-0.5 rounded text-primary font-label-sm text-label-sm'
              "
            >
              {{ store.clinicalSession().lastDraftSavedAt }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-space-sm w-full sm:w-auto justify-end">
          <!-- SALVAR RASCUNHO -->
          <button
            type="button"
            id="btn-save-draft"
            [disabled]="store.clinicalSession().isSignedAndImmutable"
            (click)="onSaveDraft()"
            class="px-space-md py-2.5 rounded-lg bg-surface-container text-primary font-label-lg text-label-lg hover:bg-surface-container-high transition-all flex items-center gap-space-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="material-symbols-outlined text-[18px]">save</span>
            <span>Salvar Rascunho</span>
          </button>

          <!-- ASSINAR E FINALIZAR SESSÃO -->
          <button
            type="button"
            id="btn-sign-modal"
            [disabled]="store.clinicalSession().isSignedAndImmutable"
            (click)="openSignatureModal()"
            class="px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all flex items-center gap-space-xs shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (store.clinicalSession().isSignedAndImmutable) {
              <span class="material-symbols-outlined text-[20px]">lock</span>
              <span>Sessão Finalizada</span>
            } @else {
              <span class="material-symbols-outlined text-[20px]">draw</span>
              <span>Assinar e Finalizar Sessão</span>
            }
          </button>
        </div>
      </footer>

      <!-- MODAL DE CONFIRMAÇÃO: ASSINATURA DIGITAL IMUTÁVEL -->
      <app-signature-modal
        [isOpen]="isSignatureModalOpen()"
        [metadata]="store.clinicalSession().signatureMetadata"
        (cancelled)="closeSignatureModal()"
        (confirmed)="onConfirmDigitalSignature()"
      />
    </div>
  `,
})
export class ClinicalPanelPageComponent implements OnInit {
  public readonly store = inject(ClinicalStoreService);
  private readonly authService = inject(AuthService);
  private readonly layout = inject(LayoutService);

  public readonly activeTab = signal<ClinicalTabType>('prontuario');
  public readonly isSignatureModalOpen = signal<boolean>(false);

  private readonly initialFormal = this.store.clinicalSession().formalRecord;
  private readonly initialPrivate = this.store.clinicalSession().privateRecord;

  public readonly formalForm = new FormGroup<FormalRecordFormControls>({
    technicalProcedures: new FormControl<string>(this.initialFormal.technicalProcedures, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    observableEvolution: new FormControl<string>(this.initialFormal.observableEvolution, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  public readonly privateForm = new FormGroup<PrivateRecordFormControls>({
    provisionalHypotheses: new FormControl<string>(this.initialPrivate.provisionalHypotheses, {
      nonNullable: true,
    }),
    supervisionAndCountertransference: new FormControl<string>(
      this.initialPrivate.supervisionAndCountertransference,
      { nonNullable: true }
    ),
  });

  constructor() {
    effect(() => {
      const session = this.store.clinicalSession();
      this.formalForm.patchValue(
        {
          technicalProcedures: session.formalRecord.technicalProcedures,
          observableEvolution: session.formalRecord.observableEvolution,
        },
        { emitEvent: false }
      );
      this.privateForm.patchValue(
        {
          provisionalHypotheses: session.privateRecord.provisionalHypotheses,
          supervisionAndCountertransference:
            session.privateRecord.supervisionAndCountertransference,
        },
        { emitEvent: false }
      );
    });
  }

  public ngOnInit(): void {
    this.store.loadCompletedSessionsForDocumentation();
  }

  public onSelectCompletedSession(idAgendamento: string): void {
    this.store.loadClinicalSessionFromBackend(idAgendamento);
  }

  public selectTab(tab: ClinicalTabType): void {
    if (
      tab === 'privativo' &&
      this.authService.isAuthenticated() &&
      !this.authService.canAccessRegistrosDocumentais()
    ) {
      this.layout.showToast(
        'Sigilo Profissional Estrito (CFP 001/2009)',
        'O Registro Documental criptografado é exclusivo do psicólogo titular da sessão.',
        'lock'
      );
      return;
    }
    this.activeTab.set(tab);
  }

  public onFormatText(event: {
    field: keyof FormalRecordFormControls;
    tag: 'bold' | 'italic' | 'numbered' | 'bullet' | 'quote';
  }): void {
    if (this.store.clinicalSession().isSignedAndImmutable) {
      return;
    }
    const control = this.formalForm.controls[event.field];
    const current = control.value;
    const suffixMap: Record<typeof event.tag, string> = {
      bold: '\n**Nota clínica destacada**',
      italic: '\n*Observação clínica complementar*',
      numbered: `\n${current.split('\n').length + 1}. `,
      bullet: '\n• ',
      quote: '\n> "Relato textual do paciente em sessão"',
    };
    control.setValue(current + suffixMap[event.tag]);
  }

  public onSaveDraft(): void {
    this.store
      .saveClinicalSessionToBackend(
        this.formalForm.getRawValue(),
        this.privateForm.getRawValue()
      )
      .subscribe({
        next: (timeLabel) => {
          this.layout.showToast(
            'Rascunho Clínico Salvo',
            `${timeLabel} com criptografia AES-256 ativa.`
          );
        },
        error: (err: unknown) => {
          this.layout.showToast(
            'Erro ao Salvar Rascunho',
            AuthService.extractErrorMessage(err, 'Não foi possível salvar o rascunho da sessão.'),
            'error'
          );
        },
      });
  }

  public openSignatureModal(): void {
    if (this.formalForm.invalid) {
      this.formalForm.markAllAsTouched();
      this.activeTab.set('prontuario');
      this.layout.showToast(
        'Prontuário Formal Incompleto',
        'Preencha os procedimentos técnicos e a evolução observável antes de assinar.',
        'warning'
      );
      return;
    }
    this.isSignatureModalOpen.set(true);
  }

  public closeSignatureModal(): void {
    this.isSignatureModalOpen.set(false);
  }

  public onConfirmDigitalSignature(): void {
    this.store
      .signClinicalSessionOnBackend(
        this.formalForm.getRawValue(),
        this.privateForm.getRawValue()
      )
      .subscribe({
        next: () => {
          this.isSignatureModalOpen.set(false);
          this.layout.showToast(
            'Sessão Assinada e Selada Digitalmente',
            'Prontuário assinado com certificado ICP-Brasil (Registro Imutável).'
          );
        },
        error: (err: unknown) => {
          this.isSignatureModalOpen.set(false);
          this.layout.showToast(
            'Falha na Assinatura Digital',
            AuthService.extractErrorMessage(err, 'Não foi possível assinar digitalmente a sessão.'),
            'error'
          );
        },
      });
  }
}
