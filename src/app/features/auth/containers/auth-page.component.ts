import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthMode, LoginCredentials, RegisterCredentials } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { ClinicalStoreService } from '../../../core/services/clinical-store.service';
import { LayoutService } from '../../../core/services/layout.service';
import { ToastNotificationComponent } from '../../../shared/components/toast/toast-notification.component';
import { AuthOverlayComponent } from '../components/auth-overlay/auth-overlay.component';
import { SignInFormComponent } from '../components/sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from '../components/sign-up-form/sign-up-form.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    SignInFormComponent,
    SignUpFormComponent,
    AuthOverlayComponent,
    ToastNotificationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: `
    .container-auth {
      position: relative;
      overflow: hidden;
      width: 860px;
      max-width: 100%;
      min-height: 580px;
      background: #ffffff;
      border-radius: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow:
        0 10px 25px -5px rgba(15, 23, 42, 0.08),
        0 8px 10px -6px rgba(15, 23, 42, 0.04);
    }

    .form-container {
      position: absolute;
      top: 0;
      height: 100%;
      transition: all 0.65s cubic-bezier(0.65, 0, 0.35, 1);
    }

    .sign-in-container {
      left: 0;
      width: 50%;
      z-index: 2;
    }

    .sign-up-container {
      left: 0;
      width: 50%;
      opacity: 0;
      z-index: 1;
    }

    .container-auth.right-panel-active .sign-in-container {
      transform: translateX(100%);
      opacity: 0;
    }

    .container-auth.right-panel-active .sign-up-container {
      transform: translateX(100%);
      opacity: 1;
      z-index: 5;
      animation: psicosafe-auth-show 0.65s;
    }

    @keyframes psicosafe-auth-show {
      0%,
      49.99% {
        opacity: 0;
        z-index: 1;
      }
      50%,
      100% {
        opacity: 1;
        z-index: 5;
      }
    }

    .overlay-container {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 100%;
      overflow: hidden;
      transition: transform 0.65s cubic-bezier(0.65, 0, 0.35, 1);
      z-index: 100;
    }

    .container-auth.right-panel-active .overlay-container {
      transform: translateX(-100%);
    }

    .overlay {
      background: linear-gradient(135deg, #005c55 0%, #0f766e 50%, #004d47 100%);
      color: #ffffff;
      position: relative;
      left: -100%;
      height: 100%;
      width: 200%;
      transform: translateX(0);
      transition: transform 0.65s cubic-bezier(0.65, 0, 0.35, 1);
    }

    .container-auth.right-panel-active .overlay {
      transform: translateX(50%);
    }

    .overlay-panel {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 0 44px;
      text-align: center;
      top: 0;
      height: 100%;
      width: 50%;
      transform: translateX(0);
      transition: transform 0.65s cubic-bezier(0.65, 0, 0.35, 1);
    }

    .overlay-left {
      transform: translateX(-20%);
    }

    .container-auth.right-panel-active .overlay-left {
      transform: translateX(0);
    }

    .overlay-right {
      right: 0;
      transform: translateX(0);
    }

    .container-auth.right-panel-active .overlay-right {
      transform: translateX(20%);
    }

    @media (max-width: 768px) {
      .container-auth {
        min-height: auto;
        border-radius: 1.25rem;
      }
      .overlay-container {
        display: none;
      }
      .form-container {
        position: relative;
        width: 100% !important;
        transform: none !important;
        opacity: 1 !important;
        display: none;
      }
      .sign-in-container.mobile-active,
      .sign-up-container.mobile-active {
        display: block;
      }
    }
  `,
  template: `
    <div
      class="min-h-screen bg-[#f8f9ff] flex flex-col justify-between items-center p-4 md:p-8 select-none"
    >
      <!-- Header / Top Bar -->
      <header class="w-full max-w-5xl flex items-center justify-center py-2 mb-2 gap-3">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-[#005c55] flex items-center justify-center text-white shadow-sm shadow-[#005c55]/20"
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
              class="w-5 h-5"
            >
              <path
                d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
              ></path>
              <path d="M9 12h6"></path>
              <path d="M12 9v6"></path>
            </svg>
          </div>
          <div>
            <span class="text-xl font-bold tracking-tight text-[#0b1c30]">
              Psico<span class="text-[#005c55]">Safe</span>
            </span>
            <span
              class="hidden sm:inline-block ml-2 px-2 py-0.5 text-[11px] font-semibold tracking-wide bg-teal-50 text-[#005c55] border border-teal-200/60 rounded-full"
            >
              CLÍNICA &amp; TELEPSI
            </span>
          </div>
        </div>
      </header>

      <!-- Mobile Segmented Controller -->
      <div class="md:hidden flex w-full max-w-sm p-1 mb-4 bg-slate-200/80 rounded-xl">
        <button
          type="button"
          id="mobileBtnSignIn"
          (click)="setMode('signin')"
          [class]="
            mode() === 'signin'
              ? 'flex-1 py-2 text-xs font-semibold rounded-lg bg-white text-[#005c55] shadow-sm transition-all cursor-pointer'
              : 'flex-1 py-2 text-xs font-semibold rounded-lg text-[#3e4947] hover:text-[#0b1c30] transition-all cursor-pointer'
          "
        >
          Entrar
        </button>
        <button
          type="button"
          id="mobileBtnSignUp"
          (click)="setMode('signup')"
          [class]="
            mode() === 'signup'
              ? 'flex-1 py-2 text-xs font-semibold rounded-lg bg-white text-[#005c55] shadow-sm transition-all cursor-pointer'
              : 'flex-1 py-2 text-xs font-semibold rounded-lg text-[#3e4947] hover:text-[#0b1c30] transition-all cursor-pointer'
          "
        >
          Cadastrar
        </button>
      </div>

      <!-- Main Classic Sliding Container -->
      <main class="w-full flex items-center justify-center my-auto">
        <div
          id="container"
          class="container-auth relative"
          [class.right-panel-active]="mode() === 'signup'"
        >
          <!-- SIGN UP FORM CONTAINER -->
          <div
            id="signUpPanel"
            class="form-container sign-up-container h-full flex flex-col justify-center px-8 md:px-12 py-6 bg-white"
            [class.mobile-active]="mode() === 'signup'"
          >
            <app-sign-up-form
              [submitting]="isSubmitting()"
              (submittedRegister)="onRegister($event)"
              (switchToSignIn)="setMode('signin')"
            />
          </div>

          <!-- SIGN IN FORM CONTAINER -->
          <div
            id="signInPanel"
            class="form-container sign-in-container h-full flex flex-col justify-center px-8 md:px-12 py-8 bg-white"
            [class.mobile-active]="mode() === 'signin'"
          >
            <app-sign-in-form
              [submitting]="isSubmitting()"
              (submittedLogin)="onLogin($event)"
              (switchToSignUp)="setMode('signup')"
            />
          </div>

          <!-- OVERLAY CONTAINER -->
          <app-auth-overlay
            (selectSignIn)="setMode('signin')"
            (selectSignUp)="setMode('signup')"
          />
        </div>
      </main>

      <!-- Footer with Legal & Technical Assurance -->
      <footer
        class="w-full max-w-[860px] mx-auto mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 px-4 sm:px-0 text-center sm:text-left"
      >
        <div
          class="flex flex-col sm:flex-row items-center justify-center sm:justify-between w-full gap-3"
        >
          <span class="text-slate-500">© 2026 PsicoSafe Tecnologia Clínica Ltda.</span>
          <div class="flex items-center gap-3 text-slate-500">
            <span>Resolução CFP nº 001/2009</span>
            <span>•</span>
            <span>Conformidade LGPD</span>
            <span>•</span>
            <span>Criptografia AES-256-GCM</span>
          </div>
        </div>
      </footer>

      <app-toast-notification
        [toast]="layout.activeToast()"
        (dismiss)="layout.dismissToast()"
      />
    </div>
  `,
})
export class AuthPageComponent {
  public readonly layout = inject(LayoutService);
  private readonly authService = inject(AuthService);
  private readonly store = inject(ClinicalStoreService);
  private readonly router = inject(Router);

