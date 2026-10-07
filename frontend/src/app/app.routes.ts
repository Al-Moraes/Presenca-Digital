import { Routes } from '@angular/router';
import { Justificativa } from './pages/justificativa/justificativa';
import { Admin } from './pages/admin/admin';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: 'justificativa', component: Justificativa },
    { path: 'admin', component: Admin },
    {
        path: '',
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
        loadComponent: () =>
            import('./pages/justificativa/justificativa').then((m) => m.Justificativa),
    },
    {
        path: 'solicitacoes',
        loadComponent: () =>
            import('./pages/solicitacoes/solicitacoes').then((m) => m.Solicitacoes),
    },
    {
        path: 'relatorio',
        loadComponent: () =>
            import('./pages/relatorio/relatorio').then((m) => m.Relatorio),
    },
    {
        path: 'cadastro',
        loadComponent: () =>
            import('./pages/cadastro/cadastro').then((m) => m.Cadastro),
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
            import('./pages/admin/admin').then((m) => m.Admin),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
