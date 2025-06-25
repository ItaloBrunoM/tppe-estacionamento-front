import React, { useState, useEffect, useCallback } from "react";
import MarcarEntrada from "../components/MarcarEntrada";
import ListaAcessos from "../components/ListaAcesso";
import { Acesso } from "../types/acesso";
import { EstacionamentoType } from "../pages/EstacionamentoPage";
import "./AcessoPage.css";
import api from "../components/api";

const AcessoPage: React.FC = () => {
  const [acessos, setAcessos] = useState<Acesso[]>([]);
  const [estacionamentosList, setEstacionamentosList] = useState<
    EstacionamentoType[]
  >([]);
  const [selectedEstacionamentoId, setSelectedEstacionamentoId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const estacionamentosResponse =
        await api.get<EstacionamentoType[]>("/estacionamentos/");
      const fetchedEstacionamentos = estacionamentosResponse.data;
      setEstacionamentosList(fetchedEstacionamentos);

      let initialEstacionamentoId: number | null = null;
      if (fetchedEstacionamentos.length > 0) {
        initialEstacionamentoId = fetchedEstacionamentos[0].id;
      } else {
        setError(
          "Nenhum estacionamento encontrado. Por favor, cadastre um estacionamento primeiro."
        );
      }
      setSelectedEstacionamentoId(initialEstacionamentoId);

      const acessosResponse = await api.get<Acesso[]>("/acessos/");
      setAcessos(acessosResponse.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erro desconhecido ao carregar dados"
      );
      console.error("Erro ao carregar dados iniciais:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const refetchAcessos = useCallback(async () => {
    if (selectedEstacionamentoId === null) {
      setAcessos([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Acesso[]>("/acessos/");
      setAcessos(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || err.message || "Erro ao buscar acessos"
      );
      console.error("Erro ao buscar acessos:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEstacionamentoId]);

  const handleMarcarAcesso = async (placa: string) => {
    if (selectedEstacionamentoId === null) {
      setError("Por favor, selecione um estacionamento.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/acessos/", {
        placa,
        id_estacionamento: selectedEstacionamentoId,
      });

      if (response.status === 201) {
        showSuccessMessage(
          `Entrada da placa "${placa}" registrada com sucesso!`
        );
      }

      await refetchAcessos();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erro desconhecido ao marcar acesso"
      );
      console.error("Erro ao marcar acesso:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrarSaida = async (acessoId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.put(`/acessos/${acessoId}/saida`);

      if (response.status === 200) {
        showSuccessMessage(
          `Saída registrada com sucesso! Valor total: R$ ${response.data.valor_total}`
        );
      }

      await refetchAcessos();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erro desconhecido ao registrar saída"
      );
      console.error("Erro ao registrar saída:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && estacionamentosList.length === 0) {
    return <div>Carregando dados iniciais...</div>;
  }

  const filteredAcessos = selectedEstacionamentoId
    ? acessos.filter(
        (acesso) => acesso.id_estacionamento === selectedEstacionamentoId
      )
    : [];

  return (
    <div className="pageContainer">
      <div className="estacionamento-selector-wrapper">
        <label htmlFor="estacionamento-select">Selecionar Estacionamento</label>{" "}
        {/* Label idêntico ao EventoForm */}
        <select
          id="estacionamento-select"
          value={selectedEstacionamentoId || ""}
          onChange={(e) => setSelectedEstacionamentoId(Number(e.target.value))}
          required
          disabled={isLoading || estacionamentosList.length === 0}
        >
          <option value="" disabled>
            Selecione um estacionamento
          </option>{" "}
          {/* */}
          {estacionamentosList.map((est) => (
            <option key={est.id} value={est.id}>
              {est.nome}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="errorText">Erro: {error}</p>}
      {successMessage && <p className="successMessage">{successMessage}</p>}

      {isLoading && estacionamentosList.length > 0 && (
        <p>Realizando operação...</p>
      )}

      <div className="contentWrapper">
        <MarcarEntrada
          onMarcarAcesso={handleMarcarAcesso}
          isLoading={isLoading}
        />
        <ListaAcessos
          acessos={filteredAcessos}
          onRegistrarSaida={handleRegistrarSaida}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AcessoPage;
