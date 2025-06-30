import React, { useState, useEffect  } from 'react'
import "./Saude.css"
// import Modal from '../components/Modal'
import Navbar from '../components/Navbar'
import hospital from '../assets/hospital.png'
import vacinas from '../assets/vacinas.png'


function Saude() {

  const [indiceAtual, setIndiceAtual] = useState(0);

  const imagens = [
   'banner_sus.png',
   'banner_zegotinha.png',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % imagens.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [imagens.length]);

  const vaiParaSlide = (index) => {
    setIndiceAtual(index);
  };

  const ExpandableSection = ({ title, children }) => {
          const [isExpanded, setIsExpanded] = useState(false);
        
  // Função para debug - verifique no console do navegador
  console.log('Caminhos das imagens:', 
    imagens.map(img => `/images/carrossel/${img}`));


          return (
            <div className="expandable-section">
              <div 
                className="section-header" 
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <span className="arrow" style={{ 
                  marginRight: '8px',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease'
                }}>
                  ➤
                </span>
                <h3>{title}</h3>
              </div>
              
              {isExpanded && (
                <div className="section-content">
                  {children}
                </div>
              )}
            </div>
          );
        };

    const [infoAtiva, setInfoAtiva] = useState(null);
      
      const botoesInfo = [
          {
              id: 'onibus',
              label: 'Sus',
              imagem: hospital,
              conteudo: (
                <div className='info-arruma'>
                  <div className='scrollable-container'>
                    <h3 className='tituloFundamental-educação'>O que é o SUS?</h3>
  
                    <p className='pInformativo-educação'>O SUS (Sistema Único de Saúde) é o sistema público de saúde do Brasil. Ele é financiado pelos impostos e mantido pelo governo para garantir que todas as pessoas, sem exceção, tenham acesso à saúde de forma gratuita.</p>
                        <ExpandableSection title="O que o SUS oferece?">
                          <ul>

                            <li><h4>🩺 Consultas médicas</h4> Clínico geral, pediatra, ginecologista, dentista e outros especialistas. <br />Marcação feita nos postos de saúde (UBS/ESF). </li>
                            <li><h4>💉 Vacinas</h4> Para crianças, adolescentes, adultos e idosos. <br />Inclui vacinas obrigatórias, como febre amarela, tétano, hepatite, gripe, COVID-19 etc. </li>
                             <li><h4>🧪 Exames laboratoriais e de imagem</h4> Exames de sangue, urina, raio-X, mamografia, ultrassom e outros.  </li>
                             <li><h4>🤰 Pré-natal e parto humanizado</h4>Acompanhamento completo para grávidas. <br />Direitos garantidos mesmo sem documentos ou residência fixa. </li>
                            <li><h4>🏥 Atendimento de emergência</h4>Em caso de urgência (acidentes, dores fortes, febre alta), vá para a UPA ou hospital público mais próximo.  </li>
                             <li><h4>💊 Medicamentos gratuitos</h4> Muitos remédios podem ser retirados nos postos de saúde com receita médica, especialmente para doenças crônicas como diabetes e hipertensão. </li>
                              <li><h4>🧠 Saúde mental</h4> Atendimento psicológico e psiquiátrico. <br />CAPS (Centros de Atenção Psicossocial) para apoio em casos mais graves.</li>
                          </ul>

                        </ExpandableSection>
  
                        <ExpandableSection title="Quem pode usar o SUS?">
                          <ul>
                            <li><h4>São eles:</h4> - Imigrantes com ou sem visto. <br /> Refugiados. <br /> Pessoas em situação de rua. <br /> Indocumentados (sem CPF ou sem comprovante de residência).</li>
                          </ul>
                        </ExpandableSection>

                        
                        <ExpandableSection title="Onde ir para ser atendido?">
                          <ul>
                            <li><h4>São eles:</h4>UPAs (Unidades de Pronto Atendimento): para emergências. <br /> Postos de saúde (UBS/ESF): para consultas, vacinas, pré-natal e acompanhamento geral. <br /> Hospitais públicos: para casos graves ou cirurgias. <br /> Você pode procurar o posto mais próximo da sua casa.</li>
                          </ul>
                        </ExpandableSection>

                        
                        <ExpandableSection title="O que levar no primeiro atendimento?">
                          <ul>
                            <li><h4>São eles:</h4> Documento de identidade (passaporte, RNE, carteira de refugiado, etc.). <br /> Comprovante de residência (se tiver). <br />CPF (opcional). <br />Cartão do SUS (caso já tenha um). <br /> Atenção: Mesmo sem documentos, o atendimento deve ser realizado. Mas, se tiver, leve.</li>
                          </ul>
                        </ExpandableSection>

                      
                        <h3>Objetivos</h3>
                        <p>Cuidar da sua saúde é um direito fundamental, não importa de onde você vem, quais documentos você tem ou como chegou até aqui. O SUS existe para garantir que todas as pessoas — brasileiras ou imigrantes — sejam acolhidas com dignidade, respeito e acesso a cuidados de saúde gratuitos. Em Florianópolis, você não está sozinho: há um sistema preparado para caminhar com você desde o início da sua nova vida. Sua saúde importa, e você tem com quem contar.
</p>
  

                  </div>
                  </div>
              )
          },
          {
              id: 'bike',
              label: 'Vacinas',
              imagem: vacinas,
              conteudo: (
                 <div className='info-arruma'>
                  <div className='scrollable-container'>
  
                     <h3 className='tituloFundamental-educação'>✅ "Sempre busque deixar a sua caderneta de vacinação atualizada."</h3>
                          <p>Procure o posto de saúde mais próximo da sua casa. </p>
    
                        <h2>  Vacinas Disponiveis na rede publica</h2>

                        <h3> Influenza (gripe)</h3>
                        <ul><li>Disponível para toda a população acima de 6 meses, sem restrições de idade. São aplicadas versões trivalente (H1N1, H3N2 e Influenza B).</li></ul>

                        <h3>Pontos de aplicação:</h3>
                        <ul><li>Postos de saúde das 7h às 17h (exceto Costa da Lagoa e Vila Aparecida) até 9 de maio..</li></ul>
                        <ul><li>No “Dia D” (10 de maio), 30 locais, van da vacinação, Espaço Imuniza, Sesc Prainha </li></ul>


                  </div>
                  </div>
              )
          },
         
          
  
      ];

  return (

    <div className='global-saude'>

 <Navbar/>
       {/* <div className="nav-bar-saude">
        <div className="menu-saude">
            <Modal/>
        </div>
      </div>  */}

        <div className="conteine-desing-saude">
            <div className="azul-saude">
              <div className="carrossel-container">
      <div className="carrossel-track" 
           style={{ transform: `translateX(-${indiceAtual * 100}%)` }}>
        {imagens.map((imagem, index) => (
          <div className="slide" key={index}>
            <img 
              src={`/images/carrossel/${imagem}`} 
              alt={`Slide ${index + 1}`}
              onError={(e) => {
                console.error('Erro ao carregar imagem:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="indicadores">
        {imagens.map((_, index) => (
          <button
            key={index}
            className={`indicador ${index === indiceAtual ? 'ativo' : ''}`}
            onClick={() => vaiParaSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>



            </div>
        </div> 

            <div className="conteine-propagandas-saude"></div>

                <div className="conteine-icones-telao">
                    <div className="conteine-do-canto-esquerdo-saude">
                      <div className='arrumar-butao'>
                        <div className='alguma-coisa-saude'>
                                        {botoesInfo.map((botao) => (
                    <button
                        key={botao.id}
                        className={`info-button ${infoAtiva === botao.id ? 'ativo' : ''}`}
                        onClick={() => setInfoAtiva(botao.id)}
                    >
                        <img src={botao.imagem} alt={botao.label} className="botao-imagem" />
                        <span className='span-oi'>{botao.label}</span>
                    </button>
                ))}  
                        </div>
                      </div>
                    
                    </div>

                    <div className='Cinza2-educação'>
              <div className='info-box'>
                {infoAtiva ? (
                    botoesInfo.find(b => b.id === infoAtiva).conteudo
                ) : (
                    <p className='p-trans'>Selecione um modal de educação</p>
                )}
              </div>
                
            

            </div>
                </div>
                
                    <div className="mapa-saude">

                           <div className='google-maps'><iframe src="https://www.google.com/maps/d/u/1/embed?mid=17XHPIibzBTiAtwvbIYDEdnIQCO7FoB8&ehbc=2E312F&noprof=1" width="640" height="480" className='mapa' ></iframe> </div>
                    </div>

                        <div className="roda-pe-saude"></div>

    </div>
  )
}

export default Saude
