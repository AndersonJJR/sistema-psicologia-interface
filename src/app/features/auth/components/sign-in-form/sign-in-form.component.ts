import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
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
        <div class="flex items-center gap-2 mb-2"></div>
        <h2 class="text-2xl font-bold tracking-tight text-[#0b1c30]">Acessar Plataforma</h2>
        <p class="text-xs text-[#3e4947] mt-1 mb-5">
          Bem-vindo(a) ao sistema integrado de atendimento e prontuários PsicoSafe.
        </p>

        <!-- Social / SSO Login -->
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
            (click)="ssoRequested.emit('Microsoft')"
            class="flex items-center justify-center gap-2 py-2 px-3 border border-[#cbd5e1] rounded-lg text-xs font-medium text-[#0b1c30] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#f35325" d="M1 1h10v10H1z"></path>
              <path fill="#81bc06" d="M13 1h10v10H13z"></path>
              <path fill="#05a6f0" d="M1 13h10v10H1z"></path>
              <path fill="#ffba08" d="M13 13h10v10H13z"></path>
            </svg>
            Microsoft
          </button>
        </div>

        <div class="relative flex py-1 items-center mb-4">
          <div class="flex-grow border-t border-slate-200"></div>
          <span class="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-400">
            ou com e-mail&nbsp;
          </span>
          <div class="flex-grow border-t border-slate-200"></div>
        </div>

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
                placeholder="dra.juliana@psicosafe.com.br"
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
              <button
                type="button"
                (click)="forgotPasswordRequested.emit()"
                class="text-[11px] text-[#005c55] hover:text-[#00504a] font-medium hover:underline cursor-pointer"
              >
                Esqueceu sua senha?
              </button>
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
            <span class="text-[11px]">Lembrar senha</span>
          </label>
        </div>
      </div>

      <div class="mt-4">
        <button
          type="submit"
          class="w-full h-11 bg-[#005c55] hover:bg-[#00504a] text-white text-xs font-semibold tracking-wider rounded-lg shadow-sm transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>ENTRAR NO SISTEMA</span>
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
  public readonly submittedLogin = output<LoginCredentials>();
  public readonly switchToSignUp = output<void>();
  public readonly ssoRequested = output<string>();
  public readonly forgotPasswordRequested = output<void>();

  public readonly showPassword = signal<boolean>(false);

  public readonly form = new FormGroup<SignInFormControls>({
    email: new FormControl<string>('dra.juliana@psicosafe.com.br', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('••••••••••••••', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    rememberMe: new FormControl<boolean>(true, { nonNullable: true }),
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
