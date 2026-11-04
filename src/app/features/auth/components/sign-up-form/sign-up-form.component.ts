import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterCredentials } from '../../../../core/models';

interface SignUpFormControls {
  fullName: FormControl<string>;
  email: FormControl<string>;
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
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-[#005c55]">
            Credenciamento Clínico
          </span>
          <span class="text-[11px] text-slate-400">Passo 1 de 2</span>
        </div>
        <h2 class="text-2xl font-bold tracking-tight text-[#0b1c30]">Criar Conta</h2>
        <p class="text-xs text-[#3e4947] mt-1 mb-5">
          Habilite sua clínica digital e integração com e-Psi e prontuários criptografados.
        </p>

        <!-- Social / Institutional Signup -->
        <div class="grid grid-cols-2 gap-2.5 mb-4">
          <button
            type="button"
            (click)="ssoRequested.emit('Google')"
            class="flex items-center justify-center gap-2 py-2 px-3 border border-[#cbd5e1] rounded-lg text-xs font-medium text-[#0b1c30] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              ></path>
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              ></path>
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              ></path>
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              ></path>
            </svg>
            Google
          </button>
          <button
            type="button"
            (click)="ssoRequested.emit('Certificado A1 ICP-Brasil')"
            class="flex items-center justify-center gap-2 py-2 px-3 border border-[#cbd5e1] rounded-lg text-xs font-medium text-[#0b1c30] hover:bg-slate-50 transition-colors cursor-pointer"
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
              aria-hidden="true"
              class="w-4 h-4 text-[#005c55]"
            >
              <path
                d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
              ></path>
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
            </svg>
            Certificado A1
          </button>
        </div>

        <div class="relative flex py-1 items-center mb-4">
          <div class="flex-grow border-t border-slate-200"></div>
          <span class="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-400">
            ou preencha os dados
          </span>
          <div class="flex-grow border-t border-slate-200"></div>
        </div>

        <!-- Input Fields -->
        <div class="space-y-3">
          <div>
            <label for="signup-name" class="block text-xs font-medium text-[#0b1c30] mb-1">
              Nome Completo
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
                class="clinical-input w-full pl-9 pr-3 h-[42px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
            </div>
            @if (isFieldInvalid('fullName')) {
              <p class="mt-0.5 text-[11px] text-error font-medium" role="alert">
                Informe o nome completo profissional.
              </p>
            }
          </div>

          <div>
            <label for="signup-email" class="block text-xs font-medium text-[#0b1c30] mb-1">
              E-mail Profissional
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
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              </svg>
              <input
                id="signup-email"
                type="email"
                formControlName="email"
                placeholder="juliana.psi@clinica.com.br"
                [class.border-error]="isFieldInvalid('email')"
                class="clinical-input w-full pl-9 pr-3 h-[42px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
            </div>
            @if (isFieldInvalid('email')) {
              <p class="mt-0.5 text-[11px] text-error font-medium" role="alert">
                Informe um e-mail válido.
              </p>
            }
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label for="signup-crp-region" class="block text-xs font-medium text-[#0b1c30] mb-1">
                Região / CRP
              </label>
              <div class="relative">
                <span class="material-symbols-outlined text-[16px] absolute left-3 top-3 text-slate-400">
                  location_on
                </span>
                <input
                  id="signup-crp-region"
                  type="text"
                  formControlName="crpRegion"
                  placeholder="ex: 06 (SP)"
                  [class.border-error]="isFieldInvalid('crpRegion')"
                  class="clinical-input w-full pl-9 pr-3 h-[42px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
                />
              </div>
            </div>
            <div>
              <label for="signup-crp-number" class="block text-xs font-medium text-[#0b1c30] mb-1">
                Número de Registro CRP
              </label>
              <div class="relative">
                <span class="material-symbols-outlined text-[16px] absolute left-3 top-3 text-slate-400">
                  verified
                </span>
                <input
                  id="signup-crp-number"
                  type="text"
                  formControlName="crpNumber"
                  placeholder="ex: 142980"
                  [class.border-error]="isFieldInvalid('crpNumber')"
                  class="clinical-input w-full pl-9 pr-3 h-[42px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label for="signup-password" class="block text-xs font-medium text-[#0b1c30] mb-1">
              Criar Senha Criptografada
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
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="signup-password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="Mínimo 8 caracteres e símbolos"
                [class.border-error]="isFieldInvalid('password')"
                class="clinical-input w-full pl-9 pr-9 h-[42px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                aria-label="Alternar visibilidade da senha"
                class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
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

        <div class="flex items-start gap-2 mt-3 text-[11px] text-[#3e4947]">
          <input
            type="checkbox"
            id="terms"
            formControlName="acceptTerms"
            class="mt-0.5 rounded border-slate-300 text-[#005c55] focus:ring-[#005c55]"
          />
          <label for="terms" class="leading-tight">
            Concordo com os
            <span class="text-[#005c55] underline font-medium cursor-pointer">
              Termos Éticos CFP
            </span>
            e a
            <span class="text-[#005c55] underline font-medium cursor-pointer">
              Política de Proteção LGPD
            </span>
            .
          </label>
        </div>
        @if (isFieldInvalid('acceptTerms')) {
          <p class="mt-1 text-[11px] text-error font-medium" role="alert">
            É obrigatório aceitar os Termos Éticos CFP e LGPD.
          </p>
        }
      </div>

      <div class="mt-4">
        <button
          type="submit"
          class="w-full h-11 bg-[#005c55] hover:bg-[#00504a] text-white text-xs font-semibold tracking-wider rounded-lg shadow-sm transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>CADASTRAR E VALIDAR E-PSI</span>
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
        <p class="text-center text-[11px] text-slate-500 mt-2.5 leading-tight">
          Ao se cadastrar, você declara estar em situação regular junto ao Conselho Regional de
          Psicologia.
        </p>
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
  public readonly submittedRegister = output<RegisterCredentials>();
  public readonly switchToSignIn = output<void>();
  public readonly ssoRequested = output<string>();

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
    crpRegion: new FormControl<string>('', {
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
