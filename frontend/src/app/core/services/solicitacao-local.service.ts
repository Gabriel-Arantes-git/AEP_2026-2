import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface SolicitacaoLocal {
  id: number;
  protocolo: string;
  status: 'ABERTO' | 'TRIAGEM' | 'EM_EXECUCAO' | 'RESOLVIDO' | 'ENCERRADO';
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA' | null;
  departamento: string | null;
  dataAbertura: string;
  dataAtualizacao: string | null;
  categoria: string;
  descricao: string;
  pontoReferencia: string;
  lat: number;
  lng: number;
  cep: string;
  bairro: string;
  logradouro: string;
}

type NovaSolicitacao = Omit<SolicitacaoLocal, 'id' | 'protocolo' | 'status' | 'prioridade' | 'departamento' | 'dataAbertura' | 'dataAtualizacao'>;

@Injectable({ providedIn: 'root' })
export class SolicitacaoLocalService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly KEY = 'aep_solicitacoes';

  listar(): SolicitacaoLocal[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const raw = localStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : [];
  }

  salvar(dados: NovaSolicitacao): SolicitacaoLocal {
    const lista = this.listar();
    const id = lista.length > 0 ? Math.max(...lista.map(s => s.id)) + 1 : 1;
    const ano = new Date().getFullYear();
    const nova: SolicitacaoLocal = {
      ...dados,
      id,
      protocolo: `RI-${ano}-${String(id).padStart(5, '0')}`,
      status: 'ABERTO',
      prioridade: null,
      departamento: null,
      dataAbertura: new Date().toISOString(),
      dataAtualizacao: null,
    };
    lista.push(nova);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.KEY, JSON.stringify(lista));
    }
    return nova;
  }

  atualizar(id: number, dados: Partial<SolicitacaoLocal>): void {
    const lista = this.listar();
    const idx = lista.findIndex(s => s.id === id);
    if (idx === -1) return;
    lista[idx] = { ...lista[idx], ...dados };
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.KEY, JSON.stringify(lista));
    }
  }
}
