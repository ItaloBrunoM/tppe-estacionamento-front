import { useAuth } from "../context/AuthContext";
import "./topbar.css";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
  onLoginClick?: () => void;
}

export function Topbar({ title, onMenuClick, onLoginClick }: TopbarProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        {isAuthenticated && (
          <button className="menu-button" onClick={onMenuClick}>
            ☰
          </button>
        )}
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="top-bar-right">
        <div className="user-profile">
          <span className="user-icon">👤</span>
          {isAuthenticated ? (
            <span className="user-name-display">{user?.name}</span>
          ) : (
            <button className="login-button" onClick={onLoginClick}>
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
