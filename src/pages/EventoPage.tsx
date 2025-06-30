import { useState, useEffect } from "react";
import api from "../components/api";
import { EventoList } from "../components/EventoList";
import { EventoForm } from "../components/EventoForm";
import { EventoEditForm } from "../components/EventoEditForm";
import { ConfirmModal } from "../components/ConfirmModal";

export interface EventoType {
  id: number;
  nome: string;
  // Propriedades atualizadas para corresponder ao backend
  data_hora_inicio: string; 
  data_hora_fim: string;
  valor_acesso_unico: number | null;
  id_estacionamento: number;
}

export function EventoPage({ estacionamentoId }: { estacionamentoId: number }) {
  const [eventos, setEventos] = useState<EventoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [eventoToEdit, setEventoToEdit] = useState<EventoType | null>(null);
  const [eventoToDelete, setEventoToDelete] = useState<EventoType | null>(null);

  const fetchEventos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/eventos/estacionamento/${estacionamentoId}`);
      setEventos(response.data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (estacionamentoId) {
      fetchEventos();
    }
  }, [estacionamentoId]);

  const handleFormSuccess = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    fetchEventos();
  };

  const handleEditClick = (evento: EventoType) => {
    setEventoToEdit(evento);
    setIsEditModalOpen(true);
  };

  const handleDeleteRequest = (evento: EventoType) => {
    setEventoToDelete(evento);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventoToDelete) return;
    try {
      await api.delete(`/eventos/${eventoToDelete.id}`);
      fetchEventos();
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
      alert("Não foi possível deletar o evento.");
    } finally {
      setIsConfirmModalOpen(false);
      setEventoToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container-eventos">
      <EventoList
        eventos={eventos}
        onAddClick={() => setIsCreateModalOpen(true)}
        onEditClick={handleEditClick}
        onDeleteItemClick={handleDeleteRequest}
      />

      {isCreateModalOpen && (
        <EventoForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {isEditModalOpen && eventoToEdit && (
        <EventoEditForm
          evento={eventoToEdit}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {isConfirmModalOpen && eventoToDelete && (
        <ConfirmModal
          message={`Tem certeza que deseja excluir o evento "${eventoToDelete.nome}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  );
} 