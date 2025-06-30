import api from "../components/api";
import { VisaoGeralResponse } from "../types/DashboardTypes";

export const DashboardService = {
  getDashboardData: async (
    estacionamentoId: number
  ): Promise<VisaoGeralResponse> => {
    try {
      const response = await api.get(`/dashboard/${estacionamentoId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar dados do dashboard para o estacionamento ${estacionamentoId}:`,
        error
      );
      throw error;
    }
  },
};
