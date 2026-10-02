import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Solicitacao } from '../../model/solicitacao.model';

@Injectable({
  providedIn: 'root'
})

@Component({
  imports: [],
  selector: 'app-justificativa-service',
  styleUrl: './justificativa-service.css',
  templateUrl: './justificativa-service.html',
})
export class JustificativaService {
  private storageKey = 'solicitacoes_db';
  private solicitacoesSubject = new BehaviorSubject<Solicitacao[]>(this.carregarDoStorage());

  // Observable que as telas vão escutar
  solicitacoes$: Observable<Solicitacao[]> = this.solicitacoesSubject.asObservable();

  private carregarDoStorage(): Solicitacao[] {
    const dados = localStorage.getItem(this.storageKey);
    return dados ? JSON.parse(dados) : [
      // Dados de teste para o protótipo inicial
      { id: 1, nomeAluno: 'Matheus Souza', tipo: 'Atestado Médico', dataFalta: '2024-05-20', dataEnvio: '20/05/2024', arquivo: 'atestado.pdf', status: 'Pendente' },
      { id: 2, nomeAluno: 'Amanda Lima', tipo: 'Consulta Médica', dataFalta: '2024-05-19', dataEnvio: '19/05/2024', arquivo: 'receita.pdf', status: 'Pendente' }
    ];
  }

  private salvarNoStorage(solicitacoes: Solicitacao[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(solicitacoes));
    this.solicitacoesSubject.next(solicitacoes);
  }

  // Chamado pelo Aluno
  adicionarSolicitacao(dados: Omit<Solicitacao, 'id' | 'dataEnvio' | 'status'>): void {
    const atuais = this.solicitacoesSubject.getValue();
    const novaSolicitacao: Solicitacao = {
      ...dados,
      id: Date.now(),
      dataEnvio: new Date().toLocaleDateString('pt-BR'),
      status: 'Pendente'
    };

    this.salvarNoStorage([novaSolicitacao, ...atuais]);
  }

  // Chamado pelo Administrador
  atualizarStatus(id: number, novoStatus: 'Aprovada' | 'Reprovada'): void {
    const atuais = this.solicitacoesSubject.getValue();
    const atualizadas = atuais.map(item => 
      item.id === id ? { ...item, status: novoStatus } : item
    );

    this.salvarNoStorage(atualizadas);
  }
}

