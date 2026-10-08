import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JustificativaService } from '../../services/justificativa';

@Component({
  selector: 'app-solicitacoes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrl: './solicitacoes.css',
  templateUrl: './solicitacoes.html',
})
export class Solicitacoes implements OnInit {

  justificativas: any[] = [];

  constructor(
    private justificativaService: JustificativaService
  ) {}

  ngOnInit(): void {
    this.carregarJustificativas();
  }

  carregarJustificativas(): void {
    this.justificativaService.getJustificativas().subscribe(
      (dados) => {
        this.justificativas = dados;
      }
    );
  }
}