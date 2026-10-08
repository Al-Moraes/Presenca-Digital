import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JustificativaService } from '../../services/justificativa';

@Component({
  selector: 'app-justificativa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './justificativa.html',
  styleUrls: ['./justificativa.css']
})
export class Justificativa {

  constructor(
    private router: Router,
    private justificativaService: JustificativaService
  ) {}

  voltarInicio(): void {
    this.router.navigate(['/home']);
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

  // Converte o arquivo para Base64
  private converterArquivoParaBase64(
    file: File
  ): Promise<string> {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = error => {
        reject(error);
      };

    });
  }

  async enviarJustificativa(): Promise<void> {

    this.mensagemErro = '';
    this.mensagemSucesso = '';

    // Verifica o tipo
    if (!this.tipoJustificativa) {

      this.mensagemErro =
        'Selecione o tipo de justificativa.';

      return;
    }

    // Verifica a data
    if (!this.dataFalta) {

      this.mensagemErro =
        'Selecione a data da falta.';

      return;
    }

    // Verifica o arquivo
    if (!this.arquivoSelecionado) {

      this.mensagemErro =
        'Anexe um documento para continuar.';

      return;
    }

    try {

      // Converte o arquivo para Base64
      const arquivoBase64 =
        await this.converterArquivoParaBase64(
          this.arquivoSelecionado
        );

      // Salva a justificativa
      this.justificativaService.adicionarJustificativa({

        tipoJustificativa:
          this.tipoJustificativa,

        dataFalta:
          this.dataFalta,

        observacoes:
          this.observacoes,

        nomeArquivo:
          this.nomeArquivo,

        arquivoBase64:
          arquivoBase64

      });

      // Mensagem de sucesso
      this.mensagemSucesso =
        'Justificativa enviada com sucesso para a Coordenação!';

      // Limpa os campos
      this.tipoJustificativa = '';
      this.dataFalta = '';
      this.observacoes = '';
      this.arquivoSelecionado = null;
      this.nomeArquivo = '';

      // Vai automaticamente para Solicitações
      this.router.navigate(['/solicitacoes']);

    } catch (error) {

      this.mensagemErro =
        'Erro ao processar o arquivo anexado.';

    }
  }
}