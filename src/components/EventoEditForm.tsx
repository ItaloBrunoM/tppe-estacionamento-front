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
  // O estado inicial é preenchido com os dados do evento existente
  const [nome, setNome] = useState(evento.nome);
  const [dataEvento, setDataEvento] = useState(evento.data_evento);
  const [horaInicio, setHoraInicio] = useState(evento.hora_inicio);
  const [horaFim, setHoraFim] = useState(evento.hora_fim);
  const [valorAcessoUnico, setValorAcessoUnico] = useState(
    String(evento.valor_acesso_unico || "")
  );
  const [idEstacionamento] = useState(String(evento.id_estacionamento)); // idEstacionamento não é editável aqui

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null); // Adicionado ref para o modal

  // Efeito para fechar o modal ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Não precisamos buscar a lista de estacionamentos aqui, pois o idEstacionamento não é um campo de seleção no formulário de edição atual.
  // Se você quiser que o idEstacionamento seja editável e selecionável, precisaria de um useEffect para buscar os estacionamentos,
  // como no EventoForm de criação.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Adicione validações aqui se desejar (ex: hora fim > hora início)
    if (horaInicio && horaFim && horaFim <= horaInicio) {
        setError('A hora de fim deve ser posterior à hora de início.');
        setIsSubmitting(false);
        return;
    }

    const dataToUpdate = {
      nome,
      data_evento: dataEvento,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      valor_acesso_unico: parseFloat(valorAcessoUnico) || null,
      id_estacionamento: parseInt(idEstacionamento, 10), // idEstacionamento é preenchido do prop 'evento'
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
      {/* Adicionado ref ao div do modal-content */}
      <div className="modal-content" ref={modalRef}>
        <h2>Editar Evento</h2>
        {/* Adicionado um container para scroll, similar aos outros formulários */}
        <div className="modal-scroll-container">
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
        </div> {/* Fechamento do modal-scroll-container */}
      </div>
    </div>
  );
}