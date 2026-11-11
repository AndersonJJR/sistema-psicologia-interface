import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClinicalApproachKey } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { ClinicalStoreService } from '../../../core/services/clinical-store.service';
import { LayoutService } from '../../../core/services/layout.service';
import { CivilIdentificationCardComponent } from '../components/civil-identification-card/civil-identification-card.component';
import { EpsiCredentialCardComponent } from '../components/epsi-credential-card/epsi-credential-card.component';
import { TelepsychologyRoomsCardComponent } from '../components/telepsychology-rooms-card/telepsychology-rooms-card.component';

export interface ProfileFormControls {
  fullName: FormControl<string>;
  cpf: FormControl<string>;
  phone: FormControl<string>;
  crpRegistration: FormControl<string>;
  clinicalApproach: FormControl<ClinicalApproachKey>;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CivilIdentificationCardComponent,
    EpsiCredentialCardComponent,
    TelepsychologyRoomsCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col w-full gap-space-lg">
      <!-- Header Institucional & Status de Auditoria -->
      <div class="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
        <div
          class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"
        ></div>
        <div
          class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-space-xs">
              @if (layout.isSidebarCollapsed()) {
                <span
                  class="inline-flex items-center gap-1 text-label-sm text-primary font-semibold uppercase tracking-wider"
                >
                  <span class="material-symbols-outlined text-[16px]">verified</span>
                  Ambiente Homologado CFP
                </span>
              }
            </div>
            <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Perfil do Psicólogo &amp; Habilitação Profissional
            </h1>
            <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Parâmetros cadastrais, credenciamento junto ao Conselho Federal de Psicologia (CFP) e
              chaves criptográficas para atendimento telepsicológico e emissão de documentos
              eletrônicos válidos.
            </p>
          </div>
        </div>
      </div>

      <!-- Layout Principal em Grid -->
      <div class="grid grid-cols-1 gap-space-lg items-start">
        <div class="space-y-space-lg w-full">
          <app-civil-identification-card
            [formGroup]="profileForm"
            [avatarUrl]="store.profile().avatarUrl"
            [cpfValidatedLabel]="store.profile().cpfValidatedLabel"
            (avatarFileSelected)="onUploadAvatar($event)"
          />

          <app-epsi-credential-card
            [formGroup]="profileForm"
            [approaches]="store.clinicalApproaches()"
            [crpJurisdiction]="store.profile().crpJurisdiction"
            [crpActiveStatus]="store.profile().crpActiveStatus"
          />

          <app-telepsychology-rooms-card [config]="store.profile().telepsychologyConfig" />
        </div>
      </div>
    </div>
  `,
})
export class ProfilePageComponent implements OnInit {
  public readonly store = inject(ClinicalStoreService);
  public readonly layout = inject(LayoutService);

  private lastSaveTriggerCount = this.layout.profileSaveTrigger();

  public readonly profileForm = new FormGroup<ProfileFormControls>({
    fullName: new FormControl<string>(this.store.profile().fullName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    cpf: new FormControl<string>(this.store.profile().cpf, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phone: new FormControl<string>(this.store.profile().phone, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    crpRegistration: new FormControl<string>(this.store.profile().crpRegistration, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    clinicalApproach: new FormControl<ClinicalApproachKey>(this.store.profile().clinicalApproach, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const current = this.store.profile();
      this.profileForm.patchValue(
        {
          fullName: current.fullName,
          cpf: current.cpf,
          phone: current.phone,
          crpRegistration: current.crpRegistration,
          clinicalApproach: current.clinicalApproach,
        },
        { emitEvent: false }
      );
    });

    effect(() => {
      const saveCount = this.layout.profileSaveTrigger();
      if (saveCount !== this.lastSaveTriggerCount) {
        this.lastSaveTriggerCount = saveCount;
        this.handleSaveProfile();
      }
    });
  }

  public ngOnInit(): void {
    this.store.loadProfileFromBackend();
  }

  public handleSaveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.layout.showToast(
        'Verifique os Campos Obrigatórios',
        'Preencha todos os dados cadastrais obrigatórios antes de salvar.',
        'error'
      );
      return;
    }

    this.layout.setProfileSaving(true);
    const values = this.profileForm.getRawValue();

    this.store
      .saveProfileToBackend({
        fullName: values.fullName,
        phone: values.phone,
        crpRegistration: values.crpRegistration,
        clinicalApproach: values.clinicalApproach,
      })
      .subscribe({
        next: () => {
          this.layout.setProfileSaving(false);
          this.layout.showToast(
            'Perfil Atualizado com Sucesso',
            'Registro profissional e parâmetros éticos salvos no banco de dados com trilha de auditoria.'
          );
        },
        error: (err: unknown) => {
          this.layout.setProfileSaving(false);
          this.layout.showToast(
            'Erro ao Salvar Perfil',
            AuthService.extractErrorMessage(err, 'Falha na comunicação com o servidor.'),
            'error'
          );
        },
      });
  }

  public onUploadAvatar(file: File): void {
    this.layout.showToast('Enviando Imagem', 'Fazendo upload da nova foto de perfil...', 'sync');
    this.store.uploadPsychologistAvatar(file).subscribe({
      next: (res) => {
        this.layout.showToast(
          'Foto Atualizada',
          res.mensagem || 'Nova foto de perfil salva com sucesso no sistema.',
          'check_circle'
        );
      },
      error: (err: unknown) => {
        this.layout.showToast(
          'Erro no Upload',
          AuthService.extractErrorMessage(err, 'Falha ao enviar arquivo de imagem.'),
          'error'
        );
      },
    });
  }
}
