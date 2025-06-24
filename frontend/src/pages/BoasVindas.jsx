import './BoasVindas.css'
import { useNavigate } from 'react-router-dom';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

function BoasVindas() {

    const navigate = useNavigate();

  const irParaTela2 = () => {
    navigate('/cadastro');
  };

  const irParaTela3 = () => {
    navigate('/login');
  };

  const irParaTela4 = () => {
    navigate('/telainicial');
  };


  return (
    <div className='amarela-BoasVindas'>
        <style>
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
</style>

            
             <div className="vermelha-BoasVindas">
                   <button className='botaoEntrar-boasvindas' onClick={irParaTela4}>ENTRAR</button>
                   <button className='botaoLogin-boasvindas' onClick={irParaTela3} >LOGIN</button>
             </div>

                    <div className="Roxa-BoasVindas">
                        <div className="verdemusgo-BoasVindas">
                                <div className="button_BoasVindas">

                                    <div className='Branca-Boasvindas'>
                                        <p className='Logo-Boasvindas'>GlobalPass</p>
                                    </div>

                                    <div className='div-button-cadastro-Boasvindas'>
                                        <button className='button-cadastro-BoasVindas' onClick={irParaTela2} >Cadastro</button>
                                    </div>

                                </div>
                        </div>

                            <div className="verdeEscuro-BoasVindas">
                                <div className="circulo-BoasVINDAS"></div>
                                <div className="Quadrado-BoasVINDAS"></div>
                            </div>
                   </div>

               <div className="verdeClaro-BoasVindas"></div>
               <div className="laranja-BoasVindas"></div>

                 <div className="Rosa-BoasVindas">
                    <div className='Bem-vindo' >Bem-vindo à GlobalPass!</div>
                        <div className="carrossel-infor-BoasVindas">
                            <Splide
                                options={{
                                type: 'loop',
                                perPage: 1,
                                autoplay: true,
                                interval: 10000,
                                pauseOnHover: true,
                                arrows: true,
                                pagination: true,
                                gap: '1rem',
                                }}
                                aria-label="Imagens de exemplo"
                            >
                                <SplideSlide>
                                <img src="banner_GLP.png
                                " alt="" className='banner_GPL-boasvindas'/>
                                
                                </SplideSlide>

                                <SplideSlide>
                                <img src="banner_saude.png
                                " alt="" className='banner_saude-boasvindas' />
                                </SplideSlide>

                                <SplideSlide>
                                <img src="banner_passe.png
                                " alt="" className='banner_passe-boasvindas' />
                                </SplideSlide>

                                 <SplideSlide>
                                <img src="banner_educacao.png
                                " alt="" className='banner_educacao-boasvindas' />
                                </SplideSlide>
                            </Splide>
                                                     
                                

                        </div> 
                </div>


                <div className="roxo-BoasVindas">
                    <div className="icones-presentação-boasvindas">

                        <img src="icone-estudante.png" alt="" className='icone-estudante' />
                        <img src="icone-hospital.png" alt="" className='icone-hospital' />
                        <img src="icone-tranporte.png" alt="" className='icone-trasporte' />
                        <img src="icone-entreterimento.png" alt="" className='icone-entreterimento' />
                        <img src="icone-viajante.png" alt="" className='icone-viajante' />
                    </div>

                    <div className="texto1-boasvindas">Apoio completo para imigrantes em Florianópolis</div>
                    <div className="texto2-Boasvindas">Encontre aqui tudo o que você precisa saber sobre educação,  saúde, transporte, <br />entreterimento e muito mais para começar sua nova vida com segurança e confiança.</div>
                </div>

                <div className="marrom-BoasVinda">
                    <div className="icones">
                            <img src="instagram-circle-icone.png" alt="" className='instagram'/>
                            <img src="linkedin-circled-icone.png" alt="" className='linkedin'/>
                            <img src="whatsapp_Icone.png" alt="" className='whatsapp'/>
                            <img src="youtube-play-icone.png" alt="" className='YouTube'/>
                    </div>

                    <div className="links-boasvindas">
                            
                            <h2 className='numero' > (00) 0000-0000</h2> <h2 className='gmail' >globalpass.nkl@gmail.com</h2>
                    </div>


                </div>

    </div>
  )
}

export default BoasVindas


