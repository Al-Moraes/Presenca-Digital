
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthFacade } from '../facades/auth.facade';

export const authGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  console.log('VERIFICAÇÃO DE AUTENTICAÇÃO');
  console.log('Usuário:', authFacade.usuarioAtual());
  console.log('Token:', authFacade.obterToken());
  console.log('Logado:', authFacade.usuarioLogado());

  if (authFacade.usuarioLogado()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
