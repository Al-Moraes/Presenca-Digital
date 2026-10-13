import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private authService = inject(AuthService);

  nomeUsuario = computed(() => {
    const email = this.authService.usuarioAtual()?.email;

    if (!email) {
      return 'Usuário';
    }

    // Extrai o nome antes do @ do e-mail
    const nome = email.split('@')[0];

    // Formata nomes como matheus.silva para Matheus Silva
    return nome
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, letra => letra.toUpperCase());
  });
}
