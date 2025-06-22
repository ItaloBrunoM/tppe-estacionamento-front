import "./topbar.css";

interface TopbarProps {
  title: string;
  onLoginClick: () => void;
  onMenuClick?: () => void;
}

export function Topbar({ title, onLoginClick, onMenuClick }: TopbarProps) {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        {/* O botão de menu agora chama onMenuClick se fornecido, senão onLoginClick */}
        <button className="menu-button" onClick={onMenuClick || onLoginClick}>
          ☰
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="top-bar-right">
        <div className="user-profile">
          <span className="user-icon">👤</span>
          {/* Adicionamos a mesma função de clique ao botão "Entrar" */}
          <button className="login-button" onClick={onLoginClick}>
            Entrar
          </button>
        </div>
      </div>
    </header>
  );
}
