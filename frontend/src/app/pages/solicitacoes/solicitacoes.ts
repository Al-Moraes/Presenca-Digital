import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { JustificativaService } from '../../services/justificativa';

type FiltroSolicitacoes =
  | 'todas'
  | 'pendentes'
  | 'aprovados'
  | 'indeferidos';

@Component({
  selector: 'app-solicitacoes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  styleUrl: './solicitacoes.css',
  templateUrl: './solicitacoes.html',
})
export class Solicitacoes implements OnInit, OnDestroy {

  justificativas: any[] = [];

  filtroAtivo: FiltroSolicitacoes = 'todas';
  termoBusca = '';

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

  // Carregar solicitações do serviço
  carregarJustificativas(): void {
    this.inscricao?.unsubscribe();

    this.inscricao = this.justificativaService
      .getJustificativas()
      .subscribe({
        next: (dados) => {
          this.justificativas = dados || [];
        },
        error: (erro) => {
          console.error('Erro ao carregar justificativas:', erro);
          this.justificativas = [];
        }
      });
  }

  // Normalizar textos para comparação
  private normalizarTexto(valor: any): string {
    return String(valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  // Identificar o status da solicitação
  obterStatus(status: string | undefined): string {
    const valor = this.normalizarTexto(status);

    if (
      [
        'aprovada',
        'aprovado',
        'aprovadas',
        'aprovados',
        'deferida',
        'deferido'
      ].includes(valor)
    ) {
      return 'Aprovada';
    }

    if (
      [
        'indeferida',
        'indeferido',
        'indeferidas',
        'indeferidos',
        'reprovada',
        'reprovado',
        'recusada',
        'recusado'
      ].includes(valor)
    ) {
      return 'Indeferida';
    }

    if (
      [
        'pendente',
        'pendentes',
        'em analise',
        'em revisao',
        'aguardando',
        'aguardando analise',
        'em processamento'
      ].includes(valor)
    ) {
      return 'Em análise';
    }

    return status || 'Em análise';
  }

  // Exibir o motivo correto da justificativa
  obterMotivo(justificativa: any): string {
    if (this.normalizarTexto(justificativa.tipoJustificativa) === 'outros') {
      return justificativa.motivo
        || justificativa.descricaoOutro
        || justificativa.outraJustificativa
        || 'Descriçaõ não informada';
    }

    return justificativa.tipoJustificativa|| 'Não informado';
  }

  // Selecionar filtro
  selecionarFiltro(filtro: FiltroSolicitacoes): void {
    this.filtroAtivo = filtro;
  }

  // Formatar data para pesquisa no formato brasileiro
  private formatarData(data: any): string {
    if (!data) return '';

    const dataObj = new Date(data);

    if (isNaN(dataObj.getTime())) {
      return '';
    }

    return dataObj.toLocaleDateString('pt-BR');
  }

  // Filtrar solicitações por aba e pesquisa
  get justificativasFiltradas(): any[] {
    const termo = this.normalizarTexto(this.termoBusca);

    return this.justificativas.filter((justificativa) => {
      const status = this.obterStatus(justificativa.status);

      let correspondeStatus = true;

      switch (this.filtroAtivo) {
        case 'pendentes':
          correspondeStatus = status === 'Em análise';
          break;

        case 'aprovados':
          correspondeStatus = status === 'Aprovada';
          break;

        case 'indeferidos':
          correspondeStatus = status === 'Indeferida';
          break;

        case 'todas':
          correspondeStatus = true;
          break;
      }

      const camposPesquisa = [
        justificativa.tipoJustificativa,
        justificativa.motivo,
        justificativa.descricaoOutro,
        justificativa.outraJustificativa,
        justificativa.observacoes,
        justificativa.status,
        justificativa.dataFalta,
        justificativa.observacaoCoordenacao,
        justificativa.nomeArquivo
      ];

      const correspondeBusca =
        !termo ||
        camposPesquisa.some(campo =>
          this.normalizarTexto(campo).includes(termo)
        ) ||
        this.formatarData(justificativa.dataFalta).includes(termo);

      return correspondeStatus && correspondeBusca;
    });
  }

  // Contagem de solicitações pendentes
  get quantidadePendentes(): number {
    return this.justificativas.filter(
      j => this.obterStatus(j.status) === 'Em análise'
    ).length;
  }

  // Contagem de solicitações aprovadas
  get quantidadeAprovados(): number {
    return this.justificativas.filter(
      j => this.obterStatus(j.status) === 'Aprovada'
    ).length;
  }

  // Contagem de solicitações indeferidas
  get quantidadeIndeferidos(): number {
    return this.justificativas.filter(
      j => this.obterStatus(j.status) === 'Indeferida'
    ).length;
  }

  // Retornar as 3 solicitações mais recentes
  get ultimasJustificativas(): any[] {
    return [...this.justificativas]
      .sort((a, b) => {
        const dataA = new Date(a.dataFalta).getTime();
        const dataB = new Date(b.dataFalta).getTime();

        return dataB - dataA;
      })
      .slice(0, 3);
  }

  // Definir classe visual do status
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

  // Visualizar documento enviado
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

  // Editar justificativa
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