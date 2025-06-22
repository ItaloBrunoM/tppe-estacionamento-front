import './LogoutModal.css';

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content-logout" onClick={(e) => e.stopPropagation()}>
        <h4>Tem certeza que deseja sair?</h4>
        <div className="logout-actions">
          <button onClick={onCancel} className="btn-cancelar-logout">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-confirmar-logout">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}