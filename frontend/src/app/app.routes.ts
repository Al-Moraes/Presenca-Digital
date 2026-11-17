
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'justificativa',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/justificativa/justificativa').then((m) => m.Justificativa),
  },
  {
    path: 'solicitacoes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/solicitacoes/solicitacoes').then((m) => m.Solicitacoes),
  },
  {
    path: 'relatorio',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/relatorio/relatorio').then((m) => m.Relatorio),
  },
  {
    path: 'cadastro',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cadastro/cadastro').then((m) => m.Cadastro),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin').then((m) => m.Admin),
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/perfil/perfil').then((m) => m.Perfil),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
