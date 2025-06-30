import React, { useState, useRef } from 'react'
import './TelaDePostagem.css'
import { useNavigate } from 'react-router-dom';

function TelaDePostagem({ addPost }) {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const triggerFileInput = () => fileInputRef.current.click();

 const handleImageChange = e => {
  if (e.target.files[0]) {
    console.log("Imagem selecionada:", e.target.files[0]);
    setImageFile(e.target.files[0]);
  }
};

  const handlePost = async () => {
    if (!imageFile || !caption) {
      setError('Por favor, escolha uma imagem e adicione uma legenda.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('caption', caption);

      const res = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erro || 'Erro ao criar postagem');
      }

      navigate('/perfildeusuario');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className='div-q-inglobaTudo-TLPostagem'>

        <div className="din-navbar-TLPostagem">
                <div className='div-arrow-TLPostagem' > 
 <button onClick={() => navigate('/postagem')}>
            <img src="Arrow.png" alt="" className='arrow-TLpostagem'/>
          </button>
                </div>
        </div>

        <div className='ingloba-post-text-butão-TLpostagem'>

            <div className='div-Q-ingloba-conteDa-post' >
                <div className='div-vazia-TLpostagem' ></div>
                <div className='conteine-DaPostagem-TLpostagem' >
  <input
    type="file"
    ref={fileInputRef}
    accept="image/*"
    onChange={handleImageChange}
    style={{ display: 'none' }}
  />
  {imageFile ? (
    <img src={URL.createObjectURL(imageFile)} alt="Preview" />
  ) : (
    <div onClick={triggerFileInput} className='upload-placeholder'>
      <p>Clique para adicionar imagem</p>
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
        onChange={e => setCaption(e.target.value)}/>
                            </div>

  {error && <p className="error-message">{error}</p>}

                        <div className='conteine-2vazio-TLpostagem' ></div>
                     </div>
        
                  <div className="conteine-butao">

                    <button className='Butao-postar-TLpostagem'  onClick={handlePost} >    {loading ? 'Postando...' : 'Postar'}
                    </button>
                  </div>
            </div>

           
        </div>

    </div>
  )
}

export default TelaDePostagem

