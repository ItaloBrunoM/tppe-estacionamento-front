import { useState, useEffect } from "react";
import api from "../components/api";
import { EventoList } from "../components/EventoList";
import { EventoForm } from "../components/EventoForm";
// Futuramente, precisaremos criar estes componentes:
// import { EventoEditForm } from "../components/EventoEditForm";
// import { ConfirmModal } from "../components/ConfirmModal";
// import { ModalAtualiza } from "../components/ModalAtualiza";

// Interface para o tipo de dado Evento
export interface EventoType {
  id: number;
  nome: string;
  data_evento: string;
  hora_inicio: string;
  hora_fim: string;
  valor_acesso_unico: number;
  id_estacionamento: number;
}

export function EventoPage() {
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<EventoType[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Estados para os modais de edição e deleção (para o futuro)
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [eventoToEdit, setEventoToEdit] = useState<EventoType | null>(null);
  // const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // const [eventoToDelete, setEventoToDelete] = useState<EventoType | null>(null);
  // const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/eventos/");
      setEventos(response.data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    fetchEventos();
    // showSuccessMessage("Novo evento criado com sucesso!"); // Implementar se desejar
  };

  // Funções para edição e deleção (placeholders por enquanto)
  const handleEditClick = (evento: EventoType) => {
    alert(`A funcionalidade de editar o evento "${evento.nome}" ainda será implementada.`);
    // setEventoToEdit(evento);
    // setIsEditModalOpen(true);
  };

  const handleDeleteRequest = (evento: EventoType) => {
    alert(`A funcionalidade de deletar o evento "${evento.nome}" ainda será implementada.`);
    // setEventoToDelete(evento);
    // setIsConfirmModalOpen(true);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container-evento">
      <EventoList
        eventos={eventos}
        onAddClick={() => setIsCreateModalOpen(true)}
        onEditClick={handleEditClick}
        onDeleteItemClick={handleDeleteRequest}
      />

      {isCreateModalOpen && (
        <EventoForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Aqui ficariam os outros modais de edição e confirmação,
        exatamente como no EstacionamentoPage.tsx

        {isEditModalOpen && eventoToEdit && (
           <EventoEditForm ... />
        )}

        {isConfirmModalOpen && eventoToDelete && (
          <ConfirmModal ... />
        )}

        {successMessage && (
          <ModalAtualiza ... />
        )}
      */}
    </div>
  );
}