export type AuthMode = 'signin' | 'signup';

export type PerfilUsuario = 'ADMIN' | 'PSICOLOGO' | 'RECEPCAO';

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly rememberMe: boolean;
}

export interface RegisterCredentials {
  readonly fullName: string;
  readonly email: string;
  readonly cpf: string;
  readonly phone: string;
  readonly crpRegion: string;
  readonly crpNumber: string;
  readonly password: string;
  readonly acceptTerms: boolean;
}

export interface LoginRequestDto {
  readonly login: string;
  readonly senha: string;
}

export interface RegistroPsicologoRequestDto {
  readonly nome: string;
  readonly email: string;
  readonly crp: string;
  readonly senha: string;
  readonly cpf?: string;
  readonly telefone?: string;
}

export interface TokenResponseDto {
  readonly token: string;
  readonly tipo: string;
  readonly login: string;
  readonly perfil: PerfilUsuario;
  readonly idPsicologoVinculado: string | null;
  readonly expiraEm: string;
}

export interface BackendErrorView {
  readonly status?: number;
  readonly erro?: string;
  readonly detalhes?: readonly string[];
  readonly caminho?: string;
  readonly timestamp?: string;
}
