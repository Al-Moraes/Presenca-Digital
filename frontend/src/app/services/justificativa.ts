
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Justificativa, StatusJustificativa } from '../models/justificativa';

@Injectable({
  providedIn: 'root'
})
export class JustificativaService {

  private readonly STORAGE_KEY = 'justificativas_db';

  private justificativasSubject = new BehaviorSubject<Justificativa[]>([]);

  public justificativas$: Observable<Justificativa[]> =
    this.justificativasSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.carregarDoStorage();
  }

  private eNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private carregarDoStorage(): void {
    if (this.eNavegador()) {
      try {
        const dadosSalvos = localStorage.getItem(this.STORAGE_KEY);

        if (dadosSalvos) {
          this.justificativasSubject.next(JSON.parse(dadosSalvos));
        }
      } catch (e) {
        console.warn('Erro ao carregar justificativas:', e);
      }
    }
  }

  private salvarNoStorage(lista: Justificativa[]): void {
    this.justificativasSubject.next(lista);

    if (this.eNavegador()) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lista));
      } catch (e) {
        console.warn('Erro ao salvar justificativas:', e);
      }
    }
  }

  getJustificativas(): Observable<Justificativa[]> {
    return this.justificativas$;
  }

  adicionarJustificativa(
    nova: Omit<Justificativa, 'id' | 'status' | 'dataEnvio'>
  ): void {

    const listaAtual = this.justificativasSubject.getValue();

    const novaJustificativa: Justificativa = {
      ...nova,
      id: Date.now(),
      status: 'Em Revisão',
      dataEnvio: new Date().toISOString()
    };

    this.salvarNoStorage([novaJustificativa, ...listaAtual]);
  }

  responderJustificativa(
    id: number,
    status: StatusJustificativa,
    observacao?: string
  ): void {

    const listaAtual = this.justificativasSubject.getValue();

    const listaAtualizada = listaAtual.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          observacaoCoordenacao: observacao || ''
        };
      }

      return item;
    });

    this.salvarNoStorage(listaAtualizada);
  }
}
