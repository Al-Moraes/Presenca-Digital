export type StatusJustificativa = 'Em Revisão' | 'Aprovada' | 'Indeferida';

export interface Justificativa {
    
  id: number;
  tipoJustificativa: string;
  dataFalta: string;
  observacoes?: string;
  nomeArquivo?: string;
  arquivoBase64?: string; // Armazena a imagem/PDF para ser visualizado no Admin
  status: StatusJustificativa;
  observacaoCoordenacao?: string;
  dataEnvio: string;

}

