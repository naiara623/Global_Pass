import React, { useState, useRef, useEffect } from 'react';
import './PerfilDePostagem.css';
import { useNavigate } from 'react-router-dom';

function PerfilDePostagem() {
  const navigate = useNavigate();
  
  const telaPost = () => {
    navigate('/postagem');
  };

  const [user, setUser] = useState(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
      nome: 'Nome do Usuário',
      email: 'usuario@exemplo.com',
      followers: 245,
      following: 178,
      posts: 0
    };
    
    return {
      ...currentUser,
      profileImage: currentUser.profileImage || null,
      previewImage: currentUser.profileImage || null
    };
  });
  
  const fileInputRef = useRef(null);
  const [userPosts, setUserPosts] = useState([]);

  // Estilos definidos como objetos constantes
  const styles = {
    initialLetter: {
      fontSize: '40px',
      color: '#fff'
    },
    postContainer: {
      marginBottom: '20px',
      position: 'relative'
    },
    postImage: {
      width: '100%',
      borderRadius: '8px'
    },
    deleteButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'red',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '5px 10px',
      cursor: 'pointer'
    },
    noPostsMessage: {
      textAlign: 'center',
      padding: '20px'
    },
    fileInput: {
      display: 'none'
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = {
          ...user,
          profileImage: reader.result,
          previewImage: reader.result
        };
        setUser(updatedUser);
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const updatedCurrentUser = {
          ...currentUser,
          profileImage: reader.result
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
      const filteredPosts = storedPosts.filter(post => 
        post.username === currentUser.email
      );
      setUserPosts(filteredPosts);
      setUser(prev => ({
        ...prev,
        posts: filteredPosts.length
      }));
    }
  }, []);

  const handleDeletePost = (postId) => {
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const updatedPosts = allPosts.filter(post => post.id !== postId);
    
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setUserPosts(updatedPosts.filter(post => 
      post.username === JSON.parse(localStorage.getItem('currentUser')).email
    ));
    
    setUser(prev => ({
      ...prev,
      posts: updatedPosts.filter(post => 
        post.username === JSON.parse(localStorage.getItem('currentUser')).email
      ).length
    }));
  };

  // Função para gerar o estilo da foto de perfil de forma segura
  const getProfileImageStyle = () => {
    const imageUrl = user.previewImage || 
                    (JSON.parse(localStorage.getItem('currentUser'))?.profileImage);
    
    if (imageUrl) {
      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {};
  };

  return (
    <div className='div-q-inglobaTudo-PerfPostagem'>
      <div className='Navbar-PerfPostagem'>
        <button onClick={telaPost}>
          <img src="Arrow.png" alt="" className='arrow-PerfPostagem' />
        </button>
      </div>

      <div className='Conteine-foto-nomeUser-PerfPostagem'>
        <div className='conteine-da-fotoPerfil-PerfPostagem'>
          <div 
            className='fotoPerfil-PerfPostagem'
            onClick={handleUploadClick}
            style={getProfileImageStyle()}
          >
            {!user.previewImage && 
             !(JSON.parse(localStorage.getItem('currentUser'))?.profileImage) && (
              <span style={styles.initialLetter}>
                {user.nome.charAt(0)}
              </span>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={styles.fileInput}
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
  <p>@{user.username || user.email?.split('@')[0]}</p>
</div>
      </div>

      <div className='conteine-da-postagens-PerfPostagem'>
        <div className='conteine-texto-publicaçoes-PerfPostagem'>
          <h3>Publicações</h3>
        </div>

        <div className='conteine-das-publicaçoes'>
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <div key={post.id} style={styles.postContainer}>
                <img 
                  src={post.imageUrl} 
                  alt="Post" 
                  style={styles.postImage}
                />
                <p>{post.caption}</p>
                <button 
                  onClick={() => handleDeletePost(post.id)}
                  style={styles.deleteButton}
                >
                  Excluir
                </button>
              </div>
            ))
          ) : (
            <p style={styles.noPostsMessage}>
              Nenhuma publicação ainda
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilDePostagem;