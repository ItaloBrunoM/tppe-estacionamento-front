import { useState, useEffect } from "react";
import api from "./api";
import { EventoType } from "../pages/EventoPage";
import { EstacionamentoType } from "../pages/EstacionamentoPage"; // Reutilizamos para o dropdown
import "./EventoForm.css"; // Reutilizamos o mesmo estilo do formulário de criação

interface EventoEditFormProps {
  evento: EventoType; // Recebe o evento a ser editado como propriedade
  onClose: () => void;
  onSuccess: () => void;
}

export function EventoEditForm({
  evento,
  onClose,
  onSuccess,
}: EventoEditFormProps) {
  // O estado inicial é preenchido com os dados do evento existente
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

  // Busca a lista de estacionamentos para popular o dropdown

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Adicione validações aqui se desejar (ex: hora fim > hora início)

    const dataToUpdate = {
      nome,
      data_evento: dataEvento,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      valor_acesso_unico: parseFloat(valorAcessoUnico) || null,
      id_estacionamento: parseInt(idEstacionamento, 10),
    };

    try {
      // Usamos o método PUT e passamos o ID do evento na URL
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
      <div className="modal-content">
        <h2>Editar Evento</h2>
        <form onSubmit={handleSubmit}>
          {/* O formulário é idêntico ao de criação, mas os inputs já vêm preenchidos */}

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
      </div>
    </div>
  );
}
