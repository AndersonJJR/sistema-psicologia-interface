import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ClinicalStoreService } from '../../../core/services/clinical-store.service';
import { LayoutService } from '../../../core/services/layout.service';
import { PatientSettingsSummaryComponent } from '../components/patient-settings-summary/patient-settings-summary.component';
import { PersonalDataSectionComponent } from '../components/personal-data-section/personal-data-section.component';
import { SafetyProtocolSectionComponent } from '../components/safety-protocol-section/safety-protocol-section.component';

export interface PatientRegistrationFormControls {
  fullName: FormControl<string>;
  cpf: FormControl<string>;
  birthDate: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
  emergencyContactName: FormControl<string>;
  emergencyContactPhone: FormControl<string>;
  habitualSessionAddress: FormControl<string>;
}

@Component({
  selector: 'app-patient-registration-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PersonalDataSectionComponent,
    SafetyProtocolSectionComponent,
    PatientSettingsSummaryComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col w-full gap-space-lg">
      <!-- Top Action Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm"
      >
        <div class="flex items-center gap-space-md min-w-0">
          <div
            class="relative w-16 h-16 rounded-full overflow-hidden bg-surface-container-high shrink-0 shadow-inner group cursor-pointer ring-2 ring-primary/20 hover:ring-primary transition-all"
            (click)="patientFileInput.click()"
            title="Clique para alterar a foto do paciente"
          >
            <img
              class="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              alt="Foto do Paciente"
              [src]="store.patientRecord().avatarUrl"
            />
            <div
              class="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span class="material-symbols-outlined text-white text-[18px]">photo_camera</span>
            </div>
            <span
              class="absolute bottom-0 right-0 w-4 h-4 bg-secondary rounded-full ring-2 ring-surface-container-lowest"
            ></span>
            <input
              #patientFileInput
              type="file"
              accept="image/*"
              class="hidden"
              (change)="onPatientFileSelected($event)"
            />
          </div>
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-space-xs flex-wrap">
              <span
                class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold"
              >
                Prontuário Digital&nbsp;{{ store.patientRecord().prontuarioCode }}
              </span>
              @if (store.patientsList().length > 0) {
                <select
                  aria-label="Selecionar paciente cadastrado"
                  [value]="store.isCreatingNewPatient() ? '' : store.patientRecord().id"
                  (change)="onSelectPatient($event)"
                  class="ml-2 h-7 px-2 rounded-md bg-surface-container-low text-on-surface text-label-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  @if (store.isCreatingNewPatient()) {
                    <option value="">-- Novo Cadastro --</option>
                  }
                  @for (p of store.patientsList(); track p.idPaciente) {
                    <option [value]="p.idPaciente">{{ p.nome }} ({{ p.cpf }})</option>
                  }
                </select>
              }
            </div>
            <h1 class="font-headline-lg text-headline-lg text-on-surface truncate">
              Cadastro e Prontuário de Paciente
            </h1>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              Conformidade obrigatória com Conselho Federal de Psicologia (CFP) e LGPD
            </p>
          </div>
        </div>
        <div class="flex items-center gap-space-sm shrink-0 flex-wrap">
          <button
            type="button"
            (click)="onNewPatient()"
            class="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors shadow-sm font-label-lg text-label-lg cursor-pointer"
          >
            <span class="material-symbols-outlined text-[20px]">person_add</span>
            Novo Paciente
          </button>
          <button
            type="button"
            (click)="onPrintRecord()"
            class="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-low text-primary hover:bg-surface-container transition-colors shadow-sm font-label-lg text-label-lg cursor-pointer"
          >
            <span class="material-symbols-outlined text-[20px]">print</span>
            Imprimir Ficha Cadastral
          </button>
          <button
            type="button"
            id="saveBtn"
            (click)="onSavePatient()"
            class="inline-flex items-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all shadow-md font-label-lg text-label-lg cursor-pointer"
          >
            <span class="material-symbols-outlined text-[20px]">verified</span>
            Salvar Cadastro
          </button>
        </div>
      </div>

      <!-- Sections Stack -->
      <div class="flex flex-col gap-space-lg w-full">
        <div class="flex flex-col gap-space-lg">
          <app-personal-data-section [formGroup]="patientForm" />

          <app-safety-protocol-section
            [formGroup]="patientForm"
            [facilityName]="store.patientRecord().emergencyProtocol.georeferencedFacilityName"
            [facilityDistance]="
              store.patientRecord().emergencyProtocol.georeferencedFacilityDistance
            "
          />
        </div>

        <app-patient-settings-summary
          [activeInPsychotherapy]="store.patientRecord().activeInPsychotherapy"
          [signedConsents]="store.patientRecord().signedConsents"
          [therapeuticPlan]="store.patientRecord().therapeuticPlan"
          (statusChanged)="onStatusChanged($event)"
        />
      </div>
    </div>
  `,
})
export class PatientRegistrationPageComponent implements OnInit {
  public readonly store = inject(ClinicalStoreService);
  private readonly layout = inject(LayoutService);

  private readonly initialRecord = this.store.patientRecord();

  public readonly patientForm = new FormGroup<PatientRegistrationFormControls>({
    fullName: new FormControl<string>(this.initialRecord.fullName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    cpf: new FormControl<string>(this.initialRecord.cpf, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(11)],
    }),
    birthDate: new FormControl<string>(this.initialRecord.birthDate, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phone: new FormControl<string>(this.initialRecord.phone, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    email: new FormControl<string>(this.initialRecord.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    emergencyContactName: new FormControl<string>(
      this.initialRecord.emergencyProtocol.emergencyContactName,
      {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }
    ),
    emergencyContactPhone: new FormControl<string>(
      this.initialRecord.emergencyProtocol.emergencyContactPhone,
      {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(10)],
      }
    ),
    habitualSessionAddress: new FormControl<string>(
      this.initialRecord.emergencyProtocol.habitualSessionAddress,
      {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(10)],
      }
    ),
  });

  constructor() {
    effect(() => {
      const record = this.store.patientRecord();
      this.patientForm.patchValue(
        {
          fullName: record.fullName,
          cpf: record.cpf,
          birthDate: record.birthDate,
          phone: record.phone,
          email: record.email,
          emergencyContactName: record.emergencyProtocol.emergencyContactName,
          emergencyContactPhone: record.emergencyProtocol.emergencyContactPhone,
          habitualSessionAddress: record.emergencyProtocol.habitualSessionAddress,
        },
        { emitEvent: false }
      );
    });
  }

  public ngOnInit(): void {
    this.store.loadPatientsFromBackend();
  }

  public onSelectPatient(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.store.selectPatientById(select.value);
    }
  }

  public onNewPatient(): void {
    this.store.startNewPatientRegistration();
    this.patientForm.markAsPristine();
    this.patientForm.markAsUntouched();
  }

  public onStatusChanged(active: boolean): void {
    this.store.togglePatientStatusOnBackend(active).subscribe({
      next: () => {
        this.layout.showToast(
          active ? 'Paciente Reativado' : 'Status Atualizado',
          active
            ? 'Prontuário reativado para acompanhamento psicoterapêutico.'
            : 'Paciente marcado como inativo/alta temporária (retenção legal preservada).'
        );
      },
      error: (err: unknown) => {
        this.layout.showToast(
          'Erro ao Alterar Status',
          AuthService.extractErrorMessage(err, 'Não foi possível atualizar o status do paciente.'),
          'error'
        );
      },
    });
  }

  public onPrintRecord(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  public onPatientFileSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.files && inputEl.files[0]) {
      const file = inputEl.files[0];
      const patientId = this.store.patientRecord().id;
      if (!patientId || this.store.isCreatingNewPatient()) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.store.setPatientAvatarPreview(e.target?.result as string, file);
          this.layout.showToast('Foto Carregada', 'Pré-visualização da foto definida para o novo paciente.');
        };
        reader.readAsDataURL(file);
      } else {
        this.layout.showToast('Enviando Imagem', 'Fazendo upload da foto do paciente...', 'sync');
        this.store.uploadPatientAvatar(patientId, file).subscribe({
          next: (res) => {
            this.layout.showToast(
              'Foto Atualizada',
              res.mensagem || 'Foto do paciente salva com sucesso.',
              'check_circle'
            );
          },
          error: (err: unknown) => {
            this.layout.showToast(
              'Erro no Upload',
              AuthService.extractErrorMessage(err, 'Falha ao enviar arquivo de imagem do paciente.'),
              'error'
            );
          },
        });
      }
      inputEl.value = '';
    }
  }

  public onSavePatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      this.layout.showToast(
        'Campos Obrigatórios Pendentes',
        'Verifique os dados civis e o Protocolo de Segurança CFP antes de salvar.',
        'warning'
      );
      return;
    }

    const raw = this.patientForm.getRawValue();
    this.store.savePatientToBackend(raw).subscribe({
      next: () => {
        this.layout.showToast(
          'Prontuário Atualizado com Sucesso',
          'Dados criptografados e salvos no banco de dados com trilha de auditoria CFP ativa.'
        );
      },
      error: (err: unknown) => {
        this.layout.showToast(
          'Erro ao Salvar Paciente',
          AuthService.extractErrorMessage(err, 'Falha ao salvar o cadastro do paciente.'),
          'error'
        );
      },
    });
  }
}
