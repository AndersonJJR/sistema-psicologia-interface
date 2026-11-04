import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClinicalApproachOption } from '../../../../core/models';
import { ProfileFormControls } from '../../containers/profile-page.component';

@Component({
  selector: 'app-epsi-credential-card',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [formGroup]="formGroup()"
      class="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm space-y-space-lg relative overflow-hidden"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-space-sm">
          <div
            class="h-10 w-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary"
          >
            <span class="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div>
            <h2 class="font-headline-sm text-headline-sm text-on-surface">
              Credenciamento e-Psi &amp; Conselho de Classe
            </h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              Conformidade obrigatória para atendimento psicológico online
            </p>
          </div>
        </div>
        <span
          class="hidden sm:inline-flex font-label-sm text-label-sm uppercase tracking-wider text-secondary bg-secondary-container/40 px-2.5 py-1 rounded-full font-bold"
        >
          {{ auditBadge() }}
        </span>
      </div>

      <!-- Banner de Destaque e-Psi Válido -->
      <div
        class="rounded-xl bg-gradient-to-r from-secondary-container/40 via-surface-container-low to-surface-container-low p-space-md shadow-sm"
      >
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div class="flex items-start gap-space-md">
            <div
              class="h-10 w-10 shrink-0 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm"
            >
              <span class="material-symbols-outlined text-[22px]">check_circle</span>
            </div>
            <div class="space-y-0.5">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-label-lg text-label-lg font-bold text-on-surface">
                  {{ ePsiCode() }}
                </span>
                <span
                  class="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 font-label-sm text-label-sm font-semibold text-on-secondary shadow-sm"
                >
                  <span class="material-symbols-outlined text-[13px]">health_and_safety</span>
                  {{ ePsiStatusLabel() }}
                </span>
              </div>
              <p class="font-body-sm text-body-sm text-on-surface-variant">
                {{ ePsiDescription() }}
              </p>
            </div>
          </div>
          <a
            class="inline-flex items-center gap-1.5 shrink-0 font-label-md text-label-md text-primary font-semibold hover:underline bg-surface-container-lowest px-space-md py-2 rounded-lg shadow-sm"
            href="https://e-psi.cfp.org.br"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span class="material-symbols-outlined text-[16px]">open_in_new</span>
            Verificar autenticidade no CFP
          </a>
        </div>
      </div>

      <!-- Grid de Registros Técnicos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
        <!-- CRP com Badge de Status -->
        <div class="space-y-1.5 w-full">
          <label
            for="prof-crp"
            class="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between"
          >
            <span>Registro CRP (Conselho Regional)</span>
            <span
              class="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-bold"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              {{ crpActiveStatus() }}
            </span>
          </label>
          <div class="relative flex items-center">
            <span
              class="absolute left-3.5 material-symbols-outlined text-outline text-[20px] pointer-events-none"
            >
              card_membership
            </span>
            <input
              id="prof-crp"
              type="text"
              formControlName="crpRegistration"
              [class.ring-2]="isInvalid('crpRegistration')"
              [class.ring-error]="isInvalid('crpRegistration')"
              class="w-full h-11 pl-11 pr-4 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            />
          </div>
          @if (isInvalid('crpRegistration')) {
            <p class="text-label-sm font-label-sm text-error" role="alert">
              O registro CRP é obrigatório.
            </p>
          } @else {
            <p class="font-label-sm text-label-sm text-on-surface-variant">
              {{ crpJurisdiction() }}
            </p>
          }
        </div>

        <!-- Especialidade / Abordagem -->
        <div class="space-y-1.5 w-full">
          <label
            for="prof-approach"
            class="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between"
          >
            <span>Abordagem Clínica Primária</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant">Matriz Teórica</span>
          </label>
          <div class="relative flex items-center">
            <span
              class="absolute left-3.5 material-symbols-outlined text-outline text-[20px] pointer-events-none"
            >
              psychology
            </span>
            <select
              id="prof-approach"
              formControlName="clinicalApproach"
              class="w-full h-11 pl-11 pr-10 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              @for (item of approaches(); track item.value) {
                <option [value]="item.value">{{ item.label }}</option>
              }
            </select>
            <span
              class="absolute right-3.5 material-symbols-outlined text-outline text-[20px] pointer-events-none"
            >
              expand_more
            </span>
          </div>
          <p class="font-label-sm text-label-sm text-on-surface-variant">
            Utilizado para categorização nos prontuários e laudos
          </p>
        </div>
      </div>
    </div>
  `,
})
export class EpsiCredentialCardComponent {
  public readonly formGroup = input.required<FormGroup<ProfileFormControls>>();
  public readonly approaches = input.required<readonly ClinicalApproachOption[]>();
  public readonly ePsiCode = input.required<string>();
  public readonly ePsiStatusLabel = input.required<string>();
  public readonly ePsiDescription = input.required<string>();
  public readonly auditBadge = input.required<string>();
  public readonly crpJurisdiction = input.required<string>();
  public readonly crpActiveStatus = input.required<string>();

  public isInvalid(field: keyof ProfileFormControls): boolean {
    const control = this.formGroup().controls[field];
    return control.invalid && (control.dirty || control.touched);
  }
}
