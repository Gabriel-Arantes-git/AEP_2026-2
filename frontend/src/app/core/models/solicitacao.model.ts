export interface CategoriaInfo { id: number; nome: string; }
export interface DepartamentoInfo { id: number; nome: string; }
export interface UsuarioInfo { id: number; nome: string; }

export interface Solicitacao {
  id: number;
  protocolo: string;
  status: 'ABERTO' | 'TRIAGEM' | 'EM_EXECUCAO' | 'RESOLVIDO' | 'ENCERRADO';
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA' | null;
  dataAbertura: string;
  prazoAlvo: string | null;
  dataEncerramento: string | null;
  descricao: string;
  bairro: string;
  logradouro: string | null;
  referencia: string | null;
  latitude: number | null;
  longitude: number | null;
  cep: string | null;
  anonimo: boolean;
  nomeContato: string | null;
  emailContato: string | null;
  categoria: CategoriaInfo;
  departamento: DepartamentoInfo | null;
  atendente: UsuarioInfo | null;
}

export interface NovaSolicitacaoRequest {
  categoriaId: number;
  descricao: string;
  bairro: string;
  logradouro?: string | null;
  referencia?: string | null;
  anonimo: boolean;
  nomeContato?: string | null;
  emailContato?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  cep?: string | null;
}

export interface MoverStatusRequest {
  novoStatus: string;
  comentario: string;
  prioridade?: string | null;
  departamentoId?: number | null;
}

export interface SolicitacaoView {
  id: number;
  protocolo: string;
  status: Solicitacao['status'];
  prioridade: Solicitacao['prioridade'];
  departamento: string | null;
  departamentoId: number | null;
  dataAbertura: string;
  dataAtualizacao: string | null;
  prazoAlvo: string | null;
  categoria: string;
  descricao: string;
  pontoReferencia: string;
  lat: number;
  lng: number;
  cep: string;
  bairro: string;
  logradouro: string;
}

export function paraSolicitacaoView(s: Solicitacao): SolicitacaoView {
  return {
    id: s.id,
    protocolo: s.protocolo,
    status: s.status,
    prioridade: s.prioridade,
    departamento: s.departamento?.nome ?? null,
    departamentoId: s.departamento?.id ?? null,
    dataAbertura: s.dataAbertura,
    dataAtualizacao: s.dataEncerramento,
    prazoAlvo: s.prazoAlvo,
    categoria: s.categoria.nome,
    descricao: s.descricao,
    pontoReferencia: s.referencia ?? '',
    lat: s.latitude ?? 0,
    lng: s.longitude ?? 0,
    cep: s.cep ?? '',
    bairro: s.bairro,
    logradouro: s.logradouro ?? '',
  };
}
