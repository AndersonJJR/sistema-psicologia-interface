import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LayoutService } from '../services/layout.service';

export const clinicalRbacGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const layout = inject(LayoutService);
  const router = inject(Router);

  const session = authService.session();
  if (session && session.perfil === 'RECEPCAO') {
    layout.showToast(
      'Acesso Restrito (CFP 001/2009)',
      'O perfil RECEPCAO não possui permissão para acessar prontuários clínicos e exportação LGPD.',
      'gpp_bad'
    );
    return router.createUrlTree(['/agenda']);
  }

  return true;
};
