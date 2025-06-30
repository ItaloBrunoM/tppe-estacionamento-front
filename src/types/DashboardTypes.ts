export interface OcupacaoHoraData {
  hora: number;
  acessos: number;
}

export interface VisaoGeralMetrics {
  vagas_ocupadas: number;
  total_vagas: number;
  porcentagem_ocupacao: number;
  entradas_hoje: number;
  saidas_hoje: number;
  faturamento_hoje: number;
}

export interface VisaoGeralResponse {
  metrics: VisaoGeralMetrics;
  grafico_ocupacao_hora: OcupacaoHoraData[];
}
