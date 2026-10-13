import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { JustificativaService } from '../../services/justificativa';

@Component({
  selector: 'app-solicitacoes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrl: './solicitacoes.css',
  templateUrl: './solicitacoes.html',
})
export class Solicitacoes implements OnInit, OnDestroy {

  justificativas: any[] = [];

  private inscricao?: Subscription;

  constructor(
    private justificativaService: JustificativaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarJustificativas();
  }

  ngOnDestroy(): void {
    this.inscricao?.unsubscribe();
  }

  // Carregar e acompanhar as atualizações das justificativas
  carregarJustificativas(): void {
    this.inscricao?.unsubscribe();

    this.inscricao = this.justificativaService
      .getJustificativas()
      .subscribe({
        next: (dados) => {
          this.justificativas = dados;
        },
        error: (erro) => {
          console.error(
            'Erro ao carregar justificativas:',
            erro
          );
        }
      });
  }

  // Identificar o status da justificativa
  obterStatus(status: string | undefined): string {
    switch (status?.trim().toLowerCase()) {

      case 'aprovada':
      case 'aprovado':
        return 'Aprovada';

      case 'indeferida':
      case 'indeferido':
      case 'reprovada':
      case 'reprovado':
        return 'Indeferida';

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

  // Definir a cor do status
  classeStatus(status: string | undefined): string {
    const statusAtual = this.obterStatus(status);

    if (statusAtual === 'Aprovada') {
      return 'approved';
    }

    if (statusAtual === 'Indeferida') {
      return 'rejected';
    }

    return 'pending';
  }

  // 👁️ Visualizar documento enviado
  visualizarDocumento(justificativa: any): void {

    if (!justificativa.arquivoBase64) {
      alert('Nenhum documento foi encontrado.');
      return;
    }

    const novaAba = window.open('', '_blank');

    if (!novaAba) {
      alert('Não foi possível abrir o documento.');
      return;
    }

    const arquivo = justificativa.arquivoBase64;

    if (arquivo.startsWith('data:image/')) {
      const imagem = novaAba.document.createElement('img');

      imagem.src = arquivo;
      imagem.alt = justificativa.nomeArquivo || 'Documento enviado';
      imagem.style.display = 'block';
      imagem.style.maxWidth = '100%';
      imagem.style.maxHeight = '100vh';
      imagem.style.margin = 'auto';

      novaAba.document.body.style.margin = '0';
      novaAba.document.body.style.background = '#f5f5f5';
      novaAba.document.body.appendChild(imagem);

    } else {
      const iframe = novaAba.document.createElement('iframe');

      iframe.src = arquivo;
      iframe.title = justificativa.nomeArquivo || 'Documento enviado';
      iframe.style.width = '100%';
      iframe.style.height = '100vh';
      iframe.style.border = 'none';

      novaAba.document.body.style.margin = '0';
      novaAba.document.body.appendChild(iframe);
    }
  }

  // ✏️ Editar justificativa
  editarJustificativa(justificativa: any): void {

    this.router.navigate(
      ['/justificativa'],
      {
        state: {
          justificativaEditar: justificativa
        }
      }
    );
  }
}