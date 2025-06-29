import React, { useState } from "react";
import "./MarcarEntrada.css";

interface MarcarEntradaProps {
  onMarcarAcesso: (placa: string) => void;
  isLoading: boolean;
}

const MarcarEntrada: React.FC<MarcarEntradaProps> = ({
  onMarcarAcesso,
  isLoading,
}) => {
  const [placa, setPlaca] = useState<string>("");
  const [placaError, setPlacaError] = useState<string | null>(null);

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPlaca = e.target.value.toUpperCase();
    setPlaca(inputPlaca);

    const placaRegex = /^[a-zA-Z0-9]{7}$/;
    if (inputPlaca.length === 7 && !placaRegex.test(inputPlaca)) {
      setPlacaError("A placa deve conter 7 letras e/ou números.");
    } else if (inputPlaca.length > 0 && inputPlaca.length < 7) {
      setPlacaError("A placa deve ter exatamente 7 caracteres.");
    } else {
      setPlacaError(null);
    }
  };

  const handleSubmit = () => {
    const placaRegex = /^[a-zA-Z0-9]{7}$/;
    if (
      !placa.trim() ||
      placa.trim().length !== 7 ||
      !placaRegex.test(placa.trim())
    ) {
      setPlacaError("A placa deve ter exatamente 7 letras e/ou números.");
      return;
    }

    if (placa.trim() && !placaError) {
      onMarcarAcesso(placa.trim());
      setPlaca("");
    }
  };

  const isButtonDisabled =
    isLoading || !!placaError || placa.trim().length !== 7;

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
          onChange={handlePlacaChange}
          maxLength={7}
          minLength={7}
          className="input"
          disabled={isLoading}
        />
        {placaError && <p className="placa-error-message">{placaError}</p>}
      </div>
      <button
        onClick={handleSubmit}
        className="button"
        disabled={isButtonDisabled}
      >
        {isLoading ? "Marcando..." : "Marcar Acesso"}
      </button>
    </div>
  );
};

export default MarcarEntrada;
