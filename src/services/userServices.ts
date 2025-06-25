import api from "../components/api";
import {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  Pessoa,
} from "../types/UserTypes";

export const UserService = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await api.get("/usuarios/");
      const usersWithPessoa = await Promise.all(
        response.data.map(async (user: User) => {
          const pessoa = await UserService.getPessoaData(user.id_pessoa);
          return { ...user, pessoa };
        })
      );
      return usersWithPessoa;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }
  },

  getById: async (id: number): Promise<User> => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      const pessoa = await UserService.getPessoaData(response.data.id_pessoa);
      return { ...response.data, pessoa };
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      throw error;
    }
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    try {
      const response = await api.post("/usuarios/", payload);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  },

  update: async (id: number, payload: UpdateUserPayload): Promise<User> => {
    try {
      const response = await api.put(`/usuarios/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/usuarios/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar usuário ${id}:`, error);
      throw error;
    }
  },

  getPessoaData: async (id_pessoa: number): Promise<Pessoa> => {
    try {
      const response = await api.get(`/pessoas/${id_pessoa}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar pessoa ${id_pessoa}:`, error);
      throw error;
    }
  },
};
