import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  BackendErrorView,
  LoginRequestDto,
  PerfilUsuario,
  RegistroPsicologoRequestDto,
  TokenResponseDto,
} from '../models';

const SESSION_STORAGE_KEY = 'psicosafe_jwt_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/api/v1/auth';

  private readonly sessionState = signal<TokenResponseDto | null>(this.loadStoredSession());

  public readonly session = this.sessionState.asReadonly();
  public readonly isAuthenticated = computed<boolean>(() => Boolean(this.sessionState()?.token));
  public readonly currentRole = computed<PerfilUsuario | null>(
    () => this.sessionState()?.perfil ?? null
  );
  public readonly currentPsychologistId = computed<string | null>(
    () => this.sessionState()?.idPsicologoVinculado ?? null
  );

  public login(dto: LoginRequestDto, rememberMe = true): Observable<TokenResponseDto> {
    return this.http
      .post<TokenResponseDto>(`${this.apiBaseUrl}/login`, dto)
      .pipe(tap((session) => this.persistSession(session, rememberMe)));
  }

  public registerPsychologist(dto: RegistroPsicologoRequestDto): Observable<TokenResponseDto> {
    return this.http
      .post<TokenResponseDto>(`${this.apiBaseUrl}/registrar-psicologo`, dto)
      .pipe(tap((session) => this.persistSession(session, true)));
  }

  public logout(): void {
    this.sessionState.set(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  public canAccessProntuarios(): boolean {
    const sess = this.sessionState();
    if (!sess || !sess.token) {
      return false;
    }
    return sess.perfil === 'PSICOLOGO' || sess.perfil === 'ADMIN';
  }

  public canAccessRegistrosDocumentais(): boolean {
    const sess = this.sessionState();
    if (!sess || !sess.token) {
      return false;
    }
    return sess.perfil === 'PSICOLOGO' && Boolean(sess.idPsicologoVinculado);
  }

  public static extractErrorMessage(err: unknown, fallbackMessage: string): string {
    if (err instanceof HttpErrorResponse) {
      const payload = err.error as BackendErrorView | null;
      if (payload?.detalhes && payload.detalhes.length > 0) {
        return payload.detalhes.join(' ');
      }
      if (payload?.erro) {
        return payload.erro;
      }
      if (typeof err.error === 'string' && err.error.trim().length > 0) {
        return err.error;
      }
    }
    return fallbackMessage;
  }

  private persistSession(session: TokenResponseDto, rememberMe: boolean): void {
    this.sessionState.set(session);
    if (typeof window !== 'undefined') {
      const serialized = JSON.stringify(session);
      if (rememberMe) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, serialized);
      } else {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
      }
    }
  }

  private loadStoredSession(): TokenResponseDto | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const raw =
      window.localStorage.getItem(SESSION_STORAGE_KEY) ??
      window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as TokenResponseDto;
    } catch {
      return null;
    }
  }
}
