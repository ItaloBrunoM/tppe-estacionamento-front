// src/components/ListaAcessos.tsx

import React from "react";
import { Acesso } from "../types/acesso";
import "./ListaAcesso.css";

interface ListaAcessosProps {
  acessos: Acesso[];
  onRegistrarSaida: (acessoId: number) => void;
  isLoading: boolean;
}

const ListaAcessos: React.FC<ListaAcessosProps> = ({
  acessos,
  onRegistrarSaida,
  isLoading,
}) => {
  const acessosAtivos = acessos.filter((acesso) => !acesso.hora_saida);

  // Função auxiliar para formatar a data e hora
  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return "N/A";
    // Criamos um objeto Date a partir da string UTC
    const date = new Date(dateTimeString);
    // Usamos toLocaleString para formatar para o fuso horário local do usuário
    // e para o formato de data/hora comum
    return date.toLocaleString();
  };

  return (
    <div className="card">
      <h3>Lista de Acessos</h3>
      {isLoading ? (
        <p>Carregando acessos...</p>
      ) : acessosAtivos.length === 0 ? (
        <p>Nenhum acesso ativo no momento.</p>
      ) : (
        <div className="acessos-list-container">
          <ul className="list">
            {acessosAtivos.map((acesso) => (
              <li key={acesso.id} className="listItem">
                <div className="acesso-info"> {/* Div para agrupar as infos do acesso */}
                  <span>Placa: {acesso.placa}</span>
                  <span>Entrada: {formatDateTime(acesso.hora_entrada)}</span>
                  {acesso.hora_saida && (
                    <span>Saída: {formatDateTime(acesso.hora_saida)}</span>
                  )}
                </div>
                <button
                  onClick={() => onRegistrarSaida(acesso.id)}
                  className="saidaButton"
                  disabled={isLoading}
                >
                  Registrar Saída
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ListaAcessos;