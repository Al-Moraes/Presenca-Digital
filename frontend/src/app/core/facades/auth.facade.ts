import { Injectable } from "@angular/core";
import { inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";

type Login = {
    email: string;
    senha: string;
}

@Injectable({providedIn: 'root'})

export class AuthFacade {
    private authService = inject(AuthService);

    usuarioAtual = this.authService.usuarioAtual;
    usuarioLogado = this.authService.usuarioLogado;
    token = this.authService.token;
    admin = this.authService.admin;

    realizarLogin( email:string, senha:string): boolean {
        return this.authService.login(email, senha);
    }

    sair(){
        this.authService.logout();
    }

    obterToken(): string | null {
        return this.authService.obterToken();
    }

    obterPerfil(){
        this.authService.obterPerfil();
    } 
}
