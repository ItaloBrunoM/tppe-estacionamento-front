import { EventoType } from "../pages/EventoPage";
import "./EventoList.css";

interface EventoListProps {
  eventos: EventoType[];
  onAddClick: () => void;
  onDeleteItemClick: (evento: EventoType) => void;
  onEditClick: (evento: EventoType) => void;
}

export function EventoList({
  eventos,
  onAddClick,
  onDeleteItemClick,
  onEditClick,
}: EventoListProps) {
  const formatDateTimeLocal = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString + 'Z'); 
    
    if (isNaN(date.getTime())) {
      return "Data Inválida";
    }

    const formatter = new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    });
    return formatter.format(date);
  };

  const formatTimeLocal = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString + 'Z'); 
    
    if (isNaN(date.getTime())) {
      return "Hora Inválida";
    }

    const formatter = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    });
    return formatter.format(date);
  };

  return (
    <>
      <div
        className="header-actions"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <input type="search" placeholder="Buscar Evento" />
        <button onClick={onAddClick} style={{ cursor: "pointer" }}>
          + CRIAR EVENTO
        </button>
      </div>

      <div className="list-container">
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className="list-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              border: "1px solid #ccc",
              marginBottom: "10px",
            }}
          >
            <div className="item-info">
              <span className="item-name">{evento.nome}</span>
              <span className="item-detail">
                {` | Ocorrerá em ${formatDateTimeLocal(evento.data_hora_inicio).split(' ')[0]} das ${formatTimeLocal(evento.data_hora_inicio)} às ${formatTimeLocal(evento.data_hora_fim)}`}
              </span>
            </div>

            <div className="item-actions">
              <button className="icon-btn" onClick={() => onEditClick(evento)}>
                ✏️
              </button>
              <button
                className="icon-btn"
                onClick={() => onDeleteItemClick(evento)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}