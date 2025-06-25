import { useState, useEffect, useRef } from "react";
import api from "./api";
import "./UserEditForm.css";
import { User } from "../types/UserTypes";

interface UserFormProps {
  user?: User;
  currentAdminId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserEditForm({
  user,
  currentAdminId,
  onClose,
  onSuccess,
}: UserFormProps) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [role, setRole] = useState<"admin" | "funcionario">("funcionario");
  const [error, setError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (user) {
      if (user.pessoa) {
        setNome(user.pessoa.nome);
        const rawCpfLoaded = user.pessoa.cpf.replace(/\D/g, "");
        let formattedCpfLoaded = rawCpfLoaded.slice(0, 11);
        if (formattedCpfLoaded.length > 3) {
          formattedCpfLoaded = formattedCpfLoaded.replace(
            /(\d{3})(\d)/,
            "$1.$2"
          );
        }
        if (formattedCpfLoaded.length > 7) {
          formattedCpfLoaded = formattedCpfLoaded.replace(
            /(\d{3})\.(\d{3})(\d)/,
            "$1.$2.$3"
          );
        }
        if (formattedCpfLoaded.length > 11) {
          formattedCpfLoaded = formattedCpfLoaded.replace(
            /(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/,
            "$1.$2.$3-$4"
          );
        }
        setCpf(formattedCpfLoaded);

        setEmail(user.pessoa.email || "");
      } else {
        console.warn("Dados da pessoa não disponíveis no objeto de usuário.");
      }

      setLogin(user.login);
      setRole(user.role);
    }
  }, [user]);

  // CPF validation and formatting
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    let formattedValue = rawValue.slice(0, 11);

    if (formattedValue.length > 3) {
      formattedValue = formattedValue.replace(/(\d{3})(\d)/, "$1.$2");
    }
    if (formattedValue.length > 7) {
      formattedValue = formattedValue.replace(
        /(\d{3})\.(\d{3})(\d)/,
        "$1.$2.$3"
      );
    }
    if (formattedValue.length > 11) {
      formattedValue = formattedValue.replace(
        /(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/,
        "$1.$2.$3-$4"
      );
    }

    setCpf(formattedValue);

    if (rawValue.length > 0 && rawValue.length !== 11) {
      setCpfError("CPF deve conter exatamente 11 dígitos");
    } else {
      setCpfError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setCpfError("");

    const rawCpf = cpf.replace(/\D/g, "");
    if (!nome.trim() || !rawCpf.trim() || !login.trim()) {
      setError("Nome, CPF e Login são obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    if (rawCpf.length !== 11) {
      setCpfError("CPF deve conter exatamente 11 dígitos");
      setIsSubmitting(false);
      return;
    }

    if (!user && (!senha || !confirmarSenha)) {
      setError("Senha e confirmação são obrigatórias para novo usuário.");
      setIsSubmitting(false);
      return;
    }

    if (senha && senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      setIsSubmitting(false);
      return;
    }

    const userData = {
      login,
      role: user ? role : "funcionario",
      password: senha || undefined,
      admin_id: currentAdminId,
    };

    const pessoaData = {
      nome,
      cpf: rawCpf,
      email: email || null,
    };

    try {
      if (user) {
        await api.put(`/usuarios/${user.id}`, {
          user_data: userData,
          pessoa_data: pessoaData,
        });
      } else {
        await api.post("/usuarios/", {
          user_data: userData,
          pessoa_data: pessoaData,
        });
      }
      onSuccess();
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 422 && err.response.data.detail) {
          const errorMessages = err.response.data.detail
            .map((d: any) => d.msg)
            .join(" | ");
          setError(`Erro de validação: ${errorMessages}`);
        } else if (err.response.status === 409) {
          setError("Login ou CPF já cadastrado.");
        } else {
          setError(err.response.data.detail || "Erro ao salvar usuário.");
        }
      } else {
        setError("Erro de conexão. Tente novamente.");
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-scroll-container">
          <h2>{user ? "Editar Usuário" : "Criar Usuário"}</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>Dados Pessoais</legend>

              <label>Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João da Silva"
                required
              />

              <label>CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="Somente números (11 dígitos)"
                required
                disabled={!!user}
                maxLength={14}
                pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                inputMode="numeric"
              />
              {cpfError && (
                <span className="error-message cpf-error">{cpfError}</span>
              )}

              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
              />
            </fieldset>

            <fieldset>
              <legend>Dados de Acesso</legend>

              <label>Login</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Nome de usuário"
                required
              />

              <label>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder={user ? "Deixe em branco para não alterar" : ""}
                required={!user}
              />

              <label>Confirmar Senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder={user ? "Deixe em branco para não alterar" : ""}
                required={!user}
              />
            </fieldset>

            {error && <p className="error-message">{error}</p>}
          </form>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn-cancelar">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-salvar"
            onClick={handleSubmit}
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
