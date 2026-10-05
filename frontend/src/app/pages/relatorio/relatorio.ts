import { Component } from '@angular/core';
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
export class Relatorio {

  periodo='Maio/2026';

  total=123;
  aprovadas=85;
  reprovadas=25;
  pendentes=13;

  constructor(private router: Router) {}

  mudarPeriodo() {

    if (this.periodo === 'Maio/2026') {
      this.total=123;
      this.aprovadas=85;
      this.reprovadas=25;
      this.pendentes=13;
    }

    else if (this.periodo === 'Abril/2026') {
      this.total=110;
      this.aprovadas=72;
      this.reprovadas=28;
      this.pendentes=10;
    }

    else if (this.periodo === 'Março/2026') {
      this.total=98;
      this.aprovadas=65;
      this.reprovadas=20;
      this.pendentes=13;
    }
  }

  voltar() {
    this.router.navigate(['/home']);
  }

  exportarPDF() {
    window.print();
  }
}