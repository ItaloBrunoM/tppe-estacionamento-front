import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from './api';
import './LoginModal.css';

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/token', new URLSearchParams({
        username,
        password,
      }));

      if (response.data.access_token) {
        login(response.data.access_token);
        onClose();
      }
    } catch (err) {
      setError('Usuário ou senha inválidos.');
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-entrar">ENTRAR</button>
        </form>
      </div>
    </div>
  );
}