import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.css'
})
export class Relatorio implements OnInit {

  dataHoraAtual: string = '';

  ngOnInit(): void {
    this.definirDataHora();
  }

  private definirDataHora(): void {
    const agora: Date = new Date();

    const data: string = agora.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const hora: string = agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    this.dataHoraAtual = `${data} às ${hora}`;
  }

  periodo='Maio/2026';

  total=123;
  aprovadas=85;
  reprovadas=25;
  pendentes=13;

  constructor(private router: Router) {}

  mudarPeriodo() {

    if (this.periodo === 'Janeiro/2026') {
      this.total=63;
      this.aprovadas=30;
      this.reprovadas=25;
      this.pendentes=8;
    }

    else if (this.periodo === 'Fevereiro/2026') {
      this.total=144;
      this.aprovadas=90;
      this.reprovadas=50;
      this.pendentes=4;
    }

    if (this.periodo === 'Março/2026') {
      this.total=20;
      this.aprovadas=12;
      this.reprovadas=7;
      this.pendentes=1;
    }

    else if (this.periodo === 'Abril/2026') {
      this.total=27;
      this.aprovadas=12;
      this.reprovadas=8;
      this.pendentes=7;
    }

    else if (this.periodo === 'Maio/2026') {
      this.total=98;
      this.aprovadas=60;
      this.reprovadas=31;
      this.pendentes=7;
    }

    if (this.periodo === 'Junho/2026') {
      this.total=123;
      this.aprovadas=85;
      this.reprovadas=25;
      this.pendentes=13;
    }

    else if (this.periodo === 'Junho/2026') {
      this.total=110;
      this.aprovadas=72;
      this.reprovadas=28;
      this.pendentes=10;
    }

    else if (this.periodo === 'Julho/2026') {
      this.total=98;
      this.aprovadas=65;
      this.reprovadas=20;
      this.pendentes=13;
    }
     if (this.periodo === 'Agosto/2026') {
      this.total=96;
      this.aprovadas=36;
      this.reprovadas=30;
      this.pendentes=30;
    }
    else if (this.periodo === 'Setembro/2026') {
      this.total=88;
      this.aprovadas=57;
      this.reprovadas=22;
      this.pendentes=9;
    }
    else if (this.periodo === 'Outubro/2026') {
      this.total=78;
      this.aprovadas=28;
      this.reprovadas=27;  
      this.pendentes=23;
    }
  }

  voltar() {
    this.router.navigate(['/home']);
  }

  exportarPDF() {
    window.print();
  }
}   