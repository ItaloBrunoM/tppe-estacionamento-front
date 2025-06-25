export type UserRole = 'admin' | 'funcionario';

export interface Pessoa {
  id: number;
  nome: string;
  cpf: string;
  email: string | null;
}

export interface User {
    id: number;
    login: string;
    role: 'admin' | 'funcionario';
    id_pessoa: number;
    admin_id: number | null;
    pessoa?: {
      nome: string;
      cpf: string;
      email: string | null;
    };
  }

export interface CreateUserPayload {
  pessoa_data: {
    nome: string;
    cpf: string;
    email: string | null;
  };
  user_data: {
    login: string;
    senha: string;
    role: UserRole;
    admin_id?: number;
  };
}

export interface UpdateUserPayload {
  login?: string;
  senha?: string;
  role?: UserRole;
}