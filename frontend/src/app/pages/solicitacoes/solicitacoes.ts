import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
    private justificativaService: JustificativaService,
    private router: Router
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

  // 👁️ Visualizar documento enviado
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

    novaAba.document.write(`
      <html>
        <head>
          <title>${justificativa.nomeArquivo || 'Documento'}</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #f5f5f5;
            }

            iframe {
              width: 100%;
              height: 100vh;
              border: none;
            }

            img {
              display: block;
              max-width: 100%;
              max-height: 100vh;
              margin: auto;
            }
          </style>
        </head>

        <body>
          ${
            justificativa.arquivoBase64.startsWith('data:image')
              ? `<img src="${justificativa.arquivoBase64}" />`
              : `<iframe src="${justificativa.arquivoBase64}"></iframe>`
          }
        </body>
      </html>
    `);

    novaAba.document.close();
  }

  // ✏️ Editar justificativa
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