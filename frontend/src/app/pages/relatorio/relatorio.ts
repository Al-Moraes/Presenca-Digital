import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { JustificativaService } from '../../services/justificativa';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.css'
})
export class Relatorio implements OnInit, OnDestroy {

  dataHoraAtual: string = '';
  periodo = 'Janeiro/2026';

  total = 0;
  aprovadas = 0;
  reprovadas = 0;
  pendentes = 0;

  justificativas: any[] = [];
  private inscricao?: Subscription;

  constructor(
    private router: Router,
    private justificativaService: JustificativaService
  ) {}

  ngOnInit(): void {
    this.definirDataHora();

    this.inscricao = this.justificativaService.justificativas$
      .subscribe((dados) => {
        this.justificativas = dados;
        this.atualizarRelatorio();
      });
  }

  ngOnDestroy(): void {
    this.inscricao?.unsubscribe();
  }

  private definirDataHora(): void {
    const agora = new Date();

    const data = agora.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const hora = agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    this.dataHoraAtual = `${data} às ${hora}`;
  }

  mudarPeriodo(): void {
    this.atualizarRelatorio();
  }

  atualizarRelatorio(): void {
    const [mes, ano] = this.periodo.split('/');

    const meses = [
      'Janeiro', 'Fevereiro', 'Março',
      'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro',
      'Outubro', 'Novembro', 'Dezembro'
    ];

    const numeroMes = meses.indexOf(mes);

    const dadosDoMes = this.justificativas.filter((item) => {
      if (!item.dataFalta) {
        return false;
      }

      const [anoFalta, mesFalta] = item.dataFalta
        .split('-')
        .map(Number);

      return (
        mesFalta === numeroMes + 1 &&
        anoFalta === Number(ano)
      );
    });

    this.total = dadosDoMes.length;

    this.pendentes = dadosDoMes.filter((item) => {
      const status = String(item.status).toLowerCase();
      return status.includes('revis');
    }).length;

    this.aprovadas = dadosDoMes.filter((item) => {
      const status = String(item.status).toLowerCase();
      return status.includes('aprov');
    }).length;

    this.reprovadas = dadosDoMes.filter((item) => {
      const status = String(item.status).toLowerCase();

      return (
        status.includes('reprov') ||
        status.includes('indefer')
      );
    }).length;
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }

  exportarPDF(): void {
    window.print();
  }
}