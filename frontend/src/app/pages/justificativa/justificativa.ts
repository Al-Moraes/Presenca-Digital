import { Component, OnInit } from '@angular/core';
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
export class Justificativa implements OnInit {

  dataFalta: string = '';
  minData: string = '';
  maxData: string = '';

  constructor(
    private router: Router,
    private justificativaService: JustificativaService
  ) {}

  ngOnInit(): void {
    const hoje = new Date();

    this.maxData = this.formatarDataIso(hoje);

    const limitePassado = new Date();
    limitePassado.setDate(hoje.getDate() - 14);

    this.minData = this.formatarDataIso(limitePassado);
  }

  validarData(): void {
    if (!this.dataFalta) return;

    const [ano, mes, dia] = this.dataFalta.split('-').map(Number);
    const dataSelecionada = new Date(ano, mes - 1, dia);

    const diaSemana = dataSelecionada.getDay();

    if (diaSemana === 0 || diaSemana === 6) {
      alert('Selecione apenas dias úteis / letivos (segunda a sexta-feira).');
      this.dataFalta = '';
    }
  }

  private formatarDataIso(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

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
  descricaoOutro = '';
  observacoes = '';

  arquivoSelecionado: File | null = null;
  nomeArquivo = '';

  mensagemErro = '';
  mensagemSucesso = '';

  selecionarOutro(): void {
    this.mensagemErro = '';
    this.outraJustificativa = '';
    this.descricaoOutro = '';
  }

  adicionarOutraJustificativa(): void {

    const justificativa = this.outraJustificativa.trim();

    if (!justificativa) {
      this.mensagemErro =
        'Digite uma justificativa antes de adicionar.';
      return;
    }

    // Guarda a descrição digitada
    this.descricaoOutro = justificativa;

    // Mantém o tipo como Outros
    this.tipoJustificativa = 'Outros';

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

    if (!this.tipoJustificativa) {
      this.mensagemErro =
        'Selecione o tipo de justificativa.';
      return;
    }

    // Verifica se Outros possui descrição
    if (
      this.tipoJustificativa === 'Outros' &&
      !this.descricaoOutro.trim()
    ) {
      this.mensagemErro =
        'Informe qual é a sua justificativa.';
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

    try {

      const arquivoBase64 =
        await this.converterArquivoParaBase64(
          this.arquivoSelecionado
        );

      // SALVAR JUSTIFICATIVA
      this.justificativaService.adicionarJustificativa({

        tipoJustificativa: this.tipoJustificativa,

        // Salva a descrição digitada quando selecionar Outros
        motivo: this.tipoJustificativa === 'Outros'
          ? this.descricaoOutro.trim()
          : this.tipoJustificativa,

        dataFalta: this.dataFalta,

        observacoes: this.observacoes,

        nomeArquivo: this.nomeArquivo,

        arquivoBase64: arquivoBase64

      } as Parameters<
        JustificativaService['adicionarJustificativa']
      >[0]);

      this.mensagemSucesso =
        'Justificativa enviada com sucesso para a Coordenação!';

      // LIMPAR CAMPOS
      this.tipoJustificativa = '';
      this.outraJustificativa = '';
      this.descricaoOutro = '';
      this.dataFalta = '';
      this.observacoes = '';
      this.arquivoSelecionado = null;
      this.nomeArquivo = '';

      this.router.navigate(['/solicitacoes']);

    } catch (error) {

      this.mensagemErro =
        'Erro ao processar o arquivo anexado.';

    }
  }
}