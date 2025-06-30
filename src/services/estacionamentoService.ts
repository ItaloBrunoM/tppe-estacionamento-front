import api from "../components/api";
import { Estacionamento } from "../types/EstacionamentoTypes";

export const EstacionamentoService = {
  getAll: async (): Promise<Estacionamento[]> => {
    try {
      const response = await api.get("/estacionamentos/");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estacionamentos:", error);
      throw error;
    }
  },
};
