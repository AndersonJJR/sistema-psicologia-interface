import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PatientRegistrationFormControls } from '../../containers/patient-registration-page.component';

@Component({
  selector: 'app-safety-protocol-section',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [formGroup]="formGroup()"
      class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col gap-space-md relative overflow-hidden"
    >
      <div
        class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-error via-tertiary to-primary"
      ></div>
      <div class="flex items-start justify-between gap-space-sm pt-space-xs">
        <div class="flex items-center gap-space-sm">
          <div
            class="w-8 h-8 rounded-lg bg-error-container text-error flex items-center justify-center font-label-lg text-label-lg shrink-0"
          >
            <span class="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-space-xs">
              <h2 class="font-headline-sm text-headline-sm text-on-surface">
                Seção 2.2: Protocolo de Segurança
              </h2>
              <span
                class="bg-error text-on-error font-label-sm text-label-sm px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold"
              >
                Mandatório CFP
              </span>
            </div>
            <span class="font-body-sm text-body-sm text-on-surface-variant">
              Exigência para Telessaúde e Manejo Imediato de Crise (Res. CFP 11/2018)
            </span>
          </div>
        </div>
        <span class="material-symbols-outlined text-outline-variant text-[24px]">
          crisis_alert
        </span>
      </div>

      <div class="p-space-md rounded-xl bg-error-container/40 flex items-start gap-space-sm">
        <span class="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">
          e911_emergency
        </span>
        <p class="font-body-sm text-body-sm text-on-surface">
          Este bloco fornece contingência direta para salvaguarda de vida. Em casos de risco
          iminente de autoextermínio, crise dissociativa aguda ou emergência médica durante o
          atendimento remoto, este protocolo legitima o acionamento de autoridades locais e rede de
          suporte.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface" for="contatoEmergencia">
            Nome do Contato de Emergência *
          </label>
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-3 text-outline text-[20px]">
              contact_emergency
            </span>
            <input
              id="contatoEmergencia"
              type="text"
              formControlName="emergencyContactName"
              [class.ring-2]="isInvalid('emergencyContactName')"
              [class.ring-error]="isInvalid('emergencyContactName')"
              class="w-full h-11 pl-10 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-error shadow-inner"
            />
          </div>
          @if (isInvalid('emergencyContactName')) {
            <span class="text-label-sm font-label-sm text-error" role="alert">
              O contato de emergência é mandatório para telepsicologia (Res. CFP 11/2018).
            </span>
          }
        </div>

        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface" for="telefoneEmergencia">
            Telefone de Emergência com DDD *
          </label>
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-3 text-outline text-[20px]">
              phone_in_talk
            </span>
            <input
              id="telefoneEmergencia"
              type="text"
              formControlName="emergencyContactPhone"
              [class.ring-2]="isInvalid('emergencyContactPhone')"
              [class.ring-error]="isInvalid('emergencyContactPhone')"
              class="w-full h-11 pl-10 pr-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-error shadow-inner"
            />
          </div>
          @if (isInvalid('emergencyContactPhone')) {
            <span class="text-label-sm font-label-sm text-error" role="alert">
              Informe o telefone de emergência com DDD.
            </span>
          }
        </div>

        <div class="md:col-span-2 flex flex-col gap-space-xs">
          <div class="flex items-center justify-between">
            <label class="font-label-md text-label-md text-on-surface" for="enderecoHabitual">
              Endereço Físico Habitual da Sessão *
            </label>
            <span class="font-label-sm text-label-sm text-error font-medium">
              SAMU 192 / PMMG/PMESP 190
            </span>
          </div>
          <textarea
            id="enderecoHabitual"
            rows="3"
            formControlName="habitualSessionAddress"
            [class.ring-2]="isInvalid('habitualSessionAddress')"
            [class.ring-error]="isInvalid('habitualSessionAddress')"
            class="w-full p-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-error shadow-inner resize-none"
          ></textarea>
          @if (isInvalid('habitualSessionAddress')) {
            <span class="text-label-sm font-label-sm text-error" role="alert">
              O endereço físico habitual da sessão é obrigatório para suporte SAMU.
            </span>
          }
        </div>
      </div>

      <div
        class="mt-space-sm p-space-md rounded-xl bg-surface-container flex flex-col md:flex-row items-center justify-between gap-space-md"
      >
        <div class="flex items-center gap-space-sm">
          <span
            class="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm"
          >
            <span class="material-symbols-outlined text-[22px]">medical_services</span>
          </span>
          <div class="flex flex-col">
            <span class="font-label-lg text-label-lg text-on-surface">
              {{ facilityName() }}
            </span>
            <span class="font-body-sm text-body-sm text-on-surface-variant">
              {{ facilityDistance() }}
            </span>
          </div>
        </div>
        <span
          class="inline-flex items-center gap-1 bg-surface-container-lowest px-space-md py-1.5 rounded-lg text-primary font-label-md text-label-md shadow-sm"
        >
          <span class="material-symbols-outlined text-[18px]">verified</span>
          Rota Mapeada
        </span>
      </div>
    </div>
  `,
})
export class SafetyProtocolSectionComponent {
  public readonly formGroup = input.required<FormGroup<PatientRegistrationFormControls>>();
  public readonly facilityName = input.required<string>();
  public readonly facilityDistance = input.required<string>();

  public isInvalid(field: keyof PatientRegistrationFormControls): boolean {
    const control = this.formGroup().controls[field];
    return control.invalid && (control.dirty || control.touched);
  }
}
