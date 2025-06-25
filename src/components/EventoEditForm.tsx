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
  const [dataEvento, setDataEvento] = useState(evento.data_evento);
  const [horaInicio, setHoraInicio] = useState(evento.hora_inicio);
  const [horaFim, setHoraFim] = useState(evento.hora_fim);
  const [valorAcessoUnico, setValorAcessoUnico] = useState(
    String(evento.valor_acesso_unico || "")
  );
  const [idEstacionamento] = useState(String(evento.id_estacionamento));

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

    const dataToUpdate = {
      nome,
      data_evento: dataEvento,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      valor_acesso_unico: parseFloat(valorAcessoUnico) || null,
      id_estacionamento: parseInt(idEstacionamento, 10),
    };

    try {
      await api.put(`/eventos/${evento.id}`, dataToUpdate);
      onSuccess();
    } catch (err) {
      setError("Erro ao atualizar o evento. Tente novamente.");
      console.error(err);
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
