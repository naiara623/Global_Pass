import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModalPerfil.css';

function ModalPerfil({ onProfileUpdate }) {
  const navigate = useNavigate();
  const [dados, setDados] = useState({
    nome: '',
    telefone: '',
    nacionalidade: '',
    idioma: '',
    email: ''
  });

  const [editando, setEditando] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [acao, setAcao] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

useEffect(() => {
  const carregarDadosUsuario = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/usuario-atual', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao carregar dados do usuário');
      }
      
      const userData = await response.json().catch(() => ({})); // Fallback para objeto vazio se não for JSON
      
      // Garantir que todos os campos sejam strings (tratando null/undefined)
      setDados({
        nome: userData.nome || '',
        telefone: userData.telefone || '',
        nacionalidade: userData.nacionalidade || '',
        idioma: userData.idioma || '',
        email: userData.email || ''
      });
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message || 'Falha ao carregar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  carregarDadosUsuario();
}, [onProfileUpdate]); // Adicionei onProfileUpdate como dependência

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
  };

  const handleEditarClick = async () => {
    if (editando) {
      setLoading(true);
      setError('');
      try {
        if (!dados.email) {
          throw new Error('Email do usuário não encontrado');
        }

        const emailCodificado = encodeURIComponent(dados.email);
        const dadosAtualizacao = {
          nome: dados.nome || '',
          telefone: dados.telefone || null,
          nacionalidade: dados.nacionalidade || '',
          idioma: dados.idioma || ''
        };
        
        const response = await fetch(`http://localhost:3001/api/usuarios/${emailCodificado}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(dadosAtualizacao)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao atualizar perfil');
        }

        const updatedData = await response.json();
        setDados(prev => ({ ...prev, ...updatedData }));
        setEditando(false);
        
        if (onProfileUpdate) {
          onProfileUpdate(updatedData);
        }

      } catch (err) {
        console.error("Erro na atualização:", err);
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
    try {
      if (acao === 'sair') {
        // Fazer logout
        await fetch('http://localhost:3001/api/logout', {
          method: 'POST',
          credentials: 'include'
        });
        navigate('/login');
      } else if (acao === 'excluir') {
        // Excluir conta
        await fetch(`http://localhost:3001/api/usuarios/${dados.email}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        navigate('/login');
      }
    } catch (err) {
      console.error("Erro ao executar ação:", err);
      alert(`Erro: ${err.message}`);
    } finally {
      setShowConfirmationModal(false);
      setAcao('');
      setIsOpen(false);
    }
  };

  const cancelarAcao = () => {
    setShowConfirmationModal(false);
    setAcao('');
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
    // Resetar estado de edição quando fechar o modal
    if (isOpen) {
      setEditando(false);
    }
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

              {loading && <p className="loading-message">Carregando...</p>}
              {error && <p className="error-message">{error}</p>}

              <div className='InfoUsuarios-modal'>
                <input 
                  type="text" 
                  name="nome"
                  className='InpuTNomeUsuario-modal' 
                  placeholder='Nome de usuário' 
                  value={dados.nome || ''}
                  onChange={handleChange}
                  readOnly={!editando}
                />
                <input 
                  type="text" 
                  name="nacionalidade"
                  className='InpuTNomeUsuario-modal' 
                  placeholder='Nacionalidade' 
                  value={dados.nacionalidade || ''}
                  onChange={handleChange}
                  readOnly={!editando}
                />
                <input 
                  type="text" 
                  name="idioma"
                  className='InpuTNomeUsuario-modal' 
                  placeholder='Idioma' 
                  value={dados.idioma || ''}
                  onChange={handleChange}
                  readOnly={!editando}
                />
                <input 
                  type="text" 
                  name="telefone"
                  className='InpuTNomeUsuario-modal' 
                  placeholder='Telefone' 
                  value={dados.telefone || ''}
                  onChange={handleChange}
                  readOnly={!editando}
                />
              </div>

              <div className='divPequena-modal2'></div>

              <div className='InfoUsuarios-modal2'>
                <button className='Editar_modal' onClick={handleEditarClick}>
                  {editando ? 'Salvar' : 'Editar conta'}
                </button>
                <button className='Editar_modal' onClick={handleSairClick}>
                  Sair da conta
                </button>
                <button className='Editar_modal' onClick={handleExcluirClick}>
                  Deletar Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação */}
      {showConfirmationModal && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h2>Confirmação</h2>
            <p>
              {acao === 'sair' 
                ? 'Tem certeza que deseja sair da sua conta?' 
                : 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.'}
            </p>
            <div className="confirmation-buttons">
              <button onClick={confirmarAcao}>Sim</button>
              <button onClick={cancelarAcao}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModalPerfil;