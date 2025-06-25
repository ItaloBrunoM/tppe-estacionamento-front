import { User } from "../types/UserTypes";
import "./UserList.css";

interface UserListProps {
  users: User[];
  onAddClick: () => void;
  onDeleteItemClick: (user: User) => void;
  onEditClick: (user: User) => void;
}

export function UserList({
  users,
  onAddClick,
  onDeleteItemClick,
  onEditClick,
}: UserListProps) {
  return (
    <>
      <div className="header-actions">
        <input type="search" placeholder="Buscar Usuário" />
        <button onClick={onAddClick} className="create-button">
          + CRIAR USUÁRIO
        </button>
      </div>

      <div className="list-container">
        {users.map((user) => (
          <div key={user.id} className="list-item">
            <div className="item-info">
              <span className="item-name">
                {user.pessoa?.nome || "Nome não disponível"}
              </span>
              <div className="item-details">
                <span>Login: {user.login} Cargo: </span>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role === "admin" ? "Administrador" : "Funcionário"}
                </span>
              </div>
            </div>
            <div className="item-actions">
              <button
                className="icon-btn edit-btn"
                onClick={() => onEditClick(user)}
                aria-label="Editar usuário"
              >
                ✏️
              </button>
              <button
                className="icon-btn delete-btn"
                onClick={() => onDeleteItemClick(user)}
                aria-label="Excluir usuário"
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
