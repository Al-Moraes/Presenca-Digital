import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-justificativa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './justificativa.html',
  styleUrls: ['./justificativa.css']
})
export class Justificativa {

  constructor(private router: Router) {}

  // Voltar para o início do sistema
  voltarInicio(): void {
    this.router.navigate(['/']);
  }

  tiposJustificativa = [
    'Atestado Médico',
    'Compromisso Familiar',
    'Projeto Fora da Escola',
    'Aulas Extra Curriculares',
    'Greve de Ônibus',
    'Perda do Ônibus',
    'Falecimento de Parente',
    'Outros'
  ];

  tipoJustificativa = '';
  outraJustificativa = '';
  dataFalta = '';
  observacoes = '';

  arquivoSelecionado: File | null = null;
  nomeArquivo = '';

  mensagemErro = '';
  mensagemSucesso = '';

  selecionarOutro(): void {
    this.mensagemErro = '';
    this.outraJustificativa = '';
  }

  adicionarOutraJustificativa(): void {
    const justificativa = this.outraJustificativa.trim();

    if (!justificativa) {
      this.mensagemErro =
        'Digite uma justificativa antes de adicionar.';
      return;
    }

    const jaExiste = this.tiposJustificativa.some(
      tipo => tipo.toLowerCase() === justificativa.toLowerCase()
    );

    if (jaExiste) {
      this.mensagemErro =
        'Essa justificativa já está cadastrada.';
      return;
    }

    this.tiposJustificativa.splice(
      this.tiposJustificativa.length - 1,
      0,
      justificativa
    );

    this.tipoJustificativa = justificativa;
    this.outraJustificativa = '';
    this.mensagemErro = '';
  }

  selecionarArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const arquivo = input.files[0];

    const tiposPermitidos = [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ];

    if (!tiposPermitidos.includes(arquivo.type)) {
      this.mensagemErro =
        'Formato inválido. Envie um arquivo PDF, JPG ou PNG.';
      input.value = '';
      return;
    }

    if (arquivo.size > 10 * 1024 * 1024) {
      this.mensagemErro =
        'O arquivo não pode ter mais de 10 MB.';
      input.value = '';
      return;
    }

    this.arquivoSelecionado = arquivo;
    this.nomeArquivo = arquivo.name;
    this.mensagemErro = '';
  }

  removerArquivo(): void {
    this.arquivoSelecionado = null;
    this.nomeArquivo = '';
  }

  enviarJustificativa(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (!this.tipoJustificativa) {
      this.mensagemErro =
        'Selecione o tipo de justificativa.';
      return;
    }

    if (!this.dataFalta) {
      this.mensagemErro =
        'Selecione a data da falta.';
      return;
    }

    if (!this.arquivoSelecionado) {
      this.mensagemErro =
        'Anexe um documento para continuar.';
      return;
    }

    console.log({
      tipo: this.tipoJustificativa,
      data: this.dataFalta,
      arquivo: this.arquivoSelecionado,
      observacoes: this.observacoes
    });

    this.mensagemSucesso =
      'Justificativa enviada com sucesso!';

    this.tipoJustificativa = '';
    this.dataFalta = '';
    this.observacoes = '';
    this.arquivoSelecionado = null;
    this.nomeArquivo = '';
  }
}