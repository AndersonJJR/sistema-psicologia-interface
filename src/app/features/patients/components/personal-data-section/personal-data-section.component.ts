import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PatientRegistrationFormControls } from '../../containers/patient-registration-page.component';

@Component({
  selector: 'app-personal-data-section',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [formGroup]="formGroup()"
      class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col gap-space-lg"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-space-sm">
          <span
            class="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center font-label-lg text-label-lg"
          >
            1
          </span>
          <div class="flex flex-col">
            <h2 class="font-headline-sm text-headline-sm text-on-surface">
              Seção 2.1: Dados Pessoais
            </h2>
            <span class="font-body-sm text-body-sm text-on-surface-variant">
              Identificação civil autenticada e informações demográficas do titular
            </span>
          </div>
        </div>
        <span class="material-symbols-outlined text-outline-variant text-[24px]">id_card</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <!-- Nome Completo -->
        <div class="md:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface" for="nomeCompleto">
            Nome Completo do Paciente *
          </label>
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-3 text-outline text-[20px]">
              person
            </span>
            <input
              id="nomeCompleto"
              type="text"
              formControlName="fullName"
              [class.ring-2]="isInvalid('fullName')"
              [class.ring-error]="isInvalid('fullName')"
              class="w-full h-11 pl-10 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner"
            />
          </div>
          @if (isInvalid('fullName')) {
            <span class="text-label-sm font-label-sm text-error" role="alert">
              O nome completo do paciente é obrigatório.
            </span>
          }
        </div>

        <!-- CPF -->
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface" for="cpfPaciente">
            CPF (Cadastro de Pessoas Físicas) *
          </label>
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-3 text-outline text-[20px]">
              badge
            </span>
            <input
              id="cpfPaciente"
              type="text"
              formControlName="cpf"
              placeholder="000.000.000-00"
              [class.ring-2]="isInvalid('cpf')"
              [class.ring-error]="isInvalid('cpf')"
              class="w-full h-11 pl-10 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner"
            />
          </div>
          @if (isInvalid('cpf')) {
            <span class="text-label-sm font-label-sm text-error" role="alert">
              Informe um CPF válido no formato 000.000.000-00.
            </span>
          }
        </div>

        <!-- Data de Nascimento -->
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface" for="nascimentoPaciente">
            Data de Nascimento *
          </label>
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-3 text-outline text-[20px]">
              cake
            </span>
            <input
              id="nascimentoPaciente"
              type="text"
              formControlName="birthDate"
              [class.ring-2]="isInvalid('birthDate')"
              [class.ring-error]="isInvalid('birthDate')"
              class="w-full h-11 pl-10 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner"
            />
          </div>
          @if (isInvalid('birthDate')) {
            <span class="text-label-sm font-label-sm text-error" role="alert">
              A data de nascimento é obrigatória.
            </span>
          }
        </div>

        <!-- Telefone -->
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface" for="telefonePaciente">
            Telefone / WhatsApp com DDD *
          </label>
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-3 text-outline text-[20px]">
              call
            </span>
            <input
              id="telefonePaciente"
              type="text"
              formControlName="phone"
              [class.ring-2]="isInvalid('phone')"
              [class.ring-error]="isInvalid('phone')"
              class="w-full h-11 pl-10 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner"
            />
          </div>
          @if (isInvalid('phone')) {
            <span class="text-label-sm font-label-sm text-error" role="alert">
              O telefone com DDD é obrigatório.
            </span>
          }
        </div>

        <!-- E-mail -->
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface" for="emailPaciente">
            E-mail Principal *
          </label>
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-3 text-outline text-[20px]">
              alternate_email
            </span>
            <input
              id="emailPaciente"
              type="email"
              formControlName="email"
              [class.ring-2]="isInvalid('email')"
              [class.ring-error]="isInvalid('email')"
              class="w-full h-11 pl-10 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner"
            />
          </div>
          @if (isInvalid('email')) {
            <span class="text-label-sm font-label-sm text-error" role="alert">
              Informe um endereço de e-mail válido.
            </span>
          }
        </div>
      </div>
    </div>
  `,
})
export class PersonalDataSectionComponent {
  public readonly formGroup = input.required<FormGroup<PatientRegistrationFormControls>>();

  public isInvalid(field: keyof PatientRegistrationFormControls): boolean {
    const control = this.formGroup().controls[field];
    return control.invalid && (control.dirty || control.touched);
  }
}