  public readonly mode = signal<AuthMode>('signin');
  public readonly isSubmitting = signal<boolean>(false);

  public setMode(nextMode: AuthMode): void {
    this.mode.set(nextMode);
  }

  public onLogin(credentials: LoginCredentials): void {
    this.isSubmitting.set(true);
    this.authService
      .login(
        {
          login: credentials.email.trim(),
          senha: credentials.password,
        },
        credentials.rememberMe
      )
      .subscribe({
        next: (session) => {
          this.isSubmitting.set(false);
          this.layout.showToast(
            'Autenticação Clínica Confirmada',
            `Sessão JWT iniciada para ${session.login} (${session.perfil}).`
          );
          void this.router.navigate(['/agenda']);
        },
        error: (err: unknown) => {
          this.isSubmitting.set(false);
          const msg = AuthService.extractErrorMessage(
            err,
            'Falha ao autenticar. Verifique suas credenciais.'
          );
          this.layout.showToast('Falha na Autenticação', msg, 'error');
        },
      });
  }

  public onRegister(payload: RegisterCredentials): void {
    this.isSubmitting.set(true);
    const crpFormatted = `${payload.crpRegion.trim()}/${payload.crpNumber.trim()}`;

    this.authService
      .registerPsychologist({
        nome: payload.fullName.trim(),
        email: payload.email.trim(),
        cpf: payload.cpf.trim(),
        telefone: payload.phone.trim(),
        crp: crpFormatted,
        numeroEpsi: payload.numeroEpsi.trim(),
        senha: payload.password,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.store.updateProfile({
            fullName: payload.fullName.trim(),
            crpRegistration: crpFormatted,
            phone: payload.phone.trim(),
          });
          this.layout.showToast(
            'Credenciamento e-Psi Validado',
            `Conta profissional de ${payload.fullName} criada com criptografia ativa.`
          );
          void this.router.navigate(['/perfil-profissional']);
        },
        error: (err: unknown) => {
          this.isSubmitting.set(false);
          const msg = AuthService.extractErrorMessage(
            err,
            'Não foi possível concluir o credenciamento profissional.'
          );
          this.layout.showToast('Erro no Cadastro', msg, 'error');
        },
      });
  }
}
