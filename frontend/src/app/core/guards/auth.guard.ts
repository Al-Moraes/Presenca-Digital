import { CanActivateFn } from "@angular/router";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthFacade } from "../facades/auth.facade";

export const authGuard: CanActivateFn = () => {
    const authFacade = inject(AuthFacade);
    const router = inject(Router);

    if(authFacade.usuarioLogado()) {
        return true;
    }
    return router.createUrlTree(['/login']);
} 