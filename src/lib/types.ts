export interface Negociacao {
    id: string;
    data_contrato: any; // Pode ser Timestamp ou string, dependendo do formato
    cliente: string;
    servico_produto: string;
    valor_total: number;
    etapas?: string;
    feedback: string;
    status: string;
    motivo_perda?: string;
  }
  