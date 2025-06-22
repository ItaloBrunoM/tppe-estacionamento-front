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
import { LoginModal } from "./components/LoginModal";
import "./App.css";

// Roteador principal que decide qual layout mostrar
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

// Layout para usuários deslogados
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
        <h1>Estacionamento TOP</h1>
        <p>Por favor, faça o login para acessar o sistema.</p>
      </main>
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
    </div>
  );
}

// Layout para usuários logados
function ProtectedLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const location = useLocation();
  let currentPageTitle = "Visão Geral";

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  if (location.pathname.startsWith("/estacionamentos")) {
    currentPageTitle = "Estacionamento";
  } else if (location.pathname === "/") {
    currentPageTitle = "Visão Geral";
  }

  function DashboardPlaceholder() {
    return <div>Bem-vindo à Visão Geral!</div>;
  }

  return (
    <div className="app-layout">
      {/* A Sidebar não precisa mais de props de usuário */}
      <Sidebar isVisible={isSidebarVisible} />
      <div className={`main-container ${isSidebarVisible ? 'main-container-shifted' : ''}`}>
        <Topbar title={currentPageTitle} onMenuClick={toggleSidebar} />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<DashboardPlaceholder />} />
            <Route path="/estacionamentos" element={<EstacionamentoPage />} />
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