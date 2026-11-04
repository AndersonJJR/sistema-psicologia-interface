import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProfileFormControls } from '../../containers/profile-page.component';

@Component({
  selector: 'app-civil-identification-card',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [formGroup]="formGroup()"
      class="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm space-y-space-lg"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm border-b-0"
      >
        <div class="flex items-center gap-space-md">
          <div class="relative">
            <img
              class="h-20 w-20 rounded-full object-cover shadow-sm"
              alt="Foto Oficial da Psicóloga"
              [src]="avatarUrl()"
            />
            <span
              class="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-sm"
              title="Profissional Autenticada"
            >
              <span class="material-symbols-outlined text-[14px]">verified</span>
            </span>
          </div>
          <div>
            <span
              class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold"
            >
              Identificação Principal
            </span>
            <h2 class="font-headline-sm text-headline-sm text-on-surface">
              Dados Pessoais &amp; Registro Civil
            </h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              Conforme registro no Cadastro Nacional de Especialistas da Saúde
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <!-- Nome Completo -->
        <div class="space-y-1.5 md:col-span-2 w-full">
          <label
            for="prof-full-name"
            class="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between"
          >
            <span>Nome Completo do Profissional</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant font-normal">
              Exigido por extenso sem abreviações
            </span>
          </label>
          <div class="relative flex items-center">
            <span
              class="absolute left-3.5 material-symbols-outlined text-outline text-[20px] pointer-events-none"
            >
              person
            </span>
            <input
              id="prof-full-name"
              type="text"
              formControlName="fullName"
              [class.ring-2]="isInvalid('fullName')"
              [class.ring-error]="isInvalid('fullName')"
              class="w-full h-11 pl-11 pr-4 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
            />
          </div>
          @if (isInvalid('fullName')) {
            <p class="text-label-sm font-label-sm text-error" role="alert">
              O nome completo por extenso é obrigatório pelo CFP.
            </p>
          }
        </div>

        <!-- CPF -->
        <div class="space-y-1.5 w-full">
          <label
            for="prof-cpf"
            class="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between"
          >
            <span>CPF (Cadastro de Pessoas Físicas)</span>
            <span class="font-label-sm text-label-sm text-secondary font-medium">
              {{ cpfValidatedLabel() }}
            </span>
          </label>
          <div class="relative flex items-center">
            <span
              class="absolute left-3.5 material-symbols-outlined text-outline text-[20px] pointer-events-none"
            >
              fingerprint
            </span>
            <input
              id="prof-cpf"
              type="text"
              formControlName="cpf"
              readonly
              class="w-full h-11 pl-11 pr-4 rounded-lg bg-surface-container font-body-md text-body-md text-on-surface cursor-not-allowed"
            />
          </div>
        </div>

        <!-- Telefone de Contato -->
        <div class="space-y-1.5 w-full">
          <label
            for="prof-phone"
            class="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between"
          >
            <span>Telefone / WhatsApp Profissional</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant font-normal">
              Canal de Emergência
            </span>
          </label>
          <div class="relative flex items-center">
            <span
              class="absolute left-3.5 material-symbols-outlined text-outline text-[20px] pointer-events-none"
            >
              phone_in_talk
            </span>
            <input
              id="prof-phone"
              type="text"
              formControlName="phone"
              [class.ring-2]="isInvalid('phone')"
              [class.ring-error]="isInvalid('phone')"
              class="w-full h-11 pl-11 pr-4 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          @if (isInvalid('phone')) {
            <p class="text-label-sm font-label-sm text-error" role="alert">
              Informe um telefone válido com DDD para canal de emergência.
            </p>
          }
        </div>
      </div>
    </div>
  `,
})
export class CivilIdentificationCardComponent {
  public readonly formGroup = input.required<FormGroup<ProfileFormControls>>();
  public readonly avatarUrl = input.required<string>();
  public readonly cpfValidatedLabel = input.required<string>();

  public isInvalid(field: keyof ProfileFormControls): boolean {
    const control = this.formGroup().controls[field];
    return control.invalid && (control.dirty || control.touched);
  }
}
