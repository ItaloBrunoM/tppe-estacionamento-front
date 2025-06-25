import { useState, useEffect } from "react";
import api from "../components/api";
import { useAuth } from "../context/AuthContext";
import { UserList } from "../components/UserList";
import { UserForm } from "../components/UserForm";
import { ConfirmModal } from "../components/ConfirmModal";
import { UserEditForm } from "../components/UserEditForm";
import ModalAtualiza from "../components/ModalAtualiza";
import { User } from "../types/UserTypes";

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/usuarios/");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    fetchUsers();
    showSuccessMessage("Novo usuário criado com sucesso!");
  };

  const handleEditSuccess = (login: string) => {
    setIsEditModalOpen(false);
    setUserToEdit(null);
    fetchUsers();
    showSuccessMessage(`Usuário "${login}" atualizado com sucesso!`);
  };

  const handleDeleteRequest = (user: User) => {
    setUserToDelete(user);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await api.delete(`/usuarios/${userToDelete.id}`);
        fetchUsers();
        showSuccessMessage(
          `Usuário "${userToDelete.login}" foi excluído com sucesso.`
        );
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        showSuccessMessage(`Erro ao excluir usuário "${userToDelete.login}".`);
      } finally {
        setIsConfirmModalOpen(false);
        setUserToDelete(null);
      }
    }
  };

  if (!currentUser) {
    return <div>Você precisa estar logado para acessar esta página</div>;
  }

  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <UserList
        users={users}
        onAddClick={() => setIsCreateModalOpen(true)}
        onEditClick={(user) => {
          setUserToEdit(user);
          setIsEditModalOpen(true);
        }}
        onDeleteItemClick={handleDeleteRequest}
      />

      {isEditModalOpen && userToEdit && (
        <UserEditForm
          user={userToEdit}
          currentAdminId={currentUser.id}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => handleEditSuccess(userToEdit.login)}
        />
      )}

      {isCreateModalOpen && (
        <UserForm
          currentAdminId={currentUser.id}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {isConfirmModalOpen && userToDelete && (
        <ConfirmModal
          message={`Tem certeza que deseja excluir permanentemente o usuário "${userToDelete.login}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}

      {successMessage && (
        <ModalAtualiza
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
}
