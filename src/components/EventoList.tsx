import { EventoType } from "../pages/EventoPage"; // Importa a interface da página pai
import "./EventoList.css"; // Usaremos um CSS dedicado para a lista de eventos

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
            {/* Exibe as informações do evento */}
            <div className="item-info">
                <span className="item-name">{evento.nome}</span>
                {/* Criamos uma frase mais natural para os detalhes */}
                <span className="item-detail">
                  {` |  Ocorrerá em ${new Date(evento.data_evento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} das ${evento.hora_inicio} às ${evento.hora_fim}`}
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