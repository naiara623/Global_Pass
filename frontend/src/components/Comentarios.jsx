import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Comentarios.css";

const Comentarios = ({ comentariosExtras = [], onResponder }) => {
  const [index, setIndex] = useState(0);
  const [respostas, setRespostas] = useState({});

  const proximoComentario = () => {
    setIndex((prevIndex) => (prevIndex + 1) % comentariosExtras.length);
  };

  const comentarioAnterior = () => {
    setIndex((prevIndex) => (prevIndex - 1 + comentariosExtras.length) % comentariosExtras.length);
  };

  const handleResponder = (usuario) => {
    if (onResponder) {
      onResponder(usuario);
    }
  };

  const adicionarResposta = (usuario, resposta) => {
    const novaResposta = {
      usuario: "Você",
      texto: resposta,
      tempo: "Agora"
    };

    setRespostas(prev => ({
      ...prev,
      [usuario]: [...(prev[usuario] || []), novaResposta]
    }));
  };

useEffect(() => {
  async function fetchComentarios() {
    try {
      const res = await fetch("http://localhost:3001/api/comentarios", {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Erro ao carregar comentários");
      const data = await res.json();

      const formatados = data.map(item => ({
        usuario: item.user_name || "Usuário",
        texto: item.comentario,
        tempo: "Agora"
      }));

      setComentarios(formatados);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
  }

  fetchComentarios();
}, []);

   useEffect(() => {
    const container = document.querySelector(".comentarios-container");
    const handleScroll = (event) => {
      if (event.deltaY > 0) proximoComentario();
      else comentarioAnterior();
    };

    if (container) {
      container.addEventListener("wheel", handleScroll);
      return () => {
        container.removeEventListener("wheel", handleScroll);
      };
    }
  }, [comentariosExtras.length]);

  if (comentariosExtras.length === 0) {
    return <div className="comentarios-container">Nenhum comentário ainda.</div>;
  }

  return (
    <div className="comentarios-container">
      <div className="comentario-stack"></div>
      <div className="comentario-stack"></div>
      <div className="comentario-stack"></div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="comentario-card"
        >
          <div className="comentarios-arruma-pelo-amor-de-deus">
            <div className="flex items-center">
              <div className="comentario-avatar" />
              <div className="comentario-arrumar">
                <span className="font-bold">{comentariosExtras[index]?.usuario}</span>
                <span className="ml-2 comentario-texto">{comentariosExtras[index]?.texto}</span>
              </div>
            </div>

            <div className="comentario-footer">
 {comentariosExtras[index]?.tempo} •{" "}
                 <span
                onClick={() => handleResponder(comentariosExtras[index]?.usuario)}
                style={{ cursor: "pointer" }}
              >
                Responder
              </span>
            </div>

            {/* Respostas */}
            {respostas[comentariosExtras[index]?.usuario]?.map((resposta, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="resposta-card"
              >
                <div className="flex items-center">
                  <div className="comentario-avatar resposta-avatar" />
                  <div className="comentario-arrumar">
                    <span className="font-bold">{resposta.usuario}</span>
                    <span className="ml-2 comentario-texto">{resposta.texto}</span>
                  </div>
                </div>
                <div className="comentario-footer resposta-footer">
                  {resposta.tempo}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Comentarios;