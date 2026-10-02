export interface Solicitacao {
  id: number;
  nomeAluno: string;
  tipo: string;
  dataFalta: string;
  dataEnvio: string;
  arquivo: string;
  observacoes?: string;
  status: 'Pendente' | 'Aprovada' | 'Reprovada';
}