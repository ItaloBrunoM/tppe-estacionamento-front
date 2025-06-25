import React, { useState } from 'react';
import './MarcarEntrada.css';

interface MarcarEntradaProps {
  onMarcarAcesso: (placa: string) => void;
  isLoading: boolean;
}

const MarcarEntrada: React.FC<MarcarEntradaProps> = ({ onMarcarAcesso, isLoading }) => {
  const [placa, setPlaca] = useState<string>('');

  const handleSubmit = () => {
    if (placa.trim()) {
      onMarcarAcesso(placa.trim());
      setPlaca('');
    }
  };

  return (
    <div className="card">
      <h3>Marcar Entrada</h3>
      <div className="inputGroup">
        <label htmlFor="placaInput">Placa do Veículo</label>
        <input
          id="placaInput"
          type="text"
          placeholder="Ex: XYX1111"
          value={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          className="input"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="button"
        disabled={isLoading || !placa.trim()}
      >
        {isLoading ? 'Marcando...' : 'Marcar Acesso'}
      </button>
    </div>
  );
};

export default MarcarEntrada;