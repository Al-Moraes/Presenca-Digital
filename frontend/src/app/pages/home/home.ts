import {
  Component,
  inject,
  computed,
  OnInit,
  OnDestroy
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { JustificativaService } from '../../services/justificativa';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {

  private authService = inject(AuthService);

  // Conexão com as solicitações
  private solicitacoesService = inject(JustificativaService);

  justificativas: any[] = [];

  private inscricao?: Subscription;

  // Nome do usuário logado
  nomeUsuario = computed(() => {
    const email = this.authService.usuarioAtual()?.email;

    if (!email) {
      return 'Usuário';
    }

    const nome = email.split('@')[0];

    return nome
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, letra => letra.toUpperCase());
  });

  // Carregar justificativas
  ngOnInit(): void {
    this.inscricao = this.solicitacoesService
      .getJustificativas()
      .subscribe({
        next: (dados) => {
          this.justificativas = dados;
        },
        error: (erro) => {
          console.error('Erro ao carregar justificativas:', erro);
        }
      });
  }

  ngOnDestroy(): void {
    this.inscricao?.unsubscribe();
  }

  // Padronizar os status
  obterStatus(status: string | undefined): string {
    switch (status?.trim().toLowerCase()) {
      case 'aprovada':
      case 'aprovado':
        return 'Aprovado';

      case 'indeferida':
      case 'indeferido':
      case 'reprovada':
      case 'reprovado':
        return 'Reprovado';

      case 'em revisão':
      case 'em revisao':
      case 'pendente':
      case 'em análise':
      case 'em analise':
        return 'Em análise';

      default:
        return status || 'Em análise';
    }
  }

  // Contar pendentes
  get pendentes(): number {
    return this.justificativas.filter(
      j => this.obterStatus(j.status) === 'Em análise'
    ).length;
  }

  // Contar aprovados
  get aprovados(): number {
    return this.justificativas.filter(
      j => this.obterStatus(j.status) === 'Aprovado'
    ).length;
  }

  // Contar reprovados
  get reprovados(): number {
    return this.justificativas.filter(
      j => this.obterStatus(j.status) === 'Reprovado'
    ).length;
  }

  // Mostrar as três últimas justificativas
  get ultimasJustificativas(): any[] {
    return [...this.justificativas]
      .sort((a, b) =>
        new Date(b.dataFalta).getTime() -
        new Date(a.dataFalta).getTime()
      )
      .slice(0, 3);
  }
}