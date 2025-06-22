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

function PublicApp() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="app-layout">
      <div className="main-container">
        {/* Usamos a nova e mais clara propriedade 'onLoginClick' */}
        <Topbar
          title="Bem-vindo"
          onLoginClick={() => setIsLoginModalOpen(true)}
        />
        <main
          className="content-area"
          style={{ textAlign: "center", paddingTop: "100px" }}
        >
          <h1>Estacionamento TOP</h1>
          <p>Por favor, faça o login para continuar.</p>
        </main>
        {isLoginModalOpen && (
          <LoginModal onClose={() => setIsLoginModalOpen(false)} />
        )}
      </div>
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

  switch (location.pathname) {
    case "/estacionamentos":
      currentPageTitle = "Estacionamento";
      break;
    case "/":
      currentPageTitle = "Visão Geral";
      break;
  }

  const loggedUser = {
    name: "Italo Bruno",
    role: "Administrador",
  };

  return (
    <div className="app-layout">
      <Sidebar
        userName={loggedUser.name}
        userRole={loggedUser.role}
        isVisible={isSidebarVisible}
      />
      <div
        className={`main-container ${!isSidebarVisible ? "no-sidebar" : ""}`}
      >
        <Topbar
          title={currentPageTitle}
          onLoginClick={() => {}}
          onMenuClick={toggleSidebar}
        />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/estacionamentos" element={<EstacionamentoPage />} />
            {/* Se acessar uma rota inexistente, volta para a home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function DashboardPage() {
  return <div>Bem-vindo à Visão Geral!</div>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<PublicApp />} />
          {/* Qualquer outra rota redireciona para o login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <>
          {/* Se logado, renderiza o layout protegido para todas as rotas */}
          <Route path="*" element={<ProtectedLayout />} />
        </>
      )}
    </Routes>
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
