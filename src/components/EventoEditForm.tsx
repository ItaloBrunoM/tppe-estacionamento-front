import { useState, useEffect, useRef } from "react";
import api from "./api";
import "./EventoEditForm.css";
import { EventoType } from "../pages/EventoPage";

interface EventoEditFormProps {
  evento: EventoType;
  onClose: () => void;
  onSuccess: () => void;
}

export function EventoEditForm({
  evento,
  onClose,
  onSuccess,
}: EventoEditFormProps) {
  const [nome, setNome] = useState(evento.nome);
  // Inicializa a data e hora a partir da string ISO 8601
  const [dataEvento, setDataEvento] = useState(
    evento.data_hora_inicio ? evento.data_hora_inicio.substring(0, 10) : ""
  );
  const [horaInicio, setHoraInicio] = useState(
    evento.data_hora_inicio ? evento.data_hora_inicio.substring(11, 16) : ""
  );
  const [horaFim, setHoraFim] = useState(
    evento.data_hora_fim ? evento.data_hora_fim.substring(11, 16) : ""
  );
  const [valorAcessoUnico, setValorAcessoUnico] = useState(
    String(evento.valor_acesso_unico || "")
  );
  const [idEstacionamento] = useState(String(evento.id_estacionamento)); // idEstacionamento é readonly aqui, pode ser um problema se ele precisar ser editado

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (horaInicio && horaFim && horaFim <= horaInicio) {
      setError("A hora de fim deve ser posterior à hora de início.");
      setIsSubmitting(false);
      return;
    }

    // Combine data e hora em strings no formato ISO 8601 (YYYY-MM-DDTHH:MM:SS)
    const dataHoraInicio = `${dataEvento}T${horaInicio}:00`;
    const dataHoraFim = `${dataEvento}T${horaFim}:00`;

    const dataToUpdate = {
      nome,
      data_hora_inicio: dataHoraInicio, // Novo nome de campo e valor combinado
      data_hora_fim: dataHoraFim,       // Novo nome de campo e valor combinado
      valor_acesso_unico: parseFloat(valorAcessoUnico) || null,
      id_estacionamento: parseInt(idEstacionamento, 10),
    };

    try {
      await api.put(`/eventos/${evento.id}`, dataToUpdate);
      onSuccess();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        // Exibir mensagens de erro detalhadas do backend
        setError(JSON.stringify(err.response.data.detail));
      } else {
        setError("Erro ao atualizar o evento. Tente novamente.");
        console.error(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>Editar Evento</h2>
        <div className="modal-scroll-container">
          <form onSubmit={handleSubmit}>
            <label>Nome do Evento</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <label>Data do Evento</label>
            <input
              type="date"
              value={dataEvento}
              onChange={(e) => setDataEvento(e.target.value)}
              required
            />

            <div className="time-inputs">
              <div>
                <label>Hora de Início</label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Hora de Fim</label>
                <input
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  required
                />
              </div>
            </div>

            <label>Valor do Acesso Único (R$)</label>
            <input
              type="number"
              step="0.01"
              value={valorAcessoUnico}
              onChange={(e) => setValorAcessoUnico(e.target.value)}
            />

            {error && <p className="error-message">{error}</p>}

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-cancelar">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-salvar"
              >
                {isSubmitting ? "Atualizando..." : "Atualizar"}
              </button>
            </div>
          </form>
        </div>{" "}
      </div>
    </div>
  );
}