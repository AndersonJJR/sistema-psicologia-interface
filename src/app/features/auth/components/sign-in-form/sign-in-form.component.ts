import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginCredentials } from '../../../../core/models';

interface SignInFormControls {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
}

@Component({
  selector: 'app-sign-in-form',
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
        <h2 class="text-2xl font-bold tracking-tight text-[#0b1c30]">Acessar Plataforma</h2>
        <p class="text-xs text-[#3e4947] mt-1 mb-5">
          Bem-vindo(a) ao sistema integrado de atendimento e prontuários PsicoSafe.
        </p>

        <!-- Input Fields -->
        <div class="space-y-3.5">
          <div>
            <label for="signin-email" class="block text-xs font-medium text-[#0b1c30] mb-1">
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
                id="signin-email"
                type="email"
                formControlName="email"
                placeholder="seu.email@dominio.com"
                [class.border-error]="isFieldInvalid('email')"
                class="clinical-input w-full pl-9 pr-3 h-[42px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
            </div>
            @if (isFieldInvalid('email')) {
              <p class="mt-1 text-[11px] text-error font-medium" role="alert">
                Informe um e-mail profissional válido.
              </p>
            }
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="signin-password" class="block text-xs font-medium text-[#0b1c30]">
                Senha de Acesso
              </label>
            </div>
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
                id="signin-password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="Digite sua senha"
                [class.border-error]="isFieldInvalid('password')"
                class="clinical-input w-full pl-9 pr-9 h-[42px] text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0b1c30] placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                aria-label="Alternar visibilidade da senha"
                class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                @if (showPassword()) {
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
                } @else {
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
                      d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
                    ></path>
                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path>
                    <path
                      d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
                    ></path>
                    <path d="m2 2 20 20"></path>
                  </svg>
                }
              </button>
            </div>
            @if (isFieldInvalid('password')) {
              <p class="mt-1 text-[11px] text-error font-medium" role="alert">
                A senha deve conter no mínimo 6 caracteres.
              </p>
            }
          </div>
        </div>

        <div class="flex items-center justify-between mt-3 text-xs text-[#3e4947]">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              formControlName="rememberMe"
              class="rounded border-slate-300 text-[#005c55] focus:ring-[#005c55]"
            />
            <span class="text-[11px]">Manter sessão autenticada neste dispositivo</span>
          </label>
        </div>
      </div>

      <div class="mt-4">
        <button
          type="submit"
          [disabled]="submitting()"
          class="w-full h-11 bg-[#005c55] hover:bg-[#00504a] text-white text-xs font-semibold tracking-wider rounded-lg shadow-sm transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <span>{{ submitting() ? 'AUTENTICANDO...' : 'ENTRAR NO SISTEMA' }}</span>
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
            <path d="m10 17 5-5-5-5"></path>
            <path d="M15 12H3"></path>
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          </svg>
        </button>
        <p class="md:hidden text-center text-xs text-slate-500 mt-3">
          Não tem uma conta?
          <button
            type="button"
            (click)="switchToSignUp.emit()"
            class="text-[#005c55] font-semibold underline cursor-pointer"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </form>
  `,
})
export class SignInFormComponent {
  public readonly submitting = input<boolean>(false);
  public readonly submittedLogin = output<LoginCredentials>();
  public readonly switchToSignUp = output<void>();

  public readonly showPassword = signal<boolean>(false);

  public readonly form = new FormGroup<SignInFormControls>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    rememberMe: new FormControl<boolean>(false, { nonNullable: true }),
  });

  public togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  public isFieldInvalid(field: keyof SignInFormControls): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submittedLogin.emit(this.form.getRawValue());
  }
}
