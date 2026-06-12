import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MoverStatusRequest, NovaSolicitacaoRequest, Solicitacao } from '../models/solicitacao.model';

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
  private readonly http = inject(HttpClient);

  criar(req: NovaSolicitacaoRequest): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(`${environment.apiUrl}/solicitacoes`, req);
  }

  criarAnonima(req: NovaSolicitacaoRequest): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(`${environment.apiUrl}/solicitacoes/anonima`, req);
  }

  listar(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${environment.apiUrl}/solicitacoes`);
  }

  listarMinhas(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${environment.apiUrl}/solicitacoes/minhas`);
  }

  listarPublicas(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${environment.apiUrl}/solicitacoes/publicas`);
  }

  listarAnonimas(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${environment.apiUrl}/solicitacoes/anonimas`);
  }

  moverStatus(id: number, req: MoverStatusRequest): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/solicitacoes/${id}/status`, req);
  }
}
