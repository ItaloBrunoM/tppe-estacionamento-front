import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Sidebar } from "./components/sidebar";
import { Topbar } from "./components/topbar";
import { EstacionamentoPage } from "./pages/EstacionamentoPage";
import { EventoPage } from "./pages/EventoPage";
import { UsersPage } from "./pages/UsersPage";
import AcessoPage from "./pages/AcessoPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginModal } from "./components/LoginModal";
import "./App.css";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      {isAuthenticated ? (
        <Route path="/*" element={<ProtectedLayout />} />
      ) : (
        <Route path="*" element={<PublicLayout />} />
      )}
    </Routes>
  );
}

function PublicLayout() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <div className="public-layout">
      <Topbar
        title="Bem-vindo"
        onMenuClick={() => {}}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />
      <main className="public-content">
        <h1>ARKA PARK</h1>
        <p>Por favor, faça o login para acessar o sistema.</p>
      </main>
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </div>
  );
}

function ProtectedLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const location = useLocation();
  let currentPageTitle = "Visão Geral";

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  if (location.pathname.startsWith("/estacionamentos")) {
    currentPageTitle = "Estacionamento";
  } else if (location.pathname.startsWith("/eventos")) {
    currentPageTitle = "Eventos";
  } else if (location.pathname.startsWith("/usuarios")) {
    currentPageTitle = "Usuários";
  } else if (location.pathname === "/") {
    currentPageTitle = "Visão Geral";
  } else if (location.pathname.startsWith("/acesso")) {
    currentPageTitle = "Acesso";
  }

  // >>> INÍCIO DA ALTERAÇÃO <<<
  // ATENÇÃO: SUBSTITUA '1' PELO ID DE UM ESTACIONAMENTO VÁLIDO DO SEU BANCO DE DADOS PARA TESTE.
  // Em uma aplicação real, esse ID viria de uma seleção do usuário, do contexto, ou de parâmetros de rota.
  const estacionamentoIdParaEventoPage = 1; 
  // >>> FIM DA ALTERAÇÃO <<<

  return (
    <div className="app-layout">
      <Sidebar isVisible={isSidebarVisible} />
      <div
        className={`main-container ${isSidebarVisible ? "main-container-shifted" : ""}`}
      >
        <Topbar title={currentPageTitle} onMenuClick={toggleSidebar} />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/estacionamentos" element={<EstacionamentoPage />} />
            <Route path="/eventos" element={<EventoPage estacionamentoId={estacionamentoIdParaEventoPage} />} />
            <Route path="/acesso" element={<AcessoPage />} />
            <Route path="/usuarios" element={<UsersPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;