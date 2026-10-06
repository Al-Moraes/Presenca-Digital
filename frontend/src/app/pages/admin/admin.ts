import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Justificativa, StatusJustificativa } from '../../models/justificativa';
import { JustificativaService } from '../../services/justificativa';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit, OnDestroy {
  justificativas: Justificativa[] = [];
  observacoes: { [key: number]: string } = {};
  private inscricao!: Subscription;

  constructor(private justificativaService: JustificativaService) {}

  ngOnInit(): void {
    // Escuta em tempo real todas as alterações do LocalStorage
    this.inscricao = this.justificativaService.getJustificativas().subscribe(dados => {
      this.justificativas = dados;
    });
  }

  responder(id: number, status: StatusJustificativa): void {
    const parecer = this.observacoes[id] || '';
    
    this.justificativaService.responderJustificativa(id, status, parecer);
    
    delete this.observacoes[id];
  }

  ngOnDestroy(): void {
    if (this.inscricao) {
      this.inscricao.unsubscribe();
    }
  }
}