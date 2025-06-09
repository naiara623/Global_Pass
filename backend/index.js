const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { insertUser, selectUser } = require("./db");
//aaaaaaaaaaa
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Rota de cadastro
app.post('/api/cadastro', async (req, res) => {
  const {
    nome,
    email,
    idioma,
    nacionalidade,
    senha,
  } = req.body;

  console.log('Senha recebida:', senha); // 👈 Adicione isso para testar

  try {
    await insertUser({
      nome,
      email,
      idioma,
      nacionalidade,
      senha,
    });

    res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    console.error('Erro no cadastro:', error.message);
    if (error.message === 'Email já cadastrado') {
      res.status(409).json({ erro: 'Email já cadastrado' });
    } else {
      res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }
  }
});




// Rota de login
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await selectUser(email, senha);
    if (usuario) {
      res.json({ sucesso: true, usuario });
    } else {
      res.status(401).json({ erro: "Credenciais inválidas" });
    }
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
});

app.get('/api/cadastro', (req, res) => {
  res.send('Rota GET funcionando!'); 
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
