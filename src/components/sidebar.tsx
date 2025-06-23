import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogoutModal } from "./LogoutModal";
import { FiLogOut } from "react-icons/fi";
import "./sidebar.css";

interface SidebarProps {
  isVisible: boolean;
}

export function Sidebar({ isVisible }: SidebarProps) {
  const { user, logout } = useAuth();
  const [showLogoutOption, setShowLogoutOption] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  const sidebarClassName = isVisible ? "sidebar" : "sidebar collapsed";

  const handleUserClick = () => {
    setShowLogoutOption(!showLogoutOption);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShowLogoutOption(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <nav className={sidebarClassName}>
        <div className="sidebar-header">
          <h3>ESTACIONAMENTO TOP</h3>
        </div>
        <div className="sidebar-links">
          <NavLink to="/" end className={getLinkClass}>
            VISÃO GERAL
          </NavLink>
          {user.role === "admin" && (
            <>
              <NavLink to="/estacionamentos" className={getLinkClass}>
                ESTACIONAMENTO
              </NavLink>
              <NavLink to="/eventos" className={getLinkClass}>
                EVENTO
              </NavLink>
            </>
          )}
          {/* Outros links de navegação aqui */}
        </div>
        <div className="sidebar-footer">
          <button className="user-profile-button" onClick={handleUserClick}>
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </button>

          {showLogoutOption && (
            <div className="logout-popup">
              <button
                className="logout-option-button"
                onClick={handleLogoutClick}
              >
                <FiLogOut /> Sair
              </button>
            </div>
          )}
        </div>
      </nav>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleConfirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}
