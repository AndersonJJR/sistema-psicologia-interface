import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterCredentials } from '../../../../core/models';

interface SignUpFormControls {
  fullName: FormControl<string>;
  email: FormControl<string>;
  cpf: FormControl<string>;
  phone: FormControl<string>;
  crpRegion: FormControl<string>;
  crpNumber: FormControl<string>;
  password: FormControl<string>;
  acceptTerms: FormControl<boolean>;
}

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="flex flex-col h-full justify-between max-w-sm mx-auto w-full"
      novalidate
    >
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-[#005c55]">
            Credenciamento Clínico
          </span>
          <span class="text-[11px] text-slate-400">Habilitação e-Psi</span>
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-[#0b1c30]">Criar Conta</h2>
        <p class="text-xs text-[#3e4947] mt-1 mb-4">
          Habilite sua clínica digital e integração com e-Psi e prontuários criptografados.
        </p>

        <!-- Input Fields -->
        <div class="space-y-2.5">
          <div>
            <label for="signup-name" class="block text-xs font-medium text-[#0b1c30] mb-1">
              Nome Completo *
            </label>
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                class="w-4 h-4 absolute left-3 top-3 text-slate-400"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                id="signup-name"
                type="text"
                formControlName="fullName"
                placeholder="Dra. Juliana Mendes"
                [class.border-error]="isFieldInvalid('fullName')"
                class="clinical-input w-full pl-9 pr-3 h-[38px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
            </div>
            @if (isFieldInvalid('fullName')) {
              <p class="mt-0.5 text-[11px] text-error font-medium" role="alert">
                Informe o nome completo profissional (mínimo 5 caracteres).
              </p>
            }
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for="signup-cpf" class="block text-xs font-medium text-[#0b1c30] mb-1">
                CPF *
              </label>
              <input
                id="signup-cpf"
                type="text"
                formControlName="cpf"
                placeholder="000.000.000-00"
                [class.border-error]="isFieldInvalid('cpf')"
                class="clinical-input w-full px-3 h-[38px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
            </div>
            <div>
              <label for="signup-phone" class="block text-xs font-medium text-[#0b1c30] mb-1">
                Telefone *
              </label>
              <input
                id="signup-phone"
                type="text"
                formControlName="phone"
                placeholder="(11) 98765-4321"
                [class.border-error]="isFieldInvalid('phone')"
                class="clinical-input w-full px-3 h-[38px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
            </div>
          </div>

          <div>
            <label for="signup-email" class="block text-xs font-medium text-[#0b1c30] mb-1">
              E-mail Profissional *
            </label>
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                class="w-4 h-4 absolute left-3 top-2.5 text-slate-400"
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              </svg>
              <input
                id="signup-email"
                type="email"
                formControlName="email"
                placeholder="juliana.psi@clinica.com.br"
                [class.border-error]="isFieldInvalid('email')"
                class="clinical-input w-full pl-9 pr-3 h-[38px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
            </div>
            @if (isFieldInvalid('email')) {
              <p class="mt-0.5 text-[11px] text-error font-medium" role="alert">
                Informe um e-mail válido.
              </p>
            }
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label for="signup-crp-region" class="block text-xs font-medium text-[#0b1c30] mb-1">
                Região CRP *
              </label>
              <input
                id="signup-crp-region"
                type="text"
                formControlName="crpRegion"
                placeholder="06"
                [class.border-error]="isFieldInvalid('crpRegion')"
                class="clinical-input w-full px-3 h-[38px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
            </div>
            <div>
              <label for="signup-crp-number" class="block text-xs font-medium text-[#0b1c30] mb-1">
                Nº CRP *
              </label>
              <input
                id="signup-crp-number"
                type="text"
                formControlName="crpNumber"
                placeholder="142980"
                [class.border-error]="isFieldInvalid('crpNumber')"
                class="clinical-input w-full px-3 h-[38px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
            </div>
          </div>

          <div>
            <label for="signup-password" class="block text-xs font-medium text-[#0b1c30] mb-1">
              Criar Senha Criptografada *
            </label>
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                class="w-4 h-4 absolute left-3 top-2.5 text-slate-400"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="signup-password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="Mínimo 8 caracteres"
                [class.border-error]="isFieldInvalid('password')"
                class="clinical-input w-full pl-9 pr-9 h-[38px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                aria-label="Alternar visibilidade da senha"
                class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4"
                >
                  <path
                    d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
                  ></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            @if (isFieldInvalid('password')) {
              <p class="mt-0.5 text-[11px] text-error font-medium" role="alert">
                A senha deve conter ao menos 8 caracteres.
              </p>
            }
          </div>
        </div>

        <div class="flex items-start gap-2 mt-2.5 text-[11px] text-[#3e4947]">
          <input
            type="checkbox"
            id="terms"
            formControlName="acceptTerms"
            class="mt-0.5 rounded border-slate-300 text-[#005c55] focus:ring-[#005c55]"
          />
          <label for="terms" class="leading-tight">
            Concordo com os Termos Éticos CFP (Resolução nº 001/2009) e a Política de Proteção LGPD.
          </label>
        </div>
        @if (isFieldInvalid('acceptTerms')) {
          <p class="mt-1 text-[11px] text-error font-medium" role="alert">
            É obrigatório aceitar os Termos Éticos CFP e LGPD.
          </p>
        }
      </div>

      <div class="mt-3">
        <button
          type="submit"
          [disabled]="submitting()"
          class="w-full h-11 bg-[#005c55] hover:bg-[#00504a] text-white text-xs font-semibold tracking-wider rounded-lg shadow-sm transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <span>{{ submitting() ? 'CREDENCIANDO...' : 'CADASTRAR' }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="w-4 h-4"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
        <p class="md:hidden text-center text-xs text-slate-500 mt-3">
          Já possui conta?
          <button
            type="button"
            (click)="switchToSignIn.emit()"
            class="text-[#005c55] font-semibold underline cursor-pointer"
          >
            Fazer login
          </button>
        </p>
      </div>
    </form>
  `,
})
export class SignUpFormComponent {
  public readonly submitting = input<boolean>(false);
  public readonly submittedRegister = output<RegisterCredentials>();
  public readonly switchToSignIn = output<void>();

  public readonly showPassword = signal<boolean>(false);

  public readonly form = new FormGroup<SignUpFormControls>({
    fullName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    cpf: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(11)],
    }),
    phone: new FormControl<string>('(11) 98765-4321', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    crpRegion: new FormControl<string>('06', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    crpNumber: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    acceptTerms: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });

  public togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  public isFieldInvalid(field: keyof SignUpFormControls): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submittedRegister.emit(this.form.getRawValue());
  }
}
