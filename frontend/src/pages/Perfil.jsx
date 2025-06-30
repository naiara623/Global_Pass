import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';
import ModalPerfil from '../components/ModalPerfil';

function Perfil() {
 const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState({
    nome: 'Carregando...',
    email: '',
    followers: 0,
    following: 0,
    posts: 0,
    profileImage: null,
    previewImage: null,
  });
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/usuario-atual?email=${user.email}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Erro ao carregar dados');
        const userData = await response.json();
        setUser(prev => ({
          ...prev,
          email: userData.email,
          nome: userData.nome || 'Usuário',
          previewImage: userData.profile_image || null,
        }));
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        if (err.message.includes('Não autenticado')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserEmail();
  }, [navigate]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts-do-usuario?email=${encodeURIComponent(user.email)}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Erro ao buscar posts');

        const posts = await response.json();
        setUserPosts(posts);
        setUser(prev => ({ ...prev, posts: posts.length }));
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };

  if (user.email && user.email !== '') {
  fetchUserPosts();
}
  }, [user.email]);

  const handleProfileUpdate = (updatedData) => {
    setUser(prev => ({
      ...prev,
      nome: updatedData.nome,
      nacionalidade: updatedData.nacionalidade,
      idioma: updatedData.idioma,
      telefone: updatedData.telefone,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
   formData.append('profileImage', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload-profile-image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) throw new Error('Erro ao fazer upload');

      const { imageUrl } = await response.json();

      setUser(prev => ({
        ...prev,
        profileImage: imageUrl,
        previewImage: imageUrl,
      }));
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Erro ao deletar post');

      setUserPosts(prev => prev.filter(post => post.id !== postId));
      setUser(prev => ({ ...prev, posts: prev.posts - 1 }));
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className='div-q-inglobaTudo-PerfPostagem'>
      <div className='Navbar-PerfPostagem'>
        <button className='arrow-PerfilPostagem' onClick={() => navigate('/postagem')}>
          <img src="Arrow.png" alt="Voltar" className='arrow-PerfPostagem2' />
        </button>
        <div className='editar-perfilPostagem'>
      <ModalPerfil usuario={user} onProfileUpdate={handleProfileUpdate} />
        </div>
      </div>

      <div className='Conteine-foto-nomeUser-PerfPostagem'>
        <div className='conteine-da-fotoPerfil-PerfPostagem'>
          <div 
            className='fotoPerfil-PerfPostagem'
             onClick={() => fileInputRef.current.click()}
             style={user.previewImage ? { 
             backgroundImage: `url(http://localhost:3001${user.previewImage})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
  } : {}}
          >
            {!user.previewImage && (
              <span style={{ fontSize: '40px', color: '#fff' }}>
                {user.nome.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        <div className='n°-seguidores-seguindo-PerfPostagem'>
          <div className='stat-item'>
            <div className='stat-number'>{userPosts.length}</div>
            <div className='stat-label'>Publicações</div>
          </div>
          <div className='stat-item'>
            <div className='stat-number'>{user.followers}</div>
            <div className='stat-label'>Seguidores</div>
          </div>
          <div className='stat-item'>
            <div className='stat-number'>{user.following}</div>
            <div className='stat-label'>Seguindo</div>
          </div>
        </div>

        <div className='texto-dos-numeros-PerfPostagem'>
          <h2>{user.nome}</h2>
          <p>@{user.email.split('@')[0]}</p>
        </div>
      </div>

      <div className='conteine-da-postagens-PerfPostagem'>
        <div className='conteine-texto-publicaçoes-PerfPostagem'>
          <h3>Publicações</h3>
        </div>
        <div className='conteine-das-publicaçoes'>
         {userPosts.length > 0 ? (
            userPosts.map(post => (
              <div key={post.id} className="post-container">
             <img 
  src={`http://localhost:3001${post.imageUrl}`} 
  alt="Post" 
  style={{ width: '100%', borderRadius: '8px' }}
/>
                <p>{post.caption}</p>
                <button 
                  onClick={() => handleDeletePost(post.id)}
                  style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    background: 'red', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '5px 10px', 
                    cursor: 'pointer' 
                  }}>
                  Excluir
                </button>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', padding: '20px' }}>
              Nenhuma publicação ainda
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Perfil;