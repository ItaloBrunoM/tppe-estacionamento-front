export interface Estacionamento {
  id: number;
  nome: string;
  endereco: string | null;
  total_vagas: number;
  valor_primeira_hora: number | null;
  valor_demais_horas: number | null;
  valor_diaria: number | null;
  admin_id: number | null;
}

export interface EstacionamentoCreatePayload {
  nome: string;
  total_vagas: number;
  endereco?: string | null;
  valor_primeira_hora?: number | null;
  valor_demais_horas?: number | null;
  valor_diaria?: number | null;
}
