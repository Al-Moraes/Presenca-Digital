import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-justificativa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './justificativa.html',
  styleUrls: ['./justificativa.css']
})
export class Justificativa {

  tiposJustificativa = [
    'Atestado Médico',
    'Compromisso Familiar',
    'Projeto Fora da Escola',
    'Aulas Extra Curriculares',
    'Perda de ônibus',
    'Greve de motorista',
    'Falecimento de Parente'
  ];

  tipoJustificativa = '';
  dataFalta = '';
  observacoes = '';

  arquivoSelecionado: File | null = null;
  nomeArquivo = '';

  mensagemErro = '';
  mensagemSucesso = '';

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
      this.mensagemErro = 'Formato inválido. Envie um arquivo PDF, JPG ou PNG.';
      this.arquivoSelecionado = null;
      this.nomeArquivo = '';
      return;
    }

    const tamanhoMaximo = 10 * 1024 * 1024;

    if (arquivo.size > tamanhoMaximo) {
      this.mensagemErro = 'O arquivo não pode ter mais de 10 MB.';
      this.arquivoSelecionado = null;
      this.nomeArquivo = '';
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
      this.mensagemErro = 'Selecione o tipo de justificativa.';
      return;
    }

    if (!this.dataFalta) {
      this.mensagemErro = 'Selecione a data da falta.';
      return;
    }

    if (!this.arquivoSelecionado) {
      this.mensagemErro = 'Anexe um documento para continuar.';
      return;
    }

    const dados = {
      tipo: this.tipoJustificativa,
      data: this.dataFalta,
      observacoes: this.observacoes,
      arquivo: this.arquivoSelecionado
    };

    console.log('Justificativa enviada:', dados);

    this.mensagemSucesso = 'Justificativa enviada com sucesso!';

    this.tipoJustificativa = '';
    this.dataFalta = '';
    this.observacoes = '';
    this.arquivoSelecionado = null;
    this.nomeArquivo = '';
  }
}