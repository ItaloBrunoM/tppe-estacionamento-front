import { useState, useEffect } from 'react';
import api from './api';
import './EventoForm.css'; // Usaremos um novo CSS para ele

// Reutilizamos a interface de Estacionamento que já temos
import { EstacionamentoType } from '../pages/EstacionamentoPage'; 

interface EventoFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function EventoForm({ onClose, onSuccess }: EventoFormProps) {
  const [nome, setNome] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [valorAcessoUnico, setValorAcessoUnico] = useState('');
  const [idEstacionamento, setIdEstacionamento] = useState('');
  const [estacionamentos, setEstacionamentos] = useState<EstacionamentoType[]>([]);  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEstacionamentos = async () => {
      try {
        const response = await api.get('/estacionamentos/');
        setEstacionamentos(response.data);
      } catch (err) {
        console.error("Erro ao buscar estacionamentos para o formulário.", err);
        setError("Não foi possível carregar a lista de estacionamentos.");
      }
    };
    fetchEstacionamentos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (horaInicio && horaFim && horaFim <= horaInicio) {
        setError('A hora de fim deve ser posterior à hora de início.');
        setIsSubmitting(false);
        return;
      }

    if (!nome || !idEstacionamento || !dataEvento || !horaInicio || !horaFim) {
      setError('Todos os campos, exceto o valor, são obrigatórios.');
      setIsSubmitting(false);
      return;
    }
    
    const data = {
      nome,
      data_evento: dataEvento,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      valor_acesso_unico: parseFloat(valorAcessoUnico) || 0,
      id_estacionamento: parseInt(idEstacionamento, 10),
    };

    try {
      await api.post('/eventos/', data);
      onSuccess();
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setError(err.response.data.detail);
      } else {
        setError('Erro ao criar o evento. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Criar Novo Evento</h2>
        <form onSubmit={handleSubmit}>
          
          <label>Estacionamento</label>
          <select value={idEstacionamento} onChange={(e) => setIdEstacionamento(e.target.value)} required>
            <option value="" disabled>Selecione um estacionamento</option>
            {estacionamentos.map(est => (
              <option key={est.id} value={est.id}>{est.nome}</option>
            ))}
          </select>

          <label>Nome do Evento</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />

          <label>Data do Evento</label>
          <input type="date" value={dataEvento} onChange={(e) => setDataEvento(e.target.value)} required />

          <div className="time-inputs">
            <div>
              <label>Hora de Início</label>
              <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />
            </div>
            <div>
              <label>Hora de Fim</label>
              <input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} required />
            </div>
          </div>

          <label>Valor do Acesso Único (R$)</label>
          <input type="number" step="0.01" value={valorAcessoUnico} onChange={(e) => setValorAcessoUnico(e.target.value)} placeholder="Ex: 50.00"/>

          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancelar">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="btn-salvar">
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}