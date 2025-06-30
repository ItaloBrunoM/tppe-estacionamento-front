import { OcupacaoHoraData } from '../types/DashboardTypes';
import './HourlyOccupancyChart.css';

interface HourlyOccupancyChartProps {
  data: OcupacaoHoraData[];
}

export function HourlyOccupancyChart({ data }: HourlyOccupancyChartProps) {
  const chartData = data
    .filter(item => item.acessos > 0)
    .sort((a, b) => a.hora - b.hora);

  if (chartData.length === 0) {
    return <p>Nenhum dado de ocupação por hora disponível para hoje.</p>;
  }

  const maxAcessos = Math.max(...chartData.map(item => item.acessos));
  const scaleFactor = 150 / (maxAcessos || 1); 
  
  return (
    <div className="hourly-chart-container">
      <div className="hourly-chart">
        {chartData.map((item) => (
          <div key={item.hora} className="hourly-bar-wrapper">
            <div
              className="hourly-bar"
              style={{ height: `${item.acessos * scaleFactor}px` }}
              title={`Hora: ${item.hora}h, Acessos: ${item.acessos}`}
            >
              {item.acessos > 0 && <span className="bar-value">{item.acessos}</span>}
            </div>
            <div className="hourly-label">{item.hora}h</div>
          </div>
        ))}
      </div>
    </div>
  );
}