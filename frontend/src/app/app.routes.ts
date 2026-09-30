import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/login/login').then((m) => m.Login),
    },
    {
        path: 'home',
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
        path: '**',
        redirectTo: '',
    },
];
