import { useEffect, useState } from "react";
import { DashboardService } from "../services/dashboardService";
import { VisaoGeralResponse } from "../types/DashboardTypes";
import { useAuth } from "../context/AuthContext";
import { EstacionamentoService } from "../services/estacionamentoService";
import { Estacionamento } from "../types/EstacionamentoTypes";
import { DashboardMetricCard } from "../components/DashboardMetricCard";
import { HourlyOccupancyChart } from "../components/HourlyOccupancyChart";
import "./DashboardPage.css";

export function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<VisaoGeralResponse | null>(
    null
  );
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(true);
  const [errorDashboard, setErrorDashboard] = useState<string | null>(null);

  const [estacionamentos, setEstacionamentos] = useState<Estacionamento[]>([]);
  const [loadingEstacionamentos, setLoadingEstacionamentos] =
    useState<boolean>(true);
  const [errorEstacionamentos, setErrorEstacionamentos] = useState<
    string | null
  >(null);

  const [selectedEstacionamentoId, setSelectedEstacionamentoId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchEstacionamentos = async () => {
      setLoadingEstacionamentos(true);
      setErrorEstacionamentos(null);
      try {
        const data = await EstacionamentoService.getAll();
        setEstacionamentos(data);
        if (data.length > 0 && !selectedEstacionamentoId) {
          setSelectedEstacionamentoId(data[0].id);
        }
      } catch (err) {
        setErrorEstacionamentos(
          "Não foi possível carregar a lista de estacionamentos."
        );
        console.error(err);
      } finally {
        setLoadingEstacionamentos(false);
      }
    };

    fetchEstacionamentos();
  }, [selectedEstacionamentoId]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!selectedEstacionamentoId || !user) {
        setLoadingDashboard(false);
        return;
      }

      setLoadingDashboard(true);
      setErrorDashboard(null);
      try {
        const data = await DashboardService.getDashboardData(
          selectedEstacionamentoId
        );
        setDashboardData(data);
      } catch (err) {
        setErrorDashboard(
          "Não foi possível carregar os dados do dashboard para o estacionamento selecionado."
        );
        console.error(err);
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, [selectedEstacionamentoId, user]);

  if (loadingEstacionamentos || loadingDashboard) {
    return <div className="dashboard-container">Carregando...</div>;
  }

  if (errorEstacionamentos) {
    return (
      <div className="dashboard-container error">{errorEstacionamentos}</div>
    );
  }

  if (errorDashboard) {
    return <div className="dashboard-container error">{errorDashboard}</div>;
  }

  const metrics = dashboardData?.metrics;
  const grafico_ocupacao_hora = dashboardData?.grafico_ocupacao_hora;

  const formatPorcentagemOcupacao = (porcentagem: number) => {
    if (porcentagem > 0) {
      return `${porcentagem.toFixed(2).replace(".", ",")}% a mais desde ontem`;
    } else if (porcentagem < 0) {
      return `${Math.abs(porcentagem).toFixed(2).replace(".", ",")}% a menos desde ontem`;
    }
    return "Sem alteração desde ontem";
  };

  return (
    <div className="dashboard-container">
      <div className="estacionamento-selector">
        <label htmlFor="estacionamento-select">Estacionamento:</label>
        <select
          id="estacionamento-select"
          value={selectedEstacionamentoId || ""}
          onChange={(e) =>
            setSelectedEstacionamentoId(parseInt(e.target.value))
          }
          disabled={estacionamentos.length === 0}
        >
          {estacionamentos.length === 0 ? (
            <option value="" disabled>
              Nenhum estacionamento disponível
            </option>
          ) : (
            <>
              <option value="" disabled>
                Selecione um estacionamento
              </option>
              {estacionamentos.map((estacionamento) => (
                <option key={estacionamento.id} value={estacionamento.id}>
                  {estacionamento.nome}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      {dashboardData ? (
        <>
          <div className="dashboard-metrics-grid">
            <DashboardMetricCard
              title="Vagas Ocupadas"
              value={`${metrics?.vagas_ocupadas}/${metrics?.total_vagas}`}
              description={formatPorcentagemOcupacao(
                metrics?.porcentagem_ocupacao || 0
              )}
              className="occupied-spots"
            />
            <DashboardMetricCard
              title="Entradas Hoje"
              value={metrics?.entradas_hoje || 0}
              description="15 novas na última hora"
              className="entries-today"
            />
            <DashboardMetricCard
              title="Saídas Hoje"
              value={metrics?.saidas_hoje || 0}
              description={`${(((metrics?.saidas_hoje || 0) / (metrics?.entradas_hoje || 1)) * 100).toFixed(0)}% rotatividade`}
              className="exits-today"
            />
            <DashboardMetricCard
              title="Faturamento Hoje"
              value={`R$${(metrics?.faturamento_hoje || 0).toFixed(2).replace(".", ",")}`}
              description="12% acima da média"
              className="revenue-today"
            />
          </div>

          <div className="dashboard-chart-section">
            <h3>Ocupação por Hora</h3>
            <HourlyOccupancyChart data={grafico_ocupacao_hora || []} />
          </div>
        </>
      ) : (
        <p>Selecione um estacionamento para ver os dados do dashboard.</p>
      )}
    </div>
  );
}
