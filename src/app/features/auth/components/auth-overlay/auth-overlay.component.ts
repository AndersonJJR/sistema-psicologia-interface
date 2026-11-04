import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-auth-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay-container hidden md:block">
      <div class="overlay">
        <!-- OVERLAY LEFT (Inviting to Sign In) -->
        <div class="overlay-panel overlay-left">
          <div
            class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20"
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
              class="w-6 h-6 text-white"
            >
              <path d="M11 2v2"></path>
              <path d="M5 2v2"></path>
              <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path>
              <path d="M8 15a6 6 0 0 0 12 0v-3"></path>
              <circle cx="20" cy="10" r="2"></circle>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight mb-2">Bem-vindo de volta!</h2>
          <p class="text-xs text-teal-100 max-w-xs leading-relaxed mb-6 font-normal">
            Para manter-se conectado ao fluxo clínico e aos seus prontuários em andamento, faça
            login com suas credenciais seguras.
          </p>
          <button
            type="button"
            id="signInBtn"
            (click)="selectSignIn.emit()"
            class="px-8 h-10 border border-white rounded-lg text-xs font-semibold tracking-wider text-white bg-transparent hover:bg-white/10 active:bg-white/20 transition-all flex items-center gap-2 cursor-pointer"
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
              class="w-4 h-4"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            <span>FAZER LOGIN</span>
          </button>
          <div class="mt-8 flex items-center gap-2 text-[11px] text-teal-200/80">
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
              class="w-3.5 h-3.5"
            >
              <path
                d="M10.5 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v6"
              ></path>
              <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
              <path d="m14 20 2 2 4-4"></path>
            </svg>
            <span>Guarda de 5 a 20 anos conforme Res. CFP 01/2009</span>
          </div>
        </div>

        <!-- OVERLAY RIGHT (Inviting to Sign Up) -->
        <div class="overlay-panel overlay-right">
          <div
            class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20"
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
              class="w-6 h-6 text-white"
            >
              <path d="m16 11 2 2 4-4"></path>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight mb-2">Olá, Colega!</h2>
          <p class="text-xs text-teal-100 max-w-xs leading-relaxed mb-6 font-normal">
            Insira seus dados profissionais e acesse o ambiente seguro de teleatendimento, agenda e
            divisão transparente de faturamento.
          </p>
          <button
            type="button"
            id="signUpBtn"
            (click)="selectSignUp.emit()"
            class="px-8 h-10 border border-white rounded-lg text-xs font-semibold tracking-wider text-white bg-transparent hover:bg-white/10 active:bg-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>CADASTRAR-SE</span>
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
          <div class="mt-8 flex items-center gap-2 text-[11px] text-teal-200/80">
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
              class="w-3.5 h-3.5"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Ambiente Homologado pelo Conselho Federal</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthOverlayComponent {
  public readonly selectSignIn = output<void>();
  public readonly selectSignUp = output<void>();
}
