import React, { useState, useEffect } from 'react';
import './GlobalPost.css'
import { useNavigate } from 'react-router-dom';

function GlobalPost() {

  const telacriaPost = () => {
   navigate('/realizarpostagem');
 };
   const voltar = () => {
   navigate('/telainicial');
 };
   const irparaperfil = () => {
   navigate('/perfildeusuario')
 };
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/posts-todos', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Erro ao buscar publicações');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchAllPosts();
  }, []);

  return (
   <div className='body-globalpost'>
    <div className='navbar-globalpost'>
        <div className='logo-globalpost' >
          <button className='vouchorar' onClick={voltar}><h2 className='h2-da-logo-globalpost' >GlobalPost</h2></button>
        </div>
              <div className='conteine-vazio-navbar' ></div>
       
                <button className='vouchorar' onClick={irparaperfil}> <div className='conteine-icoUser-navnar-globalpost' > <img src="icone-usuario.png" alt=""  className='icoUser-navnar-globalpos' />     </div></button>
           
    </div>
{/* é só um imput com um texto ao lado do button */}
    <div className='div-do-button-globalpost'>
          <div className='div-do-butao-postagem-globalpost' ><button onClick={telacriaPost} className='butao-postagem-globalpost' >Faça uma nova postagem</button> </div>
          <div className='div-butao-MAIS-globalpost' ><button onClick={telacriaPost} className='butao-MAIS-globalpost'>+</button></div>
    </div>

      <div className='div-das-postagens-globalpost'>
       {error && <p className="error-message">{error}</p>}
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className='conteine-de-uma-postagem-globalpost'>
              <div className='containe-do-nome-foto-globalpost'>
  <img   src={post.userImage ? `http://localhost:3001${post.userImage}` : '/usuario-img.jpeg'} 
  alt="Usuário"  className='icone-usuario-globalpost' />
  <h1>{post.username}</h1>
</div>
<div className='conteine-DA-postagem-globalpost'>
  <img src={`http://localhost:3001${post.imageUrl}`} alt="Post" />
</div>
              <p>{post.caption}</p>
              {/* curtidas, comentários */}
            </div>
          ))
        ) : (
          <p>Nenhuma postagem ainda.</p>
        )}
      </div>
    </div>
  )
}

export default GlobalPost