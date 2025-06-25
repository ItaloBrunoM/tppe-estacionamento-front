
export interface Acesso {
    id: number;
    placa: string;
    hora_entrada: string;
    hora_saida: string | null;
    valor_total: number | null;
    tipo_acesso: 'evento' | 'hora' | 'diaria';
    id_estacionamento: number;
    id_evento: number | null;
    admin_id: number | null;
  }