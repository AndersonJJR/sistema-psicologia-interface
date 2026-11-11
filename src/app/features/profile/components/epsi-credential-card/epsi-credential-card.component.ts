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
              Conselho de Classe &amp; Atuação Profissional
            </h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              Registro profissional regularizado e abordagem clínica principal
            </p>
          </div>
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
  public readonly crpJurisdiction = input.required<string>();
  public readonly crpActiveStatus = input.required<string>();

  public isInvalid(field: keyof ProfileFormControls): boolean {
    const control = this.formGroup().controls[field];
    return control.invalid && (control.dirty || control.touched);
  }
}
