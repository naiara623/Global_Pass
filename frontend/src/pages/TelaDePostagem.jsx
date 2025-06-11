import React, { useState, useRef } from 'react'
import './TelaDePostagem.css'
import { useNavigate } from 'react-router-dom';

function TelaDePostagem({ addPost }) {

 const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);

const handlePost = () => {
  if (image && caption) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const newPost = {
      id: Date.now(),
      username: currentUser.email,
      userImage: currentUser.profileImage || null,
      userName: currentUser.nome,
      imageUrl: URL.createObjectURL(image),
      caption,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString()
    };

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Atualiza o usuário com o novo post
    currentUser.posts = currentUser.posts || [];
    currentUser.posts.push(newPost.id);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    navigate('/Perfilpostagem');
  } else {
    alert('Por favor, adicione uma imagem e uma legenda');
  }
};
  

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  
  return (
    <div className='div-q-inglobaTudo-TLPostagem'>

        <div className="din-navbar-TLPostagem">
                <div className='div-arrow-TLPostagem' > 
 <button className='buton-arrow-TLpostagem' onClick={() => navigate('/postagem')}>
            <img src="Voltar.png" alt="" className='arrow-TLpostagem'/>
          </button>
                </div>
                
                <img src="" alt="" />
        </div>

        <div className='ingloba-post-text-butão-TLpostagem'>

            <div className='div-Q-ingloba-conteDa-post' >
                <div className='div-vazia-TLpostagem' ></div>
                <div className='conteine-DaPostagem-TLpostagem' >
                     {image ? (
              <img 
                src={URL.createObjectURL(image)} 
                alt="Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div 
                onClick={triggerFileInput}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '2px dashed #ccc'
                }}
              >
                <p>Clique para adicionar uma imagem</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            )}
                </div>
                <div className="div-2vazia-TLpostagem"></div>
            </div>


            <div className='div-Q-ingloba-conteDa-legenButton' >
                 <div className='conteine-dalegenda-TLpostagem' >

                        <div className='conteine-1vazio-TLpostagem' ></div>

                            <div className='conteine-DA-legenda' >
                                <input  type="text" 
                placeholder='Adicione uma legenda...' 
                className='input-legenda'
                value={caption}
                onChange={(e) => setCaption(e.target.value)}/>
                            </div>

                        <div className='conteine-2vazio-TLpostagem' ></div>
                     </div>
        
                  <div className="conteine-butao">

                    <button className='Butao-postar-TLpostagem'  onClick={handlePost} >Postar</button>
                  </div>
            </div>

           
        </div>









    </div>
  )
}

export default TelaDePostagem