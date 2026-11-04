export type AuthMode = 'signin' | 'signup';

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly rememberMe: boolean;
}

export interface RegisterCredentials {
  readonly fullName: string;
  readonly email: string;
  readonly crpRegion: string;
  readonly crpNumber: string;
  readonly password: string;
  readonly acceptTerms: boolean;
}

export interface AuthenticatedUser {
  readonly id: string;
  readonly fullName: string;
  readonly shortName: string;
  readonly email: string;
  readonly crp: string;
  readonly avatarUrl: string;
}
