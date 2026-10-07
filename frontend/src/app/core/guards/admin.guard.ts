import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { CanActivateFn } from "@angular/router";
import { AuthFacade } from "../facades/auth.facade";

export const adminGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authFacade = inject(AuthFacade);

    if(!authFacade.usuarioLogado()) {
        return router.createUrlTree(['/login']);
    }

    if(!authFacade.admin()) {
        return router.createUrlTree(['/admin'])
    }

    return true;
};