export interface LogAcao {
  id: number;
  acao: string;
  entidade: string | null;
  entidadeId: number | null;
  detalhes: string | null;
  usuarioNome: string | null;
  dataAcao: string;
}
