import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CadastroEscuro.css';

function CadastroEscuro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [idioma, setIdioma] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [mensagemErro, setMensagemErro] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmaSenha, setShowConfirmaSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async () => {
    // alert('Cadastro iniciado!');
    setMensagemErro({});
    setErroGeral('');

    const novosErros = {};
    if (!nome.trim()) novosErros.nome = "Campo obrigatório";
    if (!email.includes('@')) novosErros.email = "E-mail inválido";
    if (!idioma.trim()) novosErros.idioma = "Campo obrigatório";
    if (!nacionalidade.trim()) novosErros.nacionalidade = "Campo obrigatório";
    if (senha.length < 6) novosErros.senha = "Mínimo 6 caracteres";
    if (senha !== confirmaSenha) novosErros.confirmaSenha = "Senhas não conferem";
    if (!aceitouTermos) novosErros.termos = "Você deve aceitar os termos de uso";

    if (Object.keys(novosErros).length > 0) {
      setMensagemErro(novosErros);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          idioma: idioma.trim(),
          nacionalidade: nacionalidade.trim(), 
          senha
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Resposta inválida do servidor');
      }

      console.log('response.ok:', response.ok);
      console.log('response.status:', response.status);
      console.log('data:', data);

      if (!response.ok) {
        if (response.status === 409 && data.erro === 'Email já cadastrado') {
          setMensagemErro({ email: 'Este e-mail já está cadastrado.' });
        } else {
          throw new Error(data.erro || 'Erro ao processar cadastro');
        }
        return;
      }

      setShowModal(true);
    } catch (error) {
      setErroGeral(() => {
        if (error?.message === 'Failed to fetch') {
          return 'Erro de conexão com o servidor. Tente novamente.';
        }
        return error?.message || 'Erro inesperado. Tente novamente.';
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/login');
    setNome('');
    setEmail('');
    setIdioma('');
    setNacionalidade('');
    setSenha('');
    setConfirmaSenha('');
    setMensagemErro({});
    setErroGeral('');
    setAceitouTermos(false);
  };

   function alternarSenha() {
    setMostrarSenha(!mostrarSenha);
  };

  function fecharModal() {
    setShowModal(false);
    navigate('/telainicial');
  };

  const renderErro = (campo) => mensagemErro[campo] && (
    <p style={{ color: 'red', marginTop: '-6%', fontSize: '0.85rem' }}>{mensagemErro[campo]}</p>
  );

  return (
    <div className='amarela-Cadastro'>
      <div className="azul-Cadastro">
        <div className="verde-Cadastro"></div>
        <div className="marrom-Cadastro"></div>
      </div>

      <div className="rosa-Cadastro"></div>

      <div className="vermelha-Cadastro">
        <div className="verdeClaro-Cadastro">
          <div className="azulEscuro-Cadastro">
            <h1 className='titulo-Cadastro'>Cadastro</h1>
          </div>

          <div className="rosaEscuro-Cadastro">
            <div className="Input-Cadastro1">
              <div className="nome-Cadastro">
                <label className='nomeLabel-Cadastro'>Nome completo:</label>
                <input type="text" className='NomeIn-Cadastro' placeholder='Ex:Maria Knupp' value={nome} onChange={(e) => setNome(e.target.value)} />
                {renderErro('nome')}
              </div>

              <div className="nome-Cadastro">
                <label className='nomeLabel-Cadastro'>E-mail:</label>
                <input type="text" className='NomeIn-Cadastro' placeholder='Ex:mariaKnupp@gmail.com' value={email} onChange={(e) => setEmail(e.target.value)} />
                {renderErro('email')}
              </div>

              
              <div className="nome-Cadastro">
                <label className='nomeLabel-Cadastro'>Idioma Principal:</label>
                <input type="text" className='NomeIn-Cadastro' placeholder='Ex:Português' value={idioma} onChange={(e) => setIdioma(e.target.value)} />
                {renderErro('idioma')}
              </div>
            </div>

            <div className="Input-Cadastro2">
              <div className="nome-Cadastro">
                <label className='nomeLabel-Cadastro'>Nacionalidade:</label>
                <input type="text" className='NomeIn-Cadastro' placeholder='Ex:Brasileira' value={nacionalidade} onChange={(e) => setNacionalidade(e.target.value)} />
                {renderErro('nacionalidade')}
              </div>


              <div className="nome-Cadastro">
                <label className='nomeLabel-Cadastro'>Senha:</label>
                <input
                  type={showSenha ? "text" : "password"}
                  className='NomeIn-Cadastro'
                  placeholder='Ex:1234'
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <img
                  src={showSenha ? "/SenhaVisivel.png" : "/SenhaInvisivel.png"}
                  alt="Toggle senha"
                  className='imgSenha-Cadastro'
                  onClick={() => setShowSenha(!showSenha)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="Erros">{renderErro('senha')}</div>
              </div>

              <div className="nome-Cadastro">
                <label className='nomeLabel-Cadastro'>Confirma senha:</label>
                <input
                  type={showConfirmaSenha ? "text" : "password"}
                  className='NomeIn-Cadastro'
                  placeholder='Ex:1234'
                  value={confirmaSenha}
                  onChange={(e) => setConfirmaSenha(e.target.value)}
                />
                <img
                  src={showConfirmaSenha ? "/SenhaVisivel.png" : "/SenhaInvisivel.png"}
                  alt="Toggle confirma senha"
                  className='imgSenha-Cadastro'
                  onClick={() => setShowConfirmaSenha(!showConfirmaSenha)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="Erros">{renderErro('confirmaSenha')}</div>
              </div>
            </div>
          </div>

          <div className="roxaClaro-Cadastro">
            <div className="divDentroDeOutra-Cadastro">
              <div className="checkbox-wrapper-46">
                <input 
                  type="checkbox" 
                  id="cbx-46" 
                  className="inp-cbx"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)} 
                />
                <label htmlFor="cbx-46" className="cbx">
                  <span>
                    <svg viewBox="0 0 12 10" height="10px" width="12px">
                      <polyline points="1.5 6 4.5 9 10.5 1" />
                    </svg>
                  </span>
                  <span>Li e concordo com os termos de uso</span>
                </label>
              </div>
              {renderErro('termos')}
            </div>

            <div className="DivDoOutroLado-Cadastro">
              <div className="Button-Cadastro">
                <button className='ButtonCa-Cadastrar' onClick={handleCadastro}>
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Cadastro realizado com sucesso!</h2>
            <button onClick={closeModal} style={buttonStyle}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const modalContentStyle = {
  backgroundColor: '#3B444F',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  textAlign: 'center',
  maxWidth: '400px',
  width: '90%',
};

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '20px',
  color: '#2D405A'
};

export default CadastroEscuro;
