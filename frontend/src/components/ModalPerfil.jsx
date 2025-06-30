import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModalPerfil.css';

function ModalPerfil({  usuario, onProfileUpdate }) {
  const navigate = useNavigate();
 const [dados, setDados] = useState({
    nome: usuario?.nome || '',
    telefone: usuario?.telefone || '',
    nacionalidade: usuario?.nacionalidade || '',
    idioma: usuario?.idioma || '',
    email: usuario?.email || '',
  });
  const [editando, setEditando] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [acao, setAcao] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const carregarDadosUsuario = async () => {
    const emailSalvo = localStorage.getItem("email");
if (!usuario || !usuario.email) {
  setError("Usuário não carregado");
  return;
}

    try {
     const res = await fetch(`http://localhost:3001/api/usuario-atual`, {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
});
console.log('STATUS:', res.status);
      const userData = await res.json();
      setDados({
        nome: userData.nome || '',
        telefone: userData.telefone || '',
        nacionalidade: userData.nacionalidade || '',
        idioma: userData.idioma || '',
        email: userData.email || '',
      });
    } catch (err) {
      setError('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    const novoEstado = !isOpen;
    setIsOpen(novoEstado);
    if (!isOpen) {
      setLoading(true);
      setError('');
      carregarDadosUsuario();
    } else {
      setEditando(false);
      setError('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
  };

  const handleEditarClick = async () => {
    if (editando) {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:3001/api/usuarios/${encodeURIComponent(dados.email)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            nome: dados.nome, 
            telefone: dados.telefone, 
            nacionalidade: dados.nacionalidade, 
            idioma: dados.idioma 
          })
        });
        if (!response.ok) throw new Error('Erro ao atualizar perfil');
        const updatedData = await response.json();
        setDados(prev => ({ ...prev, ...updatedData }));
        setEditando(false);
        onProfileUpdate && onProfileUpdate(updatedData);
      } catch (err) {
        setError(err.message || 'Erro ao atualizar perfil');
      } finally {
        setLoading(false);
      }
    } else {
      setEditando(true);
    }
  };

  const handleSairClick = () => {
    setAcao('sair');
    setShowConfirmationModal(true);
  };

  const handleExcluirClick = () => {
    setAcao('excluir');
    setShowConfirmationModal(true);
  };

  const confirmarAcao = async () => {
    setLoading(true);
    try {
      if (acao === 'sair') {
        await fetch('http://localhost:3001/api/logout', { 
          method: 'POST', 
          credentials: 'include', 
          headers: { 'Content-Type': 'application/json' } 
        });
        localStorage.removeItem("email");
        navigate('/login');
      } else if (acao === 'excluir') {
        await fetch(`http://localhost:3001/api/usuarios/${encodeURIComponent(dados.email)}`, { 
          method: 'DELETE', 
          credentials: 'include', 
          headers: { 'Content-Type': 'application/json' } 
        });
        localStorage.removeItem("email");
        navigate('/login');
      }
    } catch (err) {
      setError(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
      setShowConfirmationModal(false);
      setAcao('');
      setIsOpen(false);
    }
  };

  const cancelarAcao = () => {
    setShowConfirmationModal(false);
    setAcao('');
  };

  return (
    <div>
      <button className='modal-button' onClick={toggleModal}>
        <img className='inicio-modal' src="icone-menu-trespont.png" alt="Abrir menu" />
      </button>
      
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className='modal-arruma'>
              <button className='button1' onClick={toggleModal}>
                <img className='arrow-modal' src="Arrow.png" alt="Fechar modal" />
              </button>
            </div>
            <div className='modal-arrumar'>
              <div className='divPequena-modal'>
                <h1 className='titulo1-modal'>Melhore o seu perfil</h1>
              </div>

              {loading && !showConfirmationModal && <p className="loading-message">Carregando...</p>}
              {error && <p className="error-message">{error}</p>}

              <div className='InfoUsuarios-modal'>
                <input 
                  type="text" 
                  name="nome"
                  className='InpuTNomeUsuario-modal' 
                  placeholder='Nome de usuário' 
                  value={dados.nome}
                  onChange={handleChange}
                  readOnly={!editando}
                />
                <input 
                  type="text" 
                  name="nacionalidade"
                  className='InpuTNomeUsuario-modal' 
                  placeholder='Nacionalidade' 
                  value={dados.nacionalidade}
                  onChange={handleChange}
                  readOnly={!editando}
                />
                <input 
                  type="text" 
                  name="idioma"
                  className='InpuTNomeUsuario-modal' 
                  placeholder='Idioma' 
                  value={dados.idioma}
                  onChange={handleChange}
                  readOnly={!editando}
                />
                <input 
                  type="text" 
                  name="telefone"
                  className='InpuTNomeUsuario-modal' 
                  placeholder='Telefone' 
                  value={dados.telefone}
                  onChange={handleChange}
                  readOnly={!editando}
                />
              </div>

              <div className='divPequena-modal2'></div>

              <div className='InfoUsuarios-modal2'>
                <button className='Editar_modal' onClick={handleEditarClick} disabled={loading}>
                  {editando ? (loading ? 'Salvando...' : 'Salvar') : 'Editar conta'}
                </button>
                <button className='Editar_modal' onClick={handleSairClick} disabled={loading}>
                  Sair da conta
                </button>
                <button className='Editar_modal' onClick={handleExcluirClick} disabled={loading}>
                  Deletar Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmationModal && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h2>Confirmação</h2>
            <p>
              {acao === 'sair' 
                ? 'Tem certeza que deseja sair da sua conta?' 
                : 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.'}
            </p>
            {error && <p className="error-message">{error}</p>}
            <div className="confirmation-buttons">
              <button onClick={confirmarAcao} disabled={loading}>
                {loading ? 'Processando...' : 'Sim'}
              </button>
              <button onClick={cancelarAcao} disabled={loading}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModalPerfil;