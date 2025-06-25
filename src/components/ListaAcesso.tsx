import React from 'react';
import { Acesso } from '../types/acesso';
import './ListaAcesso.css';

interface ListaAcessosProps {
  acessos: Acesso[];
  onRegistrarSaida: (acessoId: number) => void;
  isLoading: boolean;
}

const ListaAcessos: React.FC<ListaAcessosProps> = ({ acessos, onRegistrarSaida, isLoading }) => {
  const acessosAtivos = acessos.filter(acesso => !acesso.hora_saida);

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
                <span>{acesso.placa}</span>
                <button
                  onClick={() => onRegistrarSaida(acesso.id)}
                  className="saidaButton"
                  disabled={isLoading}
                >
                  Registrar Saída {'->'}
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